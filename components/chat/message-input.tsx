'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Bot, Loader2 } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => void
  onTyping: () => void
  isAiLoading: boolean
}

export function MessageInput({ onSend, onTyping, isAiLoading }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isAiLoading) {
      onSend(message)
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    
    // Send typing indicator (debounced)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      onTyping()
    }, 500)
  }

  const insertAtCommand = () => {
    const newMessage = message + '@ai '
    setMessage(newMessage)
    textareaRef.current?.focus()
  }

  return (
    <div className="border-t border-border bg-card/50 p-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={insertAtCommand}
          className="flex-shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
          title="Ask AI"
        >
          <Bot className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (use @ai to ask the AI assistant)"
            className="w-full resize-none rounded-md bg-input border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[40px] max-h-[200px]"
            rows={1}
            disabled={isAiLoading}
          />
        </div>

        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isAiLoading}
          className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isAiLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-2">
        Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Enter</kbd> to send, 
        <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs ml-1">Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
