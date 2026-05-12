'use client'

import { RefObject } from 'react'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MessageWithProfile, TypingUser } from '@/lib/types/database'

interface MessageListProps {
  messages: MessageWithProfile[]
  currentUserId: string
  messagesEndRef: RefObject<HTMLDivElement | null>
  typingUsers: TypingUser[]
}

export function MessageList({ messages, currentUserId, messagesEndRef, typingUsers }: MessageListProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  // Group messages by date
  const groupedMessages: { date: string; messages: MessageWithProfile[] }[] = []
  let currentDate = ''

  messages.forEach((message) => {
    const messageDate = new Date(message.created_at).toDateString()
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groupedMessages.push({
        date: message.created_at,
        messages: [message],
      })
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(message)
    }
  })

  // Render code blocks
  const renderContent = (content: string) => {
    // Simple code block detection for ```code```
    const parts = content.split(/(```[\s\S]*?```)/g)
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3)
        const [lang, ...codeLines] = code.split('\n')
        const codeContent = lang.match(/^[a-zA-Z]+$/) ? codeLines.join('\n') : code
        
        return (
          <pre key={index} className="my-2 p-3 rounded-md bg-background/50 border border-border overflow-x-auto">
            <code className="text-sm font-mono text-foreground">{codeContent.trim()}</code>
          </pre>
        )
      }
      
      // Handle inline code with `code`
      const inlineParts = part.split(/(`[^`]+`)/g)
      return inlineParts.map((inlinePart, inlineIndex) => {
        if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
          return (
            <code key={`${index}-${inlineIndex}`} className="px-1.5 py-0.5 rounded bg-muted text-primary font-mono text-sm">
              {inlinePart.slice(1, -1)}
            </code>
          )
        }
        return <span key={`${index}-${inlineIndex}`}>{inlinePart}</span>
      })
    })
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {groupedMessages.map((group, groupIndex) => (
        <div key={groupIndex}>
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">
              {formatDate(group.date)}
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>
          
          {group.messages.map((message, messageIndex) => {
            const isOwn = message.user_id === currentUserId
            const isAi = message.is_ai_response
            const showAvatar = messageIndex === 0 || 
              group.messages[messageIndex - 1].user_id !== message.user_id

            return (
              <div
                key={message.id}
                className={cn(
                  'group flex gap-3 py-1 hover:bg-muted/30 -mx-2 px-2 rounded',
                  isAi && 'bg-[color:var(--ai-message)]'
                )}
              >
                {/* Avatar */}
                <div className="w-8 flex-shrink-0">
                  {showAvatar && (
                    isAi ? (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
                        {message.profiles?.username?.[0]?.toUpperCase() || '?'}
                      </div>
                    )
                  )}
                </div>

                {/* Message content */}
                <div className="flex-1 min-w-0">
                  {showAvatar && (
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className={cn(
                        'font-semibold text-sm',
                        isAi ? 'text-primary' : isOwn ? 'text-primary' : 'text-foreground'
                      )}>
                        {isAi ? 'AI Assistant' : message.profiles?.username || 'Unknown'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-foreground/90 break-words whitespace-pre-wrap">
                    {renderContent(message.content)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>
            {typingUsers.map(u => u.username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
