// src/services/chat.service.ts
import api from '@/services/api'
import type { PrivateMessage } from '../types/chat'

export const getConversation = async (
  token: string,
  otherUsername: string,
  page: number,
  size: number,
): Promise<{ content: PrivateMessage[] }> => {
  const { data } = await api.get(`/chat/messages/${otherUsername}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { page, size },
  })
  return data
}
