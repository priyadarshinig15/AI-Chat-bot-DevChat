import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChatRoom } from '@/components/chat/chat-room'

interface Props {
  params: Promise<{ roomId: string }>
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get room details
  const { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (error || !room) {
    notFound()
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get initial messages with profiles
  const { data: messages } = await supabase
    .from('messages')
    .select(`
      *,
      profiles (
        id,
        username,
        avatar_url
      )
    `)
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(50)

  // Ensure user is a member of the room (auto-join public rooms)
  if (!room.is_private) {
    await supabase
      .from('room_members')
      .upsert({
        room_id: roomId,
        user_id: user.id,
      }, {
        onConflict: 'room_id,user_id'
      })
  }

  // Get room members for presence
  const { data: members } = await supabase
    .from('room_members')
    .select(`
      user_id,
      profiles (
        id,
        username,
        avatar_url
      )
    `)
    .eq('room_id', roomId)

  return (
    <ChatRoom
      room={room}
      user={user}
      profile={profile}
      initialMessages={messages || []}
      initialMembers={members || []}
    />
  )
}
