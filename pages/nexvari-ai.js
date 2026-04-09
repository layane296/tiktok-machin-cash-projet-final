// pages/nexvari-ai.js
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

// ─── Icônes ───────────────────────────────────────────────────────
const IconSend = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>)
const IconFile = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>)
const IconCopy = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>)
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>)
const IconMenu = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>)
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>)
const IconSparkle = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/></svg>)
const IconEdit = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>)

const SUGGESTIONS = [
  { emoji: '⚡', text: 'Crée une API REST en Node.js avec Express et MongoDB' },
  { emoji: '🐍', text: 'Écris un script Python pour scraper un site web' },
  { emoji: '⚛️', text: 'Crée un composant React avec hook useState et useEffect' },
  { emoji: '🎬', text: 'Écris-moi un script TikTok viral sur le dropshipping' },
  { emoji: '🗄️', text: 'Crée une base de données SQL avec tables et relations' },
  { emoji: '🤖', text: 'Automatise l\'envoi d\'emails avec Python et SMTP' },
]

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="rounded-xl overflow-hidden my-2" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <span className="text-xs font-mono text-white/50">{language || 'code'}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors">
          {copied ? '✅ Copié !' : '📋 Copier'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed"
           style={{ background: 'rgba(0,0,0,0.4)', color: '#e2e8f0', fontFamily: 'monospace' }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function renderMessage(content) {
  const parts = []
  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
  let lastIndex = 0
  let match
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={lastIndex} className="whitespace-pre-wrap">{formatText(content.slice(lastIndex, match.index))}</span>)
    }
    parts.push(<CodeBlock key={match.index} language={match[1]} code={match[2].trim()} />)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    parts.push(<span key={lastIndex} className="whitespace-pre-wrap">{formatText(content.slice(lastIndex))}</span>)
  }
  return parts.length > 0 ? parts : <span className="whitespace-pre-wrap">{formatText(content)}</span>
}

