<template>
  <div class="message-input-container">
    <div v-if="uploadedFileName" class="uploaded-file-preview">
      <span>{{ uploadedFileName }} ready to send.</span>
      <button @click="clearUploadedFile" class="clear-file-button">
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
          />
        </svg>
      </button>
    </div>
    <div class="message-input">
      <input
        type="text"
        v-model="message"
        placeholder="Type a message"
        @keyup.enter="sendMessage"
      />
      <input
        type="file"
        ref="fileInput"
        style="display: none"
        @change="handleFileUpload"
      />
      <button @click="triggerFileUpload" class="attach-button">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M16.5 6V17.5C16.5 19.71 14.71 21.5 12.5 21.5C10.29 21.5 8.5 19.71 8.5 17.5V5C8.5 3.62 9.62 2.5 11 2.5C12.38 2.5 13.5 3.62 13.5 5V15.5C13.5 16.05 13.05 16.5 12.5 16.5C11.95 16.5 11.5 16.05 11.5 15.5V6H10V15.5C10 16.88 11.12 18 12.5 18C13.88 18 15 16.88 15 15.5V5C15 2.79 13.21 1 11 1C8.79 1 7 2.79 7 5V17.5C7 20.54 9.46 23 12.5 23C15.54 23 18 20.54 18 17.5V6H16.5Z"
          />
        </svg>
      </button>
      <button @click="sendMessage" class="send-button">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onUnmounted } from 'vue'
import { useAuthStore } from '../../stores/auth.store'
import { useChatStore } from '../../stores/chat.store'
import { uploadFile } from '../../services/file.service'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import axios from 'axios'
import { MessageType } from '../../types/chat'
import { PresenceStatus } from '../../types/chat' // Import PresenceStatus

