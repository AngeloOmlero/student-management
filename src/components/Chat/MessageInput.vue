<template>
  <div class="message-input-container">
    <div class="message-input">
      <input
        type="text"
        v-model="message"
        placeholder="Type a message"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">
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
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default defineComponent({
  name: 'MessageInput',
  setup() {
    const message = ref('')
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

              stompClient?.subscribe('/user/queue/private', (payload) => {
                try {
                  const receivedMessage = JSON.parse(payload.body)
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
                } catch (err) {
                  console.error('Error parsing message:', err)
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

    // Disconnect on unmount
    onUnmounted(() => {
      if (stompClient?.connected) {
        stompClient.disconnect(() => {
          console.log('STOMP disconnected')
        })
      }
    })

    function sendMessage() {
      if (
        !message.value.trim() ||
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
      }

      console.log('Sending message via WebSocket:', chatMessage)
      stompClient.send(
        '/app/chat.privateMessage',
        { Authorization: `Bearer ${authStore.token}` },
        JSON.stringify(chatMessage),
      )

      // **Do NOT add to store immediately** — wait for backend broadcast
      message.value = ''
    }

    return {
      message,
      sendMessage,
    }
  },
})
</script>

<style scoped>
.message-input-container {
  padding: 10px 16px;
  background-color: #f0f2f5;
}
.message-input {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 25px;
  padding: 5px 10px;
}
input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 1em;
}
button {
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
</style>
