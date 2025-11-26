export interface PrivateMessage {
  id: number
  sender: string
  receiver: string
  content: string
  timestamp: number
  delivered: boolean
  read: boolean
}