export default defineComponent({
  name: 'MessageInput',
  setup() {
    const message = ref('')
    const fileInput = ref<HTMLInputElement | null>(null)
    const uploadedFileUrl = ref<string | null>(null)
    const uploadedFileName = ref<string | null>(null)
    const isTyping = ref(false)
    let typingTimeout: ReturnType<typeof setTimeout> | null = null

    const authStore = useAuthStore()
    const chatStore = useChatStore()

    let stompClient: Stomp.Client | null = null

    // Connect to WebSocket when user is available
    watch(
      () => authStore.user,
      (user) => {
        if (user && (!stompClient || !stompClient.connected)) {
          const socket = new SockJS('http://localhost:8080/ws')
          stompClient = Stomp.over(socket)

          stompClient.debug = (str: string) => console.log('STOMP Debug:', str)

          stompClient.connect(
            { Authorization: `Bearer ${authStore.token}` }, // Authorization header
            (frame) => {
              console.log('WebSocket connected!', frame)

              // Subscribe to private messages
              stompClient?.subscribe('/user/queue/private', (payload) => {
                try {
                  const receivedMessage = JSON.parse(payload.body)
                  console.log('Received message on /user/queue/private:', receivedMessage); // Broad log
                  // Handle typing notifications
                  if (receivedMessage.type === MessageType.TYPING) {
                    console.log(`Received TYPING from ${receivedMessage.sender}`)
                    chatStore.setTypingStatus(receivedMessage.sender, true)
                    console.log('chatStore.typingStatus after TYPING:', chatStore.typingStatus)
                  } else if (receivedMessage.type === MessageType.STOP_TYPING) {
                    console.log(`Received STOP_TYPING from ${receivedMessage.sender}`)
                    chatStore.setTypingStatus(receivedMessage.sender, false)
                    console.log('chatStore.typingStatus after STOP_TYPING:', chatStore.typingStatus)
                  } else {
                    // Regular chat message
                    const receiver =
                      receivedMessage.receiver === chatStore.activeChat
                        ? receivedMessage.receiver
                        : receivedMessage.sender

                    // Avoid duplicates
                    if (
                      !chatStore.conversations[receiver]?.some((m) => m.id === receivedMessage.id)
                    ) {
                      chatStore.addMessage(receivedMessage)
                    }
                  }
                } catch (err) {
                  console.error('Error parsing message:', err)
                }
              })

              // Subscribe to public presence updates
              stompClient?.subscribe('/topic/public.presence', (payload) => {
                try {
                  const presenceUpdate = JSON.parse(payload.body)
                  console.log('Received presence update:', presenceUpdate)
                  chatStore.setOnlineStatus(
                    presenceUpdate.username,
                    presenceUpdate.status === PresenceStatus.ONLINE,
                  )
                  console.log('chatStore.users after presence update:', chatStore.users); // Log users array
                } catch (err) {
                  console.error('Error parsing presence update:', err)
                }
              })
            },
            (error) => {
              console.error('WebSocket connection error:', error)
            },
          )
        }
      },
      { immediate: true },
    )

    // Watch message input for typing indicator
    watch(message, (newValue, oldValue) => {
      if (!authStore.user || !chatStore.activeChat || !stompClient?.connected) return

      if (newValue.length > 0 && !isTyping.value) {
        isTyping.value = true
        sendTypingStatus(MessageType.TYPING)
        console.log('Sending TYPING status')
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }

      typingTimeout = setTimeout(() => {
        if (isTyping.value) {
          isTyping.value = false
          sendTypingStatus(MessageType.STOP_TYPING)
          console.log('Sending STOP_TYPING status (timeout)')
        }
      }, 1000) // Send stop typing after 1 second of inactivity
    })

    // Disconnect on unmount
    onUnmounted(() => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {
          console.log('STOMP disconnected')
        })
      }
    })

    function sendTypingStatus(type: MessageType) {
      if (!authStore.user || !chatStore.activeChat || !stompClient?.connected) return

      const typingMessage = {
        sender: authStore.user.username,
        receiver: chatStore.activeChat,
        type: type,
        timestamp: Date.now(),
        content: '', // Content is not relevant for typing status
      }
      stompClient.send(
        '/app/chat.typing',
        { Authorization: `Bearer ${authStore.token}` },
        JSON.stringify(typingMessage),
      )
      console.log(`Sent typing status: ${type} to ${chatStore.activeChat}`)
    }

    function sendMessage() {
      if (
        (!message.value.trim() && !uploadedFileUrl.value) || // Check for either text or file
        !chatStore.activeChat ||
        !authStore.user ||
        !stompClient?.connected
      )
        return

      const chatMessage = {
        id: Date.now(), // temporary unique id
        sender: authStore.user.username,
        receiver: chatStore.activeChat,
        content: message.value,
        timestamp: Date.now(),
        delivered: false,
        read: false,
        fileUrl: uploadedFileUrl.value, // Include uploaded file URL
        type: MessageType.CHAT, // Explicitly set type to CHAT
      }

      console.log('Sending message via WebSocket:', chatMessage)
      stompClient.send(
        '/app/chat.privateMessage',
        { Authorization: `Bearer ${authStore.token}` },
        JSON.stringify(chatMessage),
      )

      // Clear typing timeout and send STOP_TYPING if currently typing
      if (typingTimeout) {
        clearTimeout(typingTimeout)
        typingTimeout = null
      }
      if (isTyping.value) {
        isTyping.value = false
        sendTypingStatus(MessageType.STOP_TYPING)
        console.log('Sending STOP_TYPING status (message sent)')
      }

      // **Do NOT add to store immediately** — wait for backend broadcast
      message.value = ''
      uploadedFileUrl.value = null // Clear uploaded file state
      uploadedFileName.value = null // Clear uploaded file state
    }

    function triggerFileUpload() {
      fileInput.value?.click()
    }

    async function handleFileUpload(event: Event) {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const fileSizeLimit = 2 * 1024 * 1024 // 2MB
      if (file.size > fileSizeLimit) {
        alert('File size exceeds the 2MB limit. Please choose a smaller file.')
        target.value = '' // Clear the input so the same file can be selected again
        return
      }

      try {
        const response = await uploadFile(file)
        uploadedFileUrl.value = response.url
        uploadedFileName.value = file.name
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 413) {
          alert('File size exceeds the 2MB limit. Please choose a smaller file.')
        } else {
          console.error('Error uploading file:', error)
          alert('There was an error uploading your file. Please try again.')
        }
        uploadedFileUrl.value = null
        uploadedFileName.value = null
      } finally {
        target.value = '' // Always clear the file input value
      }
    }

    function clearUploadedFile() {
      uploadedFileUrl.value = null
      uploadedFileName.value = null
      if (fileInput.value) {
        fileInput.value.value = '' // Also clear the actual file input
      }
    }

    return {
      message,
      sendMessage,
      fileInput,
      uploadedFileUrl,
      uploadedFileName,
      triggerFileUpload,
      handleFileUpload,
      clearUploadedFile,
    }
  },
})
</script>

<style scoped>
.message-input-container {
  padding: 10px 16px;
  background-color: #f0f2f5;
}
.uploaded-file-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #e0e0e0;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: #333;
}
.clear-file-button {
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.clear-file-button:hover {
  color: #000;
}
.message-input {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 25px;
  padding: 5px 10px;
}
input[type='text'] {
  flex-grow: 1;
  padding: 10px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1em;
}
.attach-button,
.send-button {
  padding: 8px;
  border: none;
  background: transparent;
  color: #075e54;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.attach-button:hover,
.send-button:hover {
  background-color: rgba(7, 94, 84, 0.1);
}
</style>
