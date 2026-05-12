# DevSync - AI-Powered Developer Chat Rooms

A real-time collaborative chat platform built for developers, featuring an integrated AI assistant powered by Groq. Think Discord meets ChatGPT, designed specifically for developer teams.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase)
![Groq](https://img.shields.io/badge/Groq-AI%20Assistant-F55036?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)

## Features

### Real-Time Messaging
- **Instant message delivery** using Supabase Realtime Postgres Changes
- **Typing indicators** via Supabase Broadcast channels
- **Online presence tracking** showing who's currently active in each room
- **Auto-scrolling** message list with smooth animations

### AI Assistant Integration
- **`@ai` command** - Type `@ai` followed by your question to get instant AI-powered responses
- **Context-aware responses** - AI considers the last 10 messages for relevant answers
- **Summarize Discussion** - One-click button to generate a summary of the conversation
- **Streaming responses** - Watch AI responses appear in real-time
- **Code-aware** - Optimized for developer questions about code, debugging, and best practices

### Authentication & User Management
- **Email/password authentication** with Supabase Auth
- **Username support** - Choose your display name during signup
- **Auto-generated avatars** with initials
- **Protected routes** - Chat rooms require authentication
- **Session persistence** - Stay logged in across browser sessions

### Chat Room Management
- **Create rooms** - Public or private chat rooms
- **Room descriptions** - Add context to what each room is for
- **Member management** - See who's in each room
- **Default "general" room** - Pre-created for all users

### Developer-Focused Design
- **Dark theme** - Easy on the eyes during long coding sessions
- **Cyan accent colors** - Modern, tech-forward aesthetic
- **Code block support** - Share code snippets with proper formatting
- **Discord-inspired layout** - Familiar UX for developers

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Real-time** | Supabase Realtime (Postgres Changes, Broadcast, Presence) |
| **AI** | Groq (via Vercel AI SDK 6) |
| **Styling** | Tailwind CSS 4 |
| **UI Components** | shadcn/ui |
| **Language** | TypeScript |

## Database Schema

```
profiles
├── id (UUID, PK, references auth.users)
├── username (TEXT, UNIQUE)
├── avatar_url (TEXT, nullable)
└── created_at (TIMESTAMPTZ)

rooms
├── id (UUID, PK)
├── name (TEXT)
├── description (TEXT, nullable)
├── created_by (UUID, references profiles)
├── is_private (BOOLEAN)
└── created_at (TIMESTAMPTZ)

messages
├── id (UUID, PK)
├── room_id (UUID, references rooms)
├── user_id (UUID, references profiles, nullable for AI)
├── content (TEXT)
├── is_ai_response (BOOLEAN)
└── created_at (TIMESTAMPTZ)

room_members
├── id (UUID, PK)
├── room_id (UUID, references rooms)
├── user_id (UUID, references profiles)
└── joined_at (TIMESTAMPTZ)
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account
- Groq API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/priyadarshinig15/AI-Chat-bot-DevChat.git
   cd AI-Chat-bot-DevChat
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   
   Run the following SQL in your Supabase SQL Editor to create the required tables, RLS policies, and triggers. The migrations are already applied if you're using the connected Supabase project.

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating an Account
1. Click "Get Started" on the landing page
2. Fill in your email, username, and password
3. Check your email for verification (if enabled)
4. Log in to access the chat rooms

### Sending Messages
- Type your message in the input field and press Enter or click Send
- Messages appear instantly for all users in the room

### Using the AI Assistant
- **Ask a question**: Type `@ai What is the best way to handle state in React?`
- **Get code help**: Type `@ai How do I fix this TypeScript error: [paste error]`
- **Summarize chat**: Click the "Summarize" button in the room header

### Creating Rooms
1. Click the "+" button in the sidebar
2. Enter a room name and optional description
3. Choose public or private visibility
4. Click "Create Room"

## Project Structure

```
├── app/
│   ├── api/
│   │   └── ai/
│   │       ├── chat/route.ts      # AI chat endpoint
│   │       └── summarize/route.ts # Summarization endpoint
│   ├── auth/
│   │   ├── callback/route.ts      # Auth callback handler
│   │   ├── login/page.tsx         # Login page
│   │   └── sign-up/page.tsx       # Sign up page
│   ├── chat/
│   │   ├── [roomId]/page.tsx      # Individual room page
│   │   ├── layout.tsx             # Chat layout with sidebar
│   │   └── page.tsx               # Chat home (redirect)
│   ├── globals.css                # Global styles & theme
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   └── chat/
│       ├── chat-header.tsx        # Main header with user menu
│       ├── chat-room.tsx          # Room container component
│       ├── chat-sidebar.tsx       # Room list sidebar
│       ├── message-input.tsx      # Message composer
│       ├── message-list.tsx       # Message display
│       ├── online-users.tsx       # Presence sidebar
│       └── room-header.tsx        # Room title & actions
├── lib/
│   ├── supabase/
│   │   ��── client.ts              # Browser Supabase client
│   │   ├── proxy.ts               # Middleware Supabase client
│   │   └── server.ts              # Server Supabase client
│   └── types/
│       └── database.ts            # TypeScript types
└── middleware.ts                  # Auth middleware
```

## Security

- **Row Level Security (RLS)** enabled on all tables
- **Protected API routes** require authentication
- **Secure session management** via HTTP-only cookies
- **Input validation** on all user inputs

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables
4. Deploy

## Built with v0

This project was built using [v0](https://v0.app) by Vercel. You can continue developing by visiting:

[Continue working on v0](https://v0.app/chat/projects/prj_TA8e4TZ3cDZKkXPimsLJLh0XrAYG)

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with Next.js, Supabase, and Groq AI# ai-dev-chat-rooms-devsync-

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_TA8e4TZ3cDZKkXPimsLJLh0XrAYG)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/priyadarshinig15/ai-dev-chat-rooms-devsync-" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
