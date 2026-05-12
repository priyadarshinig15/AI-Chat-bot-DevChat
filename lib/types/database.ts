export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export interface Room {
  id: string
  name: string
  description: string | null
  created_by: string | null
  is_private: boolean
  created_at: string
}

export interface RoomMember {
  id: string
  room_id: string
  user_id: string
  joined_at: string
}

export interface Message {
  id: string
  room_id: string
  user_id: string | null
  content: string
  is_ai_response: boolean
  created_at: string
}

export interface MessageWithProfile extends Message {
  profiles: Profile | null
}

export interface RoomWithMemberCount extends Room {
  member_count: number
}

export interface PresenceUser {
  id: string
  username: string
  online_at: string
}

export interface TypingUser {
  id: string
  username: string
}
