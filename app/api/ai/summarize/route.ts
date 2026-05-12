import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { createClient } from '@/lib/supabase/server'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { messages, roomId } = await request.json()

    if (!messages || !roomId) {
      return Response.json({ error: 'Messages and roomId are required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Format the conversation for summarization
    const conversationText = messages
      .map((msg: { role: string; content: string }) => msg.content)
      .join('\n')

    // Generate summary
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a helpful AI assistant that summarizes developer chat discussions. 
      
Your task is to provide a concise summary of the conversation that:
1. Highlights the main topics discussed
2. Notes any key decisions or conclusions reached
3. Lists any action items or open questions
4. Keeps the summary brief (3-5 bullet points max)

Format your response using markdown bullet points.`,
      prompt: `Please summarize this developer chat conversation:\n\n${conversationText}`,
      maxOutputTokens: 512,
    })

    // Insert summary as an AI message
    const summaryMessage = `**Discussion Summary**\n\n${text}`
    
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        user_id: null,
        content: summaryMessage,
        is_ai_response: true,
      })

    if (insertError) {
      console.error('Error inserting summary:', insertError)
      return Response.json({ error: 'Failed to save summary' }, { status: 500 })
    }

    return Response.json({ success: true, summary: text })
  } catch (error) {
    console.error('Summarize error:', error)
    return Response.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
