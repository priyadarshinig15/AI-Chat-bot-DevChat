import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
  const supabase = await createClient()
  
  // Get all rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: true })

  // If there are rooms, redirect to the first one
  if (rooms && rooms.length > 0) {
    redirect(`/chat/${rooms[0].id}`)
  }

  // Otherwise show welcome message
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to DevChat</h2>
        <p className="text-muted-foreground mb-4">
          Create or join a room to start chatting with other developers.
        </p>
        <p className="text-sm text-muted-foreground">
          Use the sidebar to create a new room or join an existing one.
        </p>
      </div>
    </div>
  )
}
