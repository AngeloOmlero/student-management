<template>
  <div class="chat-page">
    <NavBar />

    <main class="content-container">
      <div class="chat-body">
        <!-- Chat List -->
        <ChatList @chat-selected="handleChatSelected" />

        <!-- Chat Window + Input -->
        <div class="chat-main">
          <ChatWindow v-if="activeChat" :chat="activeChat" />
          <MessageInput v-if="activeChat && authStore.user" />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../stores/chat.store'
import { useAuthStore } from '../stores/auth.store'
import NavBar from '../components/Shared/NavBar.vue'
import ChatList from '../components/Chat/ChatList.vue'
import ChatWindow from '../components/Chat/ChatWindow.vue'
import MessageInput from '../components/Chat/MessageInput.vue'
import type { User } from '../types/auth'

export default defineComponent({
  name: 'PrivateChat',
  components: { NavBar, ChatList, ChatWindow, MessageInput },
  setup() {
    const chatStore = useChatStore()
    const authStore = useAuthStore()
    const { activeChat } = storeToRefs(chatStore)

    onMounted(() => {
      chatStore.fetchUsers()
      authStore.fetchCurrentUser()
    })

    function handleChatSelected(chat: User) {
      chatStore.fetchConversation(chat.username)
      chatStore.setActiveChat(chat.username)
    }

    return { chatStore, authStore, activeChat, handleChatSelected }
  },
})
</script>

<style scoped>
/* Page container */
.content-container {
  padding: 120px 2rem 2rem 2rem; /* space for navbar */
  margin: 0 auto;
  max-width: 1100px;
  display: block;
}

/* Page title */
h1 {
  margin-bottom: 2rem;
  color: #007bff;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

/* Chat layout */
.chat-body {
  display: flex;
  height: 70vh; /* or adjust to your preference */
  overflow: hidden;
  gap: 1rem;
}

/* ChatList */
.chat-body > ChatList {
  flex: 0 0 250px; /* fixed width */
  border-right: 1px solid #ddd;
  border-radius: 8px;
  overflow-y: auto;
  padding: 0.5rem;
  background-color: #f8f9fa;
  animation: fadeIn 0.4s ease forwards;
}

/* Chat main area */
.chat-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  animation: fadeIn 0.4s ease forwards;
}

/* Fade-in animation */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
