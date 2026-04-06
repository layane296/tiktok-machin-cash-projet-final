// pages/nexvari-ai.js
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

// ─── Icônes ───────────────────────────────────────────────────────
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const IconImage = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
)
const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
  </svg>
)

const SUGGESTIONS = [
  { emoji: '🎬', text: 'Écris-moi un script TikTok viral sur le dropshipping' },
  { emoji: '📧', text: 'Rédige un email de prospection pour mes clients' },
  { emoji: '🖼️', text: 'Génère une image d\'un coucher de soleil futuriste' },
  { emoji: '💡', text: 'Donne-moi 10 idées de business en ligne pour 2025' },
  { emoji: '📝', text: 'Analyse ce texte et résume-le en 5 points clés' },
  { emoji: '🚀', text: 'Comment créer une stratégie marketing TikTok ?' },
]

function MessageBubble({ message, onCopy }) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
           style={{
             background: isUser
               ? 'linear-gradient(135deg, #FF2D55, #8B5CF6)'
               : 'linear-gradient(135deg, #00F5FF, #8B5CF6)',
           }}>
        {isUser ? '👤' : '✨'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
             style={{
               background: isUser
                 ? 'linear-gradient(135deg, rgba(255,45,85,0.2), rgba(139,92,246,0.2))'
                 : 'rgba(255,255,255,0.05)',
               border: isUser
                 ? '1px solid rgba(255,45,85,0.2)'
                 : '1px solid rgba(255,255,255,0.08)',
               color: 'rgba(255,255,255,0.85)',
             }}>
          {/* Image générée */}
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Generated" className="rounded-xl mb-3 max-w-full"
                 style={{ maxHeight: '300px', objectFit: 'contain' }} />
          )}

          {/* Fichier uploadé */}
          {message.fileName && (
            <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg"
                 style={{ background: 'rgba(255,255,255,0.08)' }}>
              <IconFile />
              <span className="text-xs text-white/60">{message.fileName}</span>
            </div>
          )}

          {/* Text content */}
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Copy button */}
        {!isUser && (
          <button onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-all px-1">
            <IconCopy />
            {copied ? 'Copié !' : 'Copier'}
          </button>
        )}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
           style={{ background: 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>✨</div>
      <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-1 items-center h-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40"
                 style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NexvariAI() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversations, setConversations] = useState([{ id: 1, title: 'Nouvelle conversation', messages: [] }])
  const [activeConv, setActiveConv] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mode, setMode] = useState('chat') // 'chat' | 'image'
  const [uploadedFile, setUploadedFile] = useState(null)
  const [imageGenerating, setImageGenerating] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const { data: profile } = await supabase.from('profiles').select('is_premium, has_voice, has_video').eq('id', user.id).single()
      const hasPremium = profile?.is_premium || profile?.has_voice || profile?.has_video
      setIsPremium(hasPremium)
      if (!hasPremium) { router.push('/pricing'); return }
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text, file) => {
    const content = text || input
    if (!content.trim() && !file) return
    setInput('')

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: content || (file ? `Analyse ce fichier : ${file.name}` : ''),
      fileName: file?.name || null,
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // Update conversation title
    if (messages.length === 0) {
      setConversations(prev => prev.map(c =>
        c.id === activeConv ? { ...c, title: content.slice(0, 40) || 'Nouvelle conversation' } : c
      ))
    }

    try {
      // Mode génération d'image
      if (mode === 'image') {
        setImageGenerating(true)
        const res = await fetch('/api/ai/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: content, userId: user.id }),
        })
        const data = await res.json()
        setIsTyping(false)
        setImageGenerating(false)

        const aiMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.error ? `❌ ${data.error}` : 'Voici l\'image générée :',
          imageUrl: data.imageUrl || null,
        }
        setMessages(prev => [...prev, aiMsg])
        return
      }

      // Mode chat
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }))

      // Si fichier, lire le contenu
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

      const data = await res.json()
      setIsTyping(false)

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || data.error || 'Une erreur est survenue.',
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: '❌ Erreur de connexion. Réessaie.',
      }])
    }
    setUploadedFile(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const newConversation = () => {
    const id = Date.now()
    setConversations(prev => [{ id, title: 'Nouvelle conversation', messages: [] }, ...prev])
    setActiveConv(id)
    setMessages([])
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadedFile(file)
    setInput(`Analyse ce fichier : ${file.name}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen grid-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Nexvari AI — Chat IA illimité | TikTok Cash Machine"
        description="Chat avec une IA puissante sans limite. Génère du texte, des images et analyse des fichiers."
        url="https://nexvari.com/nexvari-ai"
      />

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <div className="flex h-screen overflow-hidden" style={{ background: '#080808', fontFamily: 'var(--font-body)' }}>

        {/* ── Sidebar ── */}
        <div className={`flex-shrink-0 flex flex-col border-r border-white/5 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
             style={{ background: '#0A0A0A' }}>

          {/* Logo */}
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>
                <IconSparkle />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Nexvari AI</p>
                <p className="text-white/30 text-xs">Powered by Claude</p>
              </div>
            </div>
            <button onClick={newConversation}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all border border-white/8 hover:border-white/20"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
              <IconPlus /> Nouvelle conversation
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto p-2 chat-scroll">
            {conversations.map(conv => (
              <button key={conv.id} onClick={() => { setActiveConv(conv.id); setMessages(conv.messages || []) }}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all mb-1 group flex items-center justify-between"
                      style={{
                        background: activeConv === conv.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                        color: activeConv === conv.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                      }}>
                <span className="truncate flex-1">{conv.title}</span>
                <span onClick={e => {
                  e.stopPropagation()
                  setConversations(prev => prev.filter(c => c.id !== conv.id))
                  if (activeConv === conv.id) { setMessages([]); setActiveConv(conversations[0]?.id) }
                }}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all ml-1">
                  <IconTrash />
                </span>
              </button>
            ))}
          </div>

          {/* User info */}
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl"
                 style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                   style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-white/40 truncate flex-1">{user?.email}</span>
            </div>
            <button onClick={() => router.push('/')}
                    className="w-full text-xs text-white/20 hover:text-white/40 transition-colors mt-2 text-center">
              ← Retour au site
            </button>
          </div>
        </div>

        {/* ── Main chat area ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="text-white/40 hover:text-white/70 transition-colors">
                <IconMenu />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #00F5FF, #8B5CF6)' }}>
                  <IconSparkle />
                </div>
                <span className="text-white font-semibold text-sm">Nexvari AI</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(0,245,255,0.1)', color: '#00F5FF', border: '1px solid rgba(0,245,255,0.2)' }}>
                  Premium
                </span>
              </div>
            </div>

            {/* Mode selector */}
            <div className="flex rounded-lg p-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {[
                { id: 'chat', label: '💬 Chat' },
                { id: 'image', label: '🎨 Image' },
              ].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                        style={{
                          background: mode === m.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                          color: mode === m.id ? '#fff' : 'rgba(255,255,255,0.4)',
                        }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 chat-scroll">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                     style={{ background: 'linear-gradient(135deg, #00F5FF20, #8B5CF620)', border: '1px solid rgba(0,245,255,0.2)' }}>
                  <IconSparkle />
                </div>
                <h2 className="text-white font-bold text-xl mb-2"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                  NEXVARI AI
                </h2>
                <p className="text-white/40 text-sm mb-8 max-w-md">
                  {mode === 'image'
                    ? 'Décris l\'image que tu veux générer et je la crée pour toi.'
                    : 'Pose-moi n\'importe quelle question. Je suis là pour t\'aider.'}
                </p>

                {mode === 'chat' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s.text)}
                              className="flex items-center gap-2 px-4 py-3 rounded-xl text-left text-sm text-white/60 hover:text-white transition-all border border-white/8 hover:border-white/20"
                              style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <span>{s.emoji}</span>
                        <span className="text-xs">{s.text}</span>
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

          {/* Input area */}
          <div className="px-4 py-4 border-t border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>

            {/* Fichier uploadé */}
            {uploadedFile && (
              <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg w-fit"
                   style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <IconFile />
                <span className="text-xs text-purple-300">{uploadedFile.name}</span>
                <button onClick={() => { setUploadedFile(null); setInput('') }}
                        className="text-white/30 hover:text-white/60 ml-1">×</button>
              </div>
            )}

            <div className="flex gap-2 items-end">
              {/* File upload (chat mode only) */}
              {mode === 'chat' && (
                <>
                  <input ref={fileInputRef} type="file" className="hidden"
                         accept=".txt,.pdf,.md,.js,.py,.json,.csv"
                         onChange={handleFileUpload} />
                  <button onClick={() => fileInputRef.current?.click()}
                          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white/70 transition-all border border-white/8 hover:border-white/20"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <IconFile />
                  </button>
                </>
              )}

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === 'image' ? '🎨 Décris l\'image à générer...' : '💬 Envoie un message... (Entrée pour envoyer)'}
                  rows={1}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none resize-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    maxHeight: '120px',
                    lineHeight: '1.5',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  onInput={e => {
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                  }}
                />
              </div>

              {/* Send */}
              <button onClick={() => sendMessage(null, uploadedFile)}
                      disabled={(!input.trim() && !uploadedFile) || isTyping}
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                      style={{
                        background: input.trim() || uploadedFile
                          ? 'linear-gradient(135deg, #00F5FF, #8B5CF6)'
                          : 'rgba(255,255,255,0.08)',
                      }}>
                <IconSend />
              </button>
            </div>
            <p className="text-white/15 text-xs text-center mt-2">
              Nexvari AI peut faire des erreurs. Vérifiez les informations importantes.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
