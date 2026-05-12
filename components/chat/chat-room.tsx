'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { MessageList } from './message-list'
import { MessageInput } from './message-input'
import { OnlineUsers } from './online-users'
import { RoomHeader } from './room-header'
import type { Room, Profile, MessageWithProfile, PresenceUser, TypingUser } from '@/lib/types/database'

interface ChatRoomProps {
  room: Room
  user: User
  profile: Profile | null
  initialMessages: MessageWithProfile[]
  initialMembers: Array<{ user_id: string; profiles: Profile | null }>
}

export function ChatRoom({ room, user, profile, initialMessages, initialMembers }: ChatRoomProps) {
  const [messages, setMessages] = useState<MessageWithProfile[]>(initialMessages)
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([])
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Subscribe to real-time messages
  useEffect(() => {
    const channel = supabase
      .channel(`room:${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room.id}`,
        },
        async (payload) => {
          // Fetch the profile for this message
          const { data: msgProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.user_id)
            .single()

          const newMessage: MessageWithProfile = {
            ...payload.new as MessageWithProfile,
            profiles: msgProfile,
          }

          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMessage.id)) {
              return prev
            }
            return [...prev, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id, supabase])

  // Subscribe to presence (online users)
  useEffect(() => {
    const channel = supabase.channel(`presence:${room.id}`)

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users: PresenceUser[] = []
        
        Object.values(state).forEach((presences) => {
          (presences as Array<{ user_id: string; username: string; online_at: string }>).forEach((presence) => {
            if (!users.some(u => u.id === presence.user_id)) {
              users.push({
                id: presence.user_id,
                username: presence.username,
                online_at: presence.online_at,
              })
            }
          })
        })
        
        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            username: profile?.username || 'Anonymous',
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id, user.id, profile?.username, supabase])

  // Subscribe to typing indicators
  useEffect(() => {
    const channel = supabase.channel(`typing:${room.id}`)

    channel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          setTypingUsers((prev) => {
            const exists = prev.some(u => u.id === payload.user_id)
            if (!exists) {
              return [...prev, { id: payload.user_id, username: payload.username }]
            }
            return prev
          })

          // Remove typing indicator after 3 seconds
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter(u => u.id !== payload.user_id))
          }, 3000)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id, user.id, supabase])

  const sendTypingIndicator = useCallback(() => {
    const channel = supabase.channel(`typing:${room.id}`)
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        username: profile?.username || 'Anonymous',
      },
    })
  }, [room.id, user.id, profile?.username, supabase])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // Check for @ai command
    const hasAiCommand = content.toLowerCase().includes('@ai')

    // Insert user message
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert({
        room_id: room.id,
        user_id: user.id,
        content: content.trim(),
        is_ai_response: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      return
    }

    // If @ai command, call the AI
    if (hasAiCommand) {
      setIsAiLoading(true)
      
      try {
        // Get recent messages for context
        const recentMessages = messages.slice(-10).map(m => ({
          role: m.is_ai_response ? 'assistant' : 'user',
          content: `${m.profiles?.username || 'Unknown'}: ${m.content}`,
        }))

        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            context: recentMessages,
            roomId: room.id,
          }),
        })

        if (!response.ok) {
          throw new Error('AI request failed')
        }

        // The AI response will be inserted via the API and show up through real-time subscription
      } catch (error) {
        console.error('Error calling AI:', error)
      } finally {
        setIsAiLoading(false)
      }
    }
  }

  const summarizeDiscussion = async () => {
    setIsAiLoading(true)
    
    try {
      const recentMessages = messages.slice(-20).map(m => ({
        role: m.is_ai_response ? 'assistant' : 'user',
        content: `${m.profiles?.username || 'Unknown'}: ${m.content}`,
      }))

      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          roomId: room.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Summarize request failed')
      }
    } catch (error) {
      console.error('Error summarizing:', error)
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <RoomHeader room={room} onSummarize={summarizeDiscussion} isAiLoading={isAiLoading} />
        <MessageList 
          messages={messages} 
          currentUserId={user.id} 
          messagesEndRef={messagesEndRef}
          typingUsers={typingUsers}
        />
        <MessageInput 
          onSend={sendMessage} 
          onTyping={sendTypingIndicator}
          isAiLoading={isAiLoading}
        />
      </div>
      <OnlineUsers users={onlineUsers} currentUserId={user.id} />
    </div>
  )
}
