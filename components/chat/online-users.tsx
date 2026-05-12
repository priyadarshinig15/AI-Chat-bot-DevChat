'use client'

import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PresenceUser } from '@/lib/types/database'

interface OnlineUsersProps {
  users: PresenceUser[]
  currentUserId: string
}

export function OnlineUsers({ users, currentUserId }: OnlineUsersProps) {
  return (
    <aside className="w-60 border-l border-border bg-card/30 hidden lg:block">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Online — {users.length}</span>
        </div>
      </div>
      
      <div className="p-2 overflow-y-auto">
        {users.map((user) => {
          const isCurrentUser = user.id === currentUserId
          
          return (
            <div
              key={user.id}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-md',
                isCurrentUser && 'bg-muted/30'
              )}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground">
                  {user.username?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[color:var(--online)] border-2 border-card" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm truncate',
                  isCurrentUser ? 'text-primary font-medium' : 'text-foreground'
                )}>
                  {user.username}
                  {isCurrentUser && ' (you)'}
                </p>
              </div>
            </div>
          )
        })}
        
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No one else is online
          </p>
        )}
      </div>
    </aside>
  )
}
