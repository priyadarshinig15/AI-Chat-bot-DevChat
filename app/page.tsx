import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Terminal, MessageSquare, Bot, Users, Zap, Code } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Terminal className="h-6 w-6" />
            <span className="text-xl font-bold font-mono">DevChat</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Sign in
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Bot className="h-4 w-4" />
            AI-Powered Developer Collaboration
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Chat rooms built for{' '}
            <span className="text-primary">developers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Real-time collaborative spaces with an integrated AI assistant. Ask questions, 
            share code, and get instant help with @ai commands.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                <Terminal className="h-5 w-5" />
                Start Chatting
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary gap-2">
                <Code className="h-5 w-5" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Chat</h3>
            <p className="text-muted-foreground">
              Instant messaging with typing indicators, presence detection, and seamless code sharing.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Assistant</h3>
            <p className="text-muted-foreground">
              Use @ai to get instant help with code questions, debugging, and technical discussions.
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Team Rooms</h3>
            <p className="text-muted-foreground">
              Create public or private rooms for your team, project, or community discussions.
            </p>
          </div>
        </div>

        {/* Code preview */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="rounded-lg bg-card border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <span className="ml-2 text-sm text-muted-foreground font-mono">#general</span>
            </div>
            <div className="p-4 space-y-4 font-mono text-sm">
              <div className="flex gap-3">
                <span className="text-primary">@sarah</span>
                <span className="text-foreground">{"Hey, anyone know how to fix this React hook warning?"}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-primary">@mike</span>
                <span className="text-foreground">{"@ai can you explain the useEffect dependency array?"}</span>
              </div>
              <div className="flex gap-3 bg-[color:var(--ai-message)] p-3 rounded-lg">
                <Bot className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-foreground">
                  {"The dependency array in useEffect tells React which values to watch for changes. When any value in the array changes, the effect re-runs..."}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <span>Powered by Groq AI for lightning-fast responses</span>
          </div>
          <div>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join the community
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>Built with Next.js, Supabase, and AI SDK</p>
        </div>
      </footer>
    </div>
  )
}
