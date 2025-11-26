<template>
  <div class="chat-window">
    <div class="chat-header">
      <div class="chat-info">
        <div class="chat-name">{{ chatFullName }}</div>
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
        <p>{{ message.content }}</p>
        <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../stores/chat.store'
import { useAuthStore } from '../../stores/auth.store'
import type { PrivateMessage } from '../../types/chat'

export default defineComponent({
  name: 'ChatWindow',
  props: { chat: { type: String, required: true } },
  setup(props) {
    const chatStore = useChatStore()
    const authStore = useAuthStore()
    const { conversations, users } = storeToRefs(chatStore)
    const messageArea = ref<HTMLElement | null>(null)

    // Messages for the current chat
    const messages = computed<PrivateMessage[]>(() => conversations.value[props.chat] || [])

    // Full name of the chat user
    const chatFullName = computed(() => {
      const user = users.value.find((u) => u.username === props.chat)
      return user?.fullName || props.chat || 'Unknown'
    })

    const scrollToBottom = () => {
      if (messageArea.value) messageArea.value.scrollTop = messageArea.value.scrollHeight
    }

    const formatTimestamp = (ts: string | number | Date) => {
      const date = new Date(ts)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Watch messages and chat change to auto-scroll
    watch(messages, () => nextTick(scrollToBottom), { deep: true })
    watch(
      () => props.chat,
      () => nextTick(scrollToBottom),
    )

    return { messages, authStore, messageArea, formatTimestamp, chatFullName }
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
}

.chat-name {
  font-size: 1rem;
  font-weight: 500;
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
</style>
