'use client'

import { Button } from '@/components/ui/button'
import { Hash, Lock, Sparkles, Loader2 } from 'lucide-react'
import type { Room } from '@/lib/types/database'

interface RoomHeaderProps {
  room: Room
  onSummarize: () => void
  isAiLoading: boolean
}

export function RoomHeader({ room, onSummarize, isAiLoading }: RoomHeaderProps) {
  return (
    <div className="h-12 border-b border-border bg-card/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        {room.is_private ? (
          <Lock className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Hash className="h-4 w-4 text-muted-foreground" />
        )}
        <h2 className="font-semibold text-foreground">{room.name}</h2>
        {room.description && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {room.description}
            </span>
          </>
        )}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onSummarize}
        disabled={isAiLoading}
        className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
      >
        {isAiLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Summarize</span>
      </Button>
    </div>
  )
}
