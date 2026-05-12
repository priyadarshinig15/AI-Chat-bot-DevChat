import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatSidebar } from '@/components/chat/chat-sidebar'
import { ChatHeader } from '@/components/chat/chat-header'

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get all rooms
  const { data: rooms } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: true })

  return (
    <div className="h-screen flex flex-col bg-background">
      <ChatHeader user={user} profile={profile} />
      <div className="flex-1 flex overflow-hidden">
        <ChatSidebar rooms={rooms || []} userId={user.id} />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
