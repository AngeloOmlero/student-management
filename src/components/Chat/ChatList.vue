<template>
  <div class="chat-list">
    <!-- Header -->
    <div class="chat-list-header">
      <div class="my-avatar">
        {{ getInitials(authStore.user?.fullName) }}
      </div>
      <h2 class="hide-on-mobile">Chats</h2>
    </div>

    <!-- Chat Users -->
    <div class="chat-items">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="chat-item"
        @click="selectChat(user)"
        :class="{ active: chatStore.activeChat === user.username }"
      >
        <div class="chat-avatar">
          {{ getInitials(user.fullName) }}
        </div>
        <div class="chat-details hide-on-mobile">
          <div
            class="chat-name"
            :class="{ unread: chatStore.latestMessage(user.username)?.read === false }"
          >
            {{ user.fullName }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../stores/chat.store'
import { useAuthStore } from '../../stores/auth.store'
import type { User } from '../../types/auth'

export default defineComponent({
  name: 'ChatList',
  emits: ['chat-selected'],
  setup(props, { emit }) {
    const chatStore = useChatStore()
    const authStore = useAuthStore()
    const { users } = storeToRefs(chatStore)

    // Filter out current logged-in user safely
    const filteredUsers = computed(() => {
      if (!authStore.user) return []
      return users.value.filter((user) => user.username !== authStore.user!.username)
    })

    function selectChat(user: User) {
      emit('chat-selected', user)
      chatStore.setActiveChat(user.username)
    }

    function getInitials(fullName?: string) {
      if (!fullName) return ''
      return fullName
        .split(' ')
        .map((n) => n[0]?.toUpperCase())
        .join('')
    }

    onMounted(() => {
      chatStore.fetchUsers()
    })

    return {
      chatStore,
      authStore,
      filteredUsers,
      selectChat,
      getInitials,
    }
  },
})
</script>

<style scoped>
.chat-list {
  width: 350px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 30px;
}

/* Header */
.chat-list-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  position: relative;
  border-top-left-radius: 10px;
}

.my-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #0056b3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 16px;
  color: white;
  font-size: 0.9em;
}

.chat-items {
  overflow-y: auto;
  flex-grow: 1;
  padding-bottom: 10px;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #e6f0ff;
}

.chat-item.active {
  background-color: #cce0ff;
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  margin-right: 16px;
  font-size: 1em;
}

.chat-details {
  flex-grow: 1;
}

.chat-name {
  font-weight: 300;
  font-size: 1.1em;
  color: #000;
}
.unread {
  font-weight: bold;
  color: #007bff;
}

@media (max-width: 768px) {
  .chat-list {
    width: 180px;
    border-radius: 0;
  }

  .chat-list-header h2 {
    font-size: 1rem;
  }

  .chat-item {
    padding: 10px;
  }

  .chat-avatar {
    width: 40px;
    height: 40px;
    font-size: 0.85em;
    margin-right: 10px;
  }

  .chat-name {
    font-size: 1rem;
    font-weight: 500px;
  }
}
/* Hide full name on small screens */
@media (max-width: 480px) {
  .hide-on-mobile {
    display: none;
  }

  .chat-list {
    width: 80px; /* smaller width to show only avatars */
    border-radius: 0;
  }

  .chat-item {
    justify-content: center; /* center avatar horizontally */
    padding: 8px 0;
  }

  .chat-avatar {
    width: 48px;
    height: 48px;
    margin: 0; /* no margin since avatar is centered */
  }
  .my-avatar {
    width: 38px;
    height: 38px;
    margin: 0; /* no margin since avatar is centered */
  }
}
</style>
