import { generateText } from 'ai'
import { createGroq } from '@ai-sdk/groq'
import { createClient } from '@/lib/supabase/server'

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { message, context, roomId } = await request.json()

    if (!message || !roomId) {
      return Response.json({ error: 'Message and roomId are required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Verify user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Build the conversation history for context
    const conversationHistory = context?.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })) || []

    // Extract the actual question from the @ai command
    const aiQuery = message.replace(/@ai\s*/gi, '').trim()

    // Generate AI response
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a helpful AI assistant in a developer chat room called DevChat. You help developers with coding questions, debugging, code reviews, and technical discussions.

Key guidelines:
- Be concise but thorough in your explanations
- When showing code, use markdown code blocks with language specification
- If asked about a conversation, refer to the context provided
- Be friendly and professional
- Focus on practical, actionable advice
- If you're unsure about something, say so rather than guessing

The conversation context shows recent messages in the chat room. Each message is prefixed with the username.`,
      messages: [
        ...conversationHistory,
        { role: 'user', content: aiQuery || message },
      ],
      maxOutputTokens: 1024,
    })

    // Insert AI response into the database
    const { error: insertError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        user_id: null, // AI messages don't have a user_id
        content: text,
        is_ai_response: true,
      })

    if (insertError) {
      console.error('Error inserting AI message:', insertError)
      return Response.json({ error: 'Failed to save AI response' }, { status: 500 })
    }

    return Response.json({ success: true, message: text })
  } catch (error) {
    console.error('AI chat error:', error)
    return Response.json({ error: 'Failed to generate AI response' }, { status: 500 })
  }
}
