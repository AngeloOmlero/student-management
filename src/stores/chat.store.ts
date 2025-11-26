import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getConversation } from '../services/chat.service'
import { getAllUsers } from '../services/user.service'
import type { PrivateMessage } from '../types/chat'
import type { User } from '../types/auth'
import { useAuthStore } from './auth.store'

export const useChatStore = defineStore('chat', () => {
  const users = ref<User[]>([])
  const conversations = reactive<Record<string, PrivateMessage[]>>({})
  const activeChat = ref<string | null>(localStorage.getItem('activeChat') || null)
  const unreadMessages = reactive<Record<string, number>>({})

  const fetchUsers = async () => {
    const authStore = useAuthStore()
    if (!authStore.token) return
    users.value = await getAllUsers(authStore.token)
  }

  const fetchConversation = async (otherUsername: string, page = 0, size = 20) => {
    const authStore = useAuthStore()
    if (!authStore.token) return

    const response = await getConversation(authStore.token, otherUsername, page, size)
    conversations[otherUsername] = response.content
    unreadMessages[otherUsername] = 0
  }

  const setActiveChat = (username: string | null) => {
    activeChat.value = username
    if (username) unreadMessages[username] = 0
  }

  const addMessage = (message: PrivateMessage) => {
    const authStore = useAuthStore()
    const chatKey = message.sender === authStore.user?.username ? message.receiver : message.sender

    if (!conversations[chatKey]) conversations[chatKey] = []
    conversations[chatKey].push(message)

    if (message.sender !== authStore.user?.username && activeChat.value !== chatKey) {
      unreadMessages[chatKey] = (unreadMessages[chatKey] || 0) + 1
    }
  }

  const markAsRead = (username: string) => {
    unreadMessages[username] = 0
  }

  const latestMessage = (username: string) => {
    const msgs = conversations[username] || []
    if (!msgs.length) return { content: '', read: true } // default if no messages
    return msgs[msgs.length - 1]
  }

  return {
    users,
    conversations,
    activeChat,
    unreadMessages,
    fetchUsers,
    fetchConversation,
    setActiveChat,
    addMessage,
    markAsRead,
    latestMessage,
  }
})
