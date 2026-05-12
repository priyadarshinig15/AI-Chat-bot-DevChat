'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Hash, Plus, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Room } from '@/lib/types/database'

interface ChatSidebarProps {
  rooms: Room[]
  userId: string
}

export function ChatSidebar({ rooms: initialRooms, userId }: ChatSidebarProps) {
  const pathname = usePathname()
  const [rooms, setRooms] = useState(initialRooms)
  const [isOpen, setIsOpen] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [roomDescription, setRoomDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomName.trim()) return

    setLoading(true)
    
    const { data: newRoom, error } = await supabase
      .from('rooms')
      .insert({
        name: roomName.trim(),
        description: roomDescription.trim() || null,
        is_private: isPrivate,
        created_by: userId,
      })
      .select()
      .single()

    if (!error && newRoom) {
      // Auto-join the room
      await supabase
        .from('room_members')
        .insert({
          room_id: newRoom.id,
          user_id: userId,
        })

      setRooms([...rooms, newRoom])
      setRoomName('')
      setRoomDescription('')
      setIsPrivate(false)
      setIsOpen(false)
    }
    
    setLoading(false)
  }

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Plus className="h-4 w-4" />
              New Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create a new room</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Create a space for your team or community to chat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateRoom}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Room name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., general, react-help, code-review"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description (optional)</Label>
                  <Input
                    id="description"
                    placeholder="What is this room about?"
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="private" className="text-foreground text-sm">
                    Make this room private
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !roomName.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? 'Creating...' : 'Create Room'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Rooms
          </p>
          {rooms.map((room) => {
            const isActive = pathname === `/chat/${room.id}`
            return (
              <Link
                key={room.id}
                href={`/chat/${room.id}`}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                {room.is_private ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Hash className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="truncate">{room.name}</span>
              </Link>
            )
          })}
          {rooms.length === 0 && (
            <p className="px-2 py-4 text-sm text-muted-foreground text-center">
              No rooms yet. Create one to get started!
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
