export enum MessageType {
  CHAT = 'CHAT',
  TYPING = 'TYPING',
  STOP_TYPING = 'STOP_TYPING',
}

export enum PresenceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export interface PrivateMessage {
  id: number
  sender: string
  receiver: string
  content: string
  timestamp: number
  delivered: boolean
  read: boolean
  fileUrl?: string
  type?: MessageType // Make type optional, default to CHAT if not provided
}
