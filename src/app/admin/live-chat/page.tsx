'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Headphones, Clock, X, Send, User, Bot, ChevronRight, RefreshCw } from 'lucide-react'

interface ChatSession {
  id: string
  visitorName: string
  visitorEmail: string | null
  status: string
  createdAt: string
  updatedAt: string
  _count?: { messages: number }
  messages?: ChatMessage[]
}

interface ChatMessage {
  id: string
  sessionId: string
  sender: string
  content: string
  read: boolean
  createdAt: string
}

export default function AdminLiveChat() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agentMessage, setAgentMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/chat/sessions')
      const data = await res.json()
      setSessions(data)
    } catch (err) {
      console.error('Fetch sessions error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status !== 'authenticated') return
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000)
    return () => clearInterval(interval)
  }, [status])

  const fetchMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}/messages`)
      const data = await res.json()
      setMessages(data)
      setSelectedSession(sessionId)
    } catch (err) {
      console.error('Fetch messages error:', err)
    }
  }

  useEffect(() => {
    if (selectedSession) {
      fetchMessages(selectedSession)
      const interval = setInterval(() => fetchMessages(selectedSession), 3000)
      return () => clearInterval(interval)
    }
  }, [selectedSession])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleConnectAgent = async (sessionId: string) => {
    try {
      await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'connected' }),
      })
      fetchSessions()
      fetchMessages(sessionId)
    } catch (err) {
      console.error('Connect agent error:', err)
    }
  }

  const handleCloseSession = async (sessionId: string) => {
    try {
      await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' }),
      })
      setSelectedSession(null)
      setMessages([])
      fetchSessions()
    } catch (err) {
      console.error('Close session error:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentMessage.trim() || !selectedSession) return

    try {
      await fetch(`/api/chat/sessions/${selectedSession}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: agentMessage, sender: 'agent' }),
      })
      setAgentMessage('')
      fetchMessages(selectedSession)
    } catch (err) {
      console.error('Send message error:', err)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">Active</span>
      case 'waiting':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 animate-pulse">Waiting</span>
      case 'connected':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">Connected</span>
      case 'closed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">Closed</span>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="w-4 h-4 text-amber-500" />
      case 'connected':
        return <Headphones className="w-4 h-4 text-green-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-blue-500" />
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-8 h-8 text-vogue animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const activeSessions = sessions.filter((s) => s.status !== 'closed')
  const closedSessions = sessions.filter((s) => s.status === 'closed')
  const waitingSessions = sessions.filter((s) => s.status === 'waiting')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Headphones className="w-6 h-6 text-vogue" />
            <div>
              <h1 className="text-xl font-bold text-charcoal">Live Chat Dashboard</h1>
              <p className="text-xs text-charcoal/60">
                {waitingSessions.length > 0
                  ? `${waitingSessions.length} visitor(s) waiting for an agent`
                  : 'No visitors waiting'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {waitingSessions.length > 0 && (
              <div className="bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                {waitingSessions.length} waiting
              </div>
            )}
            <button
              onClick={fetchSessions}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-charcoal/60" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">
          {/* Sessions List */}
          <div className="bg-white rounded-xl border overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h2 className="text-sm font-semibold text-charcoal">
                Conversations ({activeSessions.length} active)
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeSessions.length === 0 && closedSessions.length === 0 && (
                <div className="p-8 text-center text-charcoal/40 text-sm">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No conversations yet
                </div>
              )}

              {activeSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => fetchMessages(s.id)}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b text-left ${
                    selectedSession === s.id ? 'bg-vogue/5 border-l-4 border-l-vogue' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-vogue/10 flex items-center justify-center shrink-0 mt-0.5">
                    {getStatusIcon(s.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal truncate">{s.visitorName}</span>
                      {getStatusBadge(s.status)}
                    </div>
                    <p className="text-xs text-charcoal/50 mt-0.5">
                      {formatDate(s.createdAt)} at {formatTime(s.createdAt)}
                    </p>
                    {s._count && s._count.messages > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {s._count.messages > 0 && (
                          <span className="bg-cornell text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {s._count.messages}
                          </span>
                        )}
                        <span className="text-[10px] text-charcoal/40">unread</span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-charcoal/30 shrink-0 mt-2" />
                </button>
              ))}

              {closedSessions.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <h3 className="text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Closed ({closedSessions.length})</h3>
                  </div>
                  {closedSessions.slice(0, 10).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => fetchMessages(s.id)}
                      className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b text-left opacity-60 ${
                        selectedSession === s.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-charcoal truncate">{s.visitorName}</span>
                          {getStatusBadge(s.status)}
                        </div>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          {formatDate(s.createdAt)} at {formatTime(s.createdAt)}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl border overflow-hidden flex flex-col">
            {selectedSession ? (
              <>
                {/* Chat Header */}
                {(() => {
                  const currentSession = sessions.find((s) => s.id === selectedSession)
                  if (!currentSession) return null
                  return (
                    <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-vogue/10 flex items-center justify-center">
                          {getStatusIcon(currentSession.status)}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-charcoal">{currentSession.visitorName}</h3>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(currentSession.status)}
                            <span className="text-[10px] text-charcoal/40">
                              Started {formatTime(currentSession.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentSession.status === 'active' && (
                          <button
                            onClick={() => handleConnectAgent(selectedSession)}
                            className="px-3 py-1.5 bg-vogue text-white text-xs font-medium rounded-lg hover:bg-vogue-light transition-colors flex items-center gap-1"
                          >
                            <Headphones className="w-3.5 h-3.5" />
                            Join Chat
                          </button>
                        )}
                        {currentSession.status === 'waiting' && (
                          <button
                            onClick={() => handleConnectAgent(selectedSession)}
                            className="px-3 py-1.5 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-1 animate-pulse"
                          >
                            <Headphones className="w-3.5 h-3.5" />
                            Accept Chat
                          </button>
                        )}
                        {currentSession.status !== 'closed' && (
                          <button
                            onClick={() => handleCloseSession(selectedSession)}
                            className="px-3 py-1.5 bg-gray-200 text-charcoal text-xs font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            End Chat
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                      {msg.sender !== 'visitor' && (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          msg.sender === 'agent' ? 'bg-cornell/10' : 'bg-vogue/10'
                        }`}>
                          {msg.sender === 'agent' ? (
                            <Headphones className="w-3.5 h-3.5 text-cornell" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 text-vogue" />
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.sender === 'visitor'
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : msg.sender === 'agent'
                            ? 'bg-cornell/10 text-charcoal rounded-bl-md border border-cornell/20'
                            : 'bg-gray-100 text-charcoal rounded-bl-md'
                        }`}
                      >
                        {msg.sender === 'agent' && (
                          <p className="text-[10px] font-semibold text-cornell mb-0.5">AGENT</p>
                        )}
                        {msg.sender === 'bot' && (
                          <p className="text-[10px] font-semibold text-vogue mb-0.5">BOT</p>
                        )}
                        {msg.content}
                        <p className="text-[10px] mt-1 opacity-50">{formatTime(msg.createdAt)}</p>
                      </div>
                      {msg.sender === 'visitor' && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Agent Input */}
                {(() => {
                  const currentSession = sessions.find((s) => s.id === selectedSession)
                  if (!currentSession || currentSession.status === 'closed') return null
                  return (
                    <form onSubmit={handleSendMessage} className="px-5 py-3 border-t bg-gray-50 flex items-center gap-2">
                      <input
                        type="text"
                        value={agentMessage}
                        onChange={(e) => setAgentMessage(e.target.value)}
                        placeholder={
                          currentSession.status === 'connected'
                            ? 'Type your reply as agent...'
                            : 'Join the chat to reply...'
                        }
                        className="flex-1 bg-white rounded-full px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-vogue/30 border"
                        disabled={currentSession.status !== 'connected'}
                      />
                      <button
                        type="submit"
                        disabled={!agentMessage.trim() || currentSession.status !== 'connected'}
                        className="w-10 h-10 rounded-full bg-vogue text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-vogue-light"
                        aria-label="Send"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )
                })()}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-charcoal/30">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Select a conversation</p>
                  <p className="text-xs mt-1">Choose a chat from the left to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
