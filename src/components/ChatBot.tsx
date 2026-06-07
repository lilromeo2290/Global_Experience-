'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Loader2, Headphones } from 'lucide-react'
import { getVisitorProfile, detectInterestsFromText, setVisitorName, incrementChatHistory, addInterest } from '@/lib/personalization'

interface Message {
  id?: string
  role: 'user' | 'assistant' | 'agent'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'What programs do you offer?',
  'How can I volunteer in Ghana?',
  'What destinations are available?',
  'How do I apply for a placement?',
  'How can I donate?',
]

// Personalized suggested questions based on visitor interests
function getPersonalizedQuestions(): string[] {
  if (typeof window === 'undefined') return SUGGESTED_QUESTIONS
  try {
    const stored = localStorage.getItem('ge_visitor_profile')
    if (!stored) return SUGGESTED_QUESTIONS
    const profile = JSON.parse(stored)

    const personalized: string[] = []

    if (profile.interests?.includes('medical')) {
      personalized.push('Tell me about medical placements')
    }
    if (profile.interests?.includes('teaching')) {
      personalized.push('What teaching programs are available?')
    }
    if (profile.interests?.includes('volunteer') && !profile.hasApplied) {
      personalized.push('How do I apply for a placement?')
    }
    if (profile.interests?.includes('donate') && !profile.hasDonated) {
      personalized.push('How can I donate?')
    }
    if (profile.interests?.includes('adventure')) {
      personalized.push('Tell me about paragliding in Ghana')
    }
    if (profile.interests?.includes('internship')) {
      personalized.push('What internship opportunities do you have?')
    }
    if (profile.viewedDestinations?.length > 0) {
      personalized.push('Tell me more about the destinations')
    }

    // Fill remaining slots with default questions
    const remaining = SUGGESTED_QUESTIONS.filter((q) => !personalized.includes(q))
    return [...personalized.slice(0, 3), ...remaining].slice(0, 5)
  } catch {
    return SUGGESTED_QUESTIONS
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [initialized, setInitialized] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [liveAgent, setLiveAgent] = useState(false)
  const [requestingAgent, setRequestingAgent] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  // Create a chat session when the chat is opened for the first time
  useEffect(() => {
    if (open && !sessionId) {
      const profile = getVisitorProfile()
      const visitorName = profile.name || 'Visitor'

      // Personalized welcome message
      let welcomeMsg = 'Hello! Welcome to Global Experience Placements. I\'m your virtual assistant. How can I help you today?'
      if (profile.name) {
        welcomeMsg = `Hello, ${profile.name}! Welcome back to Global Experience Placements. ${
          profile.interests.length > 0
            ? `I see you're interested in ${profile.interests.slice(0, 2).join(' and ')}. `
            : ''
        }How can I help you today?`
      } else if (profile.visitCount > 1) {
        welcomeMsg = 'Welcome back to Global Experience Placements! How can I assist you today?'
      }

      if (!initialized) {
        setMessages([{ role: 'assistant', content: welcomeMsg }])
        setInitialized(true)
      }

      fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorName }),
      })
        .then((res) => res.json())
        .then((data) => {
          setSessionId(data.id)
        })
        .catch(console.error)
    }
  }, [open, sessionId, initialized])

  // Poll for new messages when live agent is connected
  useEffect(() => {
    if (!sessionId || !liveAgent || !open) return

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/sessions/${sessionId}`)
        const session = await res.json()

        if (session.status === 'closed') {
          setLiveAgent(false)
          setMessages((prev) => [
            ...prev,
            { role: 'agent', content: 'The agent has ended this chat session. Thank you for reaching out!' },
          ])
          setSessionId(null)
          return
        }

        // Fetch all messages and sync
        const msgRes = await fetch(`/api/chat/sessions/${sessionId}/messages`)
        const dbMessages = await msgRes.json()

        // Find agent messages we don't have yet
        const currentContent = new Set(messages.map((m) => m.content))
        const newAgentMessages = dbMessages
          .filter((m: any) => m.sender === 'agent' && !currentContent.has(m.content))
          .map((m: any) => ({
            role: 'agent' as const,
            content: m.content,
          }))

        if (newAgentMessages.length > 0) {
          setMessages((prev) => [...prev, ...newAgentMessages])
        }
      } catch (err) {
        console.error('Polling error:', err)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [sessionId, liveAgent, open, messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Detect interests from the user's message
    const detectedInterests = detectInterestsFromText(text)
    detectedInterests.forEach((interest) => {
      const profile = getVisitorProfile()
      if (!profile.interests.includes(interest)) {
        addInterest(interest)
      }
    })

    // Track chat interaction
    incrementChatHistory()

    // Check if user mentions their name (e.g., "My name is John" or "I'm Sarah")
    const nameMatch = text.match(/(?:my name is|i'm|i am|call me|name's)\s+([A-Z][a-z]+)/i)
    if (nameMatch) {
      setVisitorName(nameMatch[1])
    }

    try {
      const chatMessages = [...messages, userMessage].map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages, sessionId }),
      })

      const data = await res.json()

      if (data.liveAgent) {
        // Message saved to DB but no AI response (agent will respond)
        setLoading(false)
        return
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again or contact us at info@globalexperiencegh.org.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleRequestLiveAgent = async () => {
    if (!sessionId) return
    setRequestingAgent(true)

    try {
      // Update session status to waiting
      await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'waiting' }),
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'You\'ve requested to chat with a live agent. Please wait while we connect you... A team member will be with you shortly.',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error requesting a live agent. Please try again or email us at info@globalexperiencegh.org.',
        },
      ])
    } finally {
      setRequestingAgent(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  // Check for live agent status periodically
  useEffect(() => {
    if (!sessionId || !open) return

    const checkStatus = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/sessions/${sessionId}`)
        const session = await res.json()

        if (session.status === 'connected' && !liveAgent) {
          setLiveAgent(true)
          setMessages((prev) => [
            ...prev,
            {
              role: 'agent',
              content: 'A live agent has joined the chat. You are now speaking with a team member from Global Experience Placements.',
            },
          ])
        }

        if (session.status === 'closed' && liveAgent) {
          setLiveAgent(false)
          setMessages((prev) => [
            ...prev,
            {
              role: 'agent',
              content: 'The agent has ended this chat session. Thank you for reaching out!',
            },
          ])
          setSessionId(null)
        }
      } catch (err) {
        console.error('Status check error:', err)
      }
    }, 5000)

    return () => clearInterval(checkStatus)
  }, [sessionId, open, liveAgent])

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#122A1B] rounded-full px-4 py-2 shadow-lg border border-border flex items-center gap-2 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-charcoal dark:text-white/90 whitespace-nowrap">Live Chat</span>
          </motion.div>
        )}
        <motion.button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-vogue hover:bg-vogue-light text-white shadow-lg shadow-vogue/30 flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Unread indicator dot */}
      {!open && (
        <div className="fixed bottom-[4.5rem] right-6 z-50 w-3 h-3 bg-cornell rounded-full animate-pulse" />
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] bg-white dark:bg-[#0A1F12] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-vogue text-white px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {liveAgent ? <Headphones className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {liveAgent ? 'Live Agent' : 'Global Experience Assistant'}
                </h3>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${liveAgent ? 'bg-green-400' : 'bg-white/50'}`} />
                  <p className="text-white/70 text-xs">
                    {liveAgent ? 'Agent connected' : 'AI Assistant'}
                  </p>
                </div>
              </div>
              {!liveAgent && (
                <button
                  onClick={handleRequestLiveAgent}
                  disabled={requestingAgent}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Headphones className="w-3 h-3" />
                  {requestingAgent ? 'Connecting...' : 'Live Agent'}
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {(msg.role === 'assistant' || msg.role === 'agent') && (
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                      msg.role === 'agent' ? 'bg-cornell/10' : 'bg-vogue/10'
                    }`}>
                      {msg.role === 'agent' ? (
                        <Headphones className="w-3.5 h-3.5 text-cornell" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-vogue" />
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cornell text-white rounded-br-md'
                        : msg.role === 'agent'
                        ? 'bg-cornell/10 text-charcoal dark:text-white/90 rounded-bl-md border border-cornell/20'
                        : 'bg-gray-100 dark:bg-[#122A1B] text-charcoal dark:text-white/90 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'agent' && (
                      <p className="text-[10px] font-semibold text-cornell mb-0.5 uppercase tracking-wider">Live Agent</p>
                    )}
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-cornell/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-cornell" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-vogue/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-vogue" />
                  </div>
                  <div className="bg-gray-100 dark:bg-[#122A1B] rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="w-4 h-4 text-vogue animate-spin" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 1 && !liveAgent && (
              <div className="px-4 pb-2 shrink-0">
                <p className="text-xs text-charcoal/60 dark:text-white/40 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {getPersonalizedQuestions().map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="text-xs px-3 py-1.5 rounded-full border border-vogue/20 text-vogue hover:bg-vogue/5 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={liveAgent ? 'Type a message to the agent...' : 'Type your message...'}
                  className="flex-1 bg-gray-100 dark:bg-[#122A1B] rounded-full px-4 py-2.5 text-sm text-charcoal dark:text-white/90 placeholder:text-charcoal/40 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-vogue/30"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-full bg-vogue hover:bg-vogue-light text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
