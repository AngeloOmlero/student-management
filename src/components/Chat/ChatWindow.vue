<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="chat-info">
        <div class="chat-name">{{ chatFullName }}</div>
        <div :class="['online-indicator-header', activeChatPartnerOnlineStatus ? 'online' : 'offline']"></div>
        <div v-if="isTypingInActiveChat" class="typing-indicator">
          <span>is typing</span>
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>
    </div>

    <div class="message-area" ref="messageArea">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="{
          sent: message.sender === authStore.user?.username,
          received: message.sender !== authStore.user?.username,
        }"
      >
        <p v-if="message.content">{{ message.content }}</p>
        <div v-if="message.fileUrl" class="file-attachment">
          <template v-if="isImage(message.fileUrl)">
            <img
              :src="`http://localhost:8080${message.fileUrl}`"
              alt="Uploaded Image"
              class="uploaded-image"
              @click="confirmDownload(`http://localhost:8080${message.fileUrl}`, getFileName(message.fileUrl))"
            />
          </template>
          <template v-else>
            <a
              href="#"
              @click.prevent="confirmDownload(`http://localhost:8080${message.fileUrl}`, getFileName(message.fileUrl))"
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M18,20V9H13V4H6V20H18M12,19L8,15H11V12H13V15H16L12,19Z"
                />
              </svg>
              <span>{{ getFileName(message.fileUrl) }}</span>
            </a>
          </template>
        </div>
        <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
      </div>
    </div>

    <DownloadConfirmModal
      :is-visible="showDownloadModal"
      :file-name="fileToDownloadName || ''"
      :file-url="fileToDownloadUrl || ''"
      @confirm="handleDownloadConfirm"
      @cancel="handleDownloadCancel"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../stores/chat.store'
import { useAuthStore } from '../../stores/auth.store'
import type { PrivateMessage } from '../../types/chat'
import DownloadConfirmModal from '../Shared/DownloadConfirmModal.vue'

export default defineComponent({
  name: 'ChatWindow',
  components: {
    DownloadConfirmModal,
  },
  props: { chat: { type: String, required: true } },
  setup(props) {
    const chatStore = useChatStore()
    const authStore = useAuthStore()
    const { conversations, users } = storeToRefs(chatStore) // Keep other destructured refs
    // Access typingStatus directly from the store for reactivity
    const typingStatus = chatStore.typingStatus;
    const messageArea = ref<HTMLElement | null>(null)

    const showDownloadModal = ref(false)
    const fileToDownloadUrl = ref<string | null>(null)
    const fileToDownloadName = ref<string | null>(null)

    // Messages for the current chat
    const messages = computed<PrivateMessage[]>(() => conversations.value[props.chat] || [])

    // Full name of the chat user
    const chatFullName = computed(() => {
      const user = users.value.find((u) => u.username === props.chat)
      return user?.fullName || props.chat || 'Unknown'
    })

    // New: Computed property for active chat partner's online status
    const activeChatPartnerOnlineStatus = computed(() => {
      const partner = users.value.find(user => user.username === props.chat);
      return partner?.isOnline || false;
    });

    // New: Computed property for typing indicator
    const isTypingInActiveChat = computed(() => {
      const isTyping = typingStatus[props.chat] || false; // Access directly
      console.log(`Typing status for ${props.chat}: ${isTyping}`);
      return isTyping;
    })

    const scrollToBottom = () => {
      if (messageArea.value) messageArea.value.scrollTop = messageArea.value.scrollHeight
    }

    const formatTimestamp = (ts: string | number | Date) => {
      const date = new Date(ts)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const getFileName = (url: string) => {
      return url.split('/').pop() || 'file'
    }

    const isImage = (fileUrl: string): boolean => {
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
      const ext = fileUrl.substring(fileUrl.lastIndexOf('.')).toLowerCase()
      return imageExtensions.includes(ext)
    }

    const confirmDownload = (url: string, name: string) => {
      fileToDownloadUrl.value = url
      fileToDownloadName.value = name
      showDownloadModal.value = true
    }

    const handleDownloadConfirm = (url: string, name: string) => {
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      showDownloadModal.value = false
      fileToDownloadUrl.value = null
      fileToDownloadName.value = null
    }

    const handleDownloadCancel = () => {
      showDownloadModal.value = false
      fileToDownloadUrl.value = null
      fileToDownloadName.value = null
    }

    // Watch messages and chat change to auto-scroll
    watch(messages, () => nextTick(scrollToBottom), { deep: true })
    watch(
      () => props.chat,
      () => nextTick(scrollToBottom),
    )

    return {
      messages,
      authStore,
      messageArea,
      formatTimestamp,
      chatFullName,
      getFileName,
      isImage,
      confirmDownload,
      showDownloadModal,
      fileToDownloadUrl,
      fileToDownloadName,
      handleDownloadConfirm,
      handleDownloadCancel,
      isTypingInActiveChat, // Expose to template
      activeChatPartnerOnlineStatus, // Expose to template
    }
  },
})
</script>

<style scoped>
.chat-window {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  overflow: hidden;
  min-height: 0;
}

.chat-header {
  padding: 12px 20px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
}

.chat-info {
  display: flex;
  align-items: center;
  gap: 10px; /* Add some gap between name and indicator */
}

.chat-name {
  font-size: 1rem;
  font-weight: 500;
}

.online-indicator-header {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid white; /* Small border for visibility */
}

.online-indicator-header.online {
  background-color: #28a745; /* Green */
}

.online-indicator-header.offline {
  background-color: #6c757d; /* Gray */
}


.typing-indicator {
  display: flex;
  align-items: center;
  height: 10px; /* Adjust height to align with text */
  font-size: 0.9em; /* Make text slightly smaller */
  color: #555; /* Give it a subtle color */
}

.typing-indicator span:first-of-type {
  margin-right: 4px; /* Space between text and dots */
}

.typing-indicator .dot {
  width: 6px;
  height: 6px;
  background-color: #075e54;
  border-radius: 50%;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-indicator .dot:nth-child(2) {
  animation-delay: -0.16s;
}
.typing-indicator .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.message-area {
  flex-grow: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f0f2f5;
}

.message {
  padding: 10px 14px;
  border-radius: 20px;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  color: #fff;
}

.sent {
  background-color: #007bff;
  color: white;
  align-self: flex-end;
}

.received {
  background-color: #fff;
  color: #000;
  align-self: flex-start;
}

.timestamp {
  font-size: 0.7rem;
  margin-top: 4px;
  align-self: flex-end;
}

.file-attachment a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
}

.uploaded-image {
  max-width: 100%;
  max-height: 300px;
  width: auto;
  border-radius: 8px;
  margin-top: 5px;
  cursor: pointer;
  object-fit: contain;
}
</style>