function formatText(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    }
    return part.split(/(`[^`]+`)/g).map((cp, j) => {
      if (cp.startsWith('`') && cp.endsWith('`')) {
        return <code key={j} className="px-1.5 py-0.5 rounded text-xs font-mono"
                     style={{ background: 'rgba(255,255,255,0.1)', color: '#00F5FF' }}>{cp.slice(1, -1)}</code>
      }
      return cp
    })
  })
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
           style={{ background: isUser ? 'linear-gradient(135deg, #FF2D55, #8B5CF6)' : 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>
        {isUser ? '👤' : '✨'}
      </div>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
             style={{
               background: isUser ? 'linear-gradient(135deg, rgba(255,45,85,0.2), rgba(139,92,246,0.2))' : 'rgba(255,255,255,0.05)',
               border: isUser ? '1px solid rgba(255,45,85,0.2)' : '1px solid rgba(255,255,255,0.08)',
               color: 'rgba(255,255,255,0.85)',
             }}>
          {message.imageUrl && <img src={message.imageUrl} alt="Generated" className="rounded-xl mb-3 max-w-full" style={{ maxHeight: '300px' }} />}
          {message.fileName && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <IconFile /><span className="text-xs text-white/60">{message.fileName}</span>
            </div>
          )}
          <div>{isUser ? <span className="whitespace-pre-wrap">{message.content}</span> : renderMessage(message.content)}</div>
          {message.streaming && <span className="inline-block w-2 h-4 ml-0.5 animate-pulse" style={{ background: '#00F5FF', borderRadius: '1px' }} />}
        </div>
        {!isUser && !message.streaming && (
          <button onClick={() => { navigator.clipboard.writeText(message.content); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-all px-1">
            <IconCopy />{copied ? 'Copié !' : 'Copier'}
          </button>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>✨</div>
      <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
        </div>
      </div>
    </div>
  )
}

export default function NexvariAI() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mode, setMode] = useState('chat')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [savingConv, setSavingConv] = useState(false)
  const [editingTitle, setEditingTitle] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const { data: profile } = await supabase.from('profiles').select('is_premium, has_voice, has_video').eq('id', user.id).single()
      const hasPremium = profile?.is_premium || profile?.has_voice || profile?.has_video
      if (!hasPremium) { router.push('/pricing'); return }

      // Charger les conversations sauvegardées
      await loadConversations(user.id)
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Auto-save quand les messages changent
  useEffect(() => {
    if (!activeConvId || messages.length === 0 || isTyping) return
    clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => saveConversation(), 1500)
    return () => clearTimeout(saveTimeoutRef.current)
  }, [messages, activeConvId])

  const loadConversations = async (userId) => {
    const { data } = await supabase
      .from('ai_conversations')
      .select('id, title, messages, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(30)

    if (data && data.length > 0) {
      setConversations(data)
      // Charger la dernière conversation
      setActiveConvId(data[0].id)
      setMessages(data[0].messages || [])
    } else {
      // Créer une première conversation
      await createNewConversation(userId)
    }
  }

  const createNewConversation = async (userId) => {
    const uid = userId || user?.id
    if (!uid) return

    const { data } = await supabase
      .from('ai_conversations')
      .insert({ user_id: uid, title: 'Nouvelle conversation', messages: [] })
      .select()
      .single()

    if (data) {
      setConversations(prev => [data, ...prev])
      setActiveConvId(data.id)
      setMessages([])
    }
  }

  const saveConversation = async () => {
    if (!activeConvId || messages.length === 0) return
    setSavingConv(true)

    const title = messages[0]?.content?.slice(0, 50) || 'Nouvelle conversation'

    await supabase
      .from('ai_conversations')
      .update({
        messages,
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activeConvId)

    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, messages, title } : c
    ))
    setSavingConv(false)
  }

  const switchConversation = (conv) => {
    setActiveConvId(conv.id)
    setMessages(conv.messages || [])
    setInput('')
    setUploadedFile(null)
  }

  const deleteConversation = async (convId) => {
    await supabase.from('ai_conversations').delete().eq('id', convId)
    const remaining = conversations.filter(c => c.id !== convId)
    setConversations(remaining)

    if (activeConvId === convId) {
      if (remaining.length > 0) {
        switchConversation(remaining[0])
      } else {
        await createNewConversation()
        setMessages([])
      }
    }
  }

  const renameConversation = async (convId, title) => {
    await supabase.from('ai_conversations').update({ title }).eq('id', convId)
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, title } : c))
    setEditingTitle(null)
  }

  const sendMessage = async (text, file) => {
    const content = text || input
    if (!content.trim() && !file) return
    setInput('')
    setUploadedFile(null)

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: content || `Analyse ce fichier : ${file?.name}`,
      fileName: file?.name || null,
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    try {
      if (mode === 'image') {
        const res = await fetch('/api/ai/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content, userId: user.id }),
        })
        const data = await res.json()
        setIsTyping(false)
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.error ? `❌ ${data.error}` : 'Voici l\'image générée :',
          imageUrl: data.imageUrl || null,
        }])
        return
      }

      // Chat streaming
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }))

      let fileContent = ''
      if (file) {
        fileContent = await new Promise(resolve => {
          const reader = new FileReader()
          reader.onload = e => resolve(e.target.result)
          reader.readAsText(file)
        })
      }

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content + (fileContent ? `\n\nContenu du fichier :\n${fileContent.slice(0, 8000)}` : ''),
          history,
          userId: user.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setIsTyping(false)
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.error || 'Erreur.' }])
        return
      }

      setIsTyping(false)
      const aiMsgId = Date.now() + 1
      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', streaming: true }])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              fullText += parsed.text
              setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: fullText, streaming: true } : m))
            }
          } catch {}
        }
      }

      // Marquer comme terminé
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, streaming: false } : m))

    } catch (err) {
      setIsTyping(false)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: '❌ Erreur de connexion.' }])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadedFile(file)
    setInput(`Analyse ce fichier : ${file.name}`)
  }

  const formatDate = (d) => {
    const date = new Date(d)
    const now = new Date()
    const diff = now - date
    if (diff < 86400000) return 'Aujourd\'hui'
    if (diff < 172800000) return 'Hier'
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  if (loading) return (
    <div className="min-h-screen grid-bg flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
    </div>
  )

  return (
    <>
      <SEO title="Nexvari AI — Chat IA illimité" url="https://nexvari.com/nexvari-ai" />
      <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ background: '#080808', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <div className={`flex-shrink-0 flex flex-col border-r border-white/5 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
             style={{ background: '#0A0A0A' }}>

          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>
                <IconSparkle />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Nexvari AI</p>
                <p className="text-white/30 text-xs">{conversations.length} conversation{conversations.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <button onClick={() => createNewConversation()}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all border border-white/8 hover:border-white/20"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
              <IconPlus /> Nouvelle conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 chat-scroll">
            {conversations.map(conv => (
              <div key={conv.id}
                   className="group rounded-xl mb-1 transition-all"
                   style={{ background: activeConvId === conv.id ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
                {editingTitle === conv.id ? (
                  <div className="px-3 py-2">
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') renameConversation(conv.id, newTitle); if (e.key === 'Escape') setEditingTitle(null) }}
                      onBlur={() => renameConversation(conv.id, newTitle)}
                      className="w-full text-xs text-white bg-transparent outline-none border-b border-white/20"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-2.5">
                    <button onClick={() => switchConversation(conv)} className="flex-1 text-left min-w-0">
                      <p className="text-xs truncate" style={{ color: activeConvId === conv.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}>
                        {conv.title}
                      </p>
                      <p className="text-xs text-white/20 mt-0.5">{formatDate(conv.updated_at)}</p>
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 flex-shrink-0">
                      <button onClick={() => { setEditingTitle(conv.id); setNewTitle(conv.title) }}
                              className="text-white/20 hover:text-white/60 p-1"><IconEdit /></button>
                      <button onClick={() => deleteConversation(conv.id)}
                              className="text-white/20 hover:text-red-400 p-1"><IconTrash /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            {savingConv && <p className="text-white/20 text-xs text-center mb-2">💾 Sauvegarde...</p>}
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-white/40 truncate flex-1">{user?.email}</span>
            </div>
            <button onClick={() => router.push('/')} className="w-full text-xs text-white/20 hover:text-white/40 transition-colors mt-2 text-center">
              ← Retour au site
            </button>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0">

          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-white/70"><IconMenu /></button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>
                  <IconSparkle />
                </div>
                <span className="text-white font-semibold text-sm">Nexvari AI</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,245,255,0.1)', color: '#00F5FF', border: '1px solid rgba(0,245,255,0.2)' }}>Premium</span>
              </div>
            </div>
            <div className="flex rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {[{ id: 'chat', label: '💬 Chat' }, { id: 'image', label: '🎨 Image' }].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{ background: mode === m.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)' }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-scroll">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #00F5FF20, #8B5CF620)', border: '1px solid rgba(0,245,255,0.2)' }}>
                  <IconSparkle />
                </div>
                <h2 className="text-white font-bold text-xl mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>NEXVARI AI</h2>
                <p className="text-white/40 text-sm mb-8 max-w-md">
                  {mode === 'image' ? 'Décris l\'image que tu veux générer.' : 'Pose-moi n\'importe quelle question ou demande du code.'}
                </p>
                {mode === 'chat' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s.text)}
                              className="flex items-center gap-2 px-4 py-3 rounded-xl text-left text-sm text-white/60 hover:text-white transition-all border border-white/8 hover:border-white/20"
                              style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <span>{s.emoji}</span><span className="text-xs">{s.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
                {isTyping && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-4 border-t border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
            {uploadedFile && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg w-fit" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <IconFile /><span className="text-xs text-purple-300">{uploadedFile.name}</span>
                <button onClick={() => { setUploadedFile(null); setInput('') }} className="text-white/30 hover:text-white/60 ml-1">×</button>
              </div>
            )}
            <div className="flex gap-2 items-end">
              {mode === 'chat' && (
                <>
                  <input ref={fileInputRef} type="file" className="hidden" accept=".txt,.pdf,.md,.js,.py,.json,.csv" onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()}
                          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 border border-white/8 hover:border-white/20"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <IconFile />
                  </button>
                </>
              )}
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'image' ? '🎨 Décris l\'image à générer...' : '💬 Envoie un message... (Entrée pour envoyer)'}
                rows={1}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '120px', fontFamily: 'var(--font-body)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px' }}
              />
              <button onClick={() => sendMessage(null, uploadedFile)}
                      disabled={(!input.trim() && !uploadedFile) || isTyping}
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                      style={{ background: input.trim() || uploadedFile ? 'linear-gradient(135deg, #00F5FF, #8B5CF6)' : 'rgba(255,255,255,0.08)' }}>
                <IconSend />
              </button>
            </div>
            <p className="text-white/15 text-xs text-center mt-2">Nexvari AI peut faire des erreurs. Vérifiez les informations importantes.</p>
          </div>
        </div>
      </div>
    </>
  )
}
