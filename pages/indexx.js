import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

// ─── Icônes ───────────────────────────────────────────────────────
const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
  </svg>
)
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="20 6 9 12 4 10"/>
  </svg>
)
const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const IconCrown = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M2 20h20v2H2v-2zM4 18l4-8 4 4 4-6 4 10H4z"/>
  </svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconHistory = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
  </svg>
)
const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
)
const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
  </svg>
)

// ─── Hooks ────────────────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(null)
  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }
  return { copied, copy }
}

// ─── Constantes ───────────────────────────────────────────────────
const FREE_LIMIT = 1
const STORAGE_KEY = 'tcm_generations_used'
const PREMIUM_KEY = 'tcm_premium'

// ─── Modale Premium ───────────────────────────────────────────────
function PremiumModal({ onClose, onCheckout, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 p-8 text-center"
           style={{ background: '#0F0F0F' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70"><IconX /></button>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-black"
               style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)' }}>
            <IconLock />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
          GÉNÉRATION GRATUITE UTILISÉE
        </h2>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          Passe en Premium pour des générations illimitées.
        </p>
        <div className="space-y-3 mb-6 text-left">
          {['Générations illimitées', 'Scripts ultra-viraux', 'Hashtags premium', 'Sauvegarde de tous tes scripts'].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}><IconCheck /></div>
              {f}
            </div>
          ))}
        </div>
        <div className="rounded-xl p-4 mb-4 border border-white/10" style={{ background: 'rgba(255,215,0,0.05)' }}>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>9,99€</span>
            <span className="text-white/40 text-sm">/mois</span>
          </div>
        </div>
        <button onClick={onCheckout} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base text-black transition-all duration-200 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', boxShadow: '0 0 40px rgba(255,215,0,0.3)' }}>
          {loading ? 'Redirection...' : <><IconCrown /> Premium — 9,99€/mois</>}
        </button>
        <p className="text-white/20 text-xs mt-4">Paiement sécurisé par Stripe 🔒</p>
      </div>
    </div>
  )
}

// ─── Modale Voix ──────────────────────────────────────────────────
function VoiceModal({ onClose, onCheckout, loading, isPremium }) {
  const [selectedPlan, setSelectedPlan] = useState(isPremium ? 'voice' : 'complete')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 p-8"
           style={{ background: '#0F0F0F' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white/70"><IconX /></button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #8B5CF6, #00F5FF)' }}>
            <IconMic />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 text-center" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
          PACK VOIX OFF
        </h2>
        <p className="text-white/50 text-sm mb-6 text-center leading-relaxed">
          Transforme tes scripts en voix off professionnelle et télécharge l'audio pour tes vidéos TikTok.
        </p>

        {/* Features voix */}
        <div className="space-y-2 mb-6">
          {[
            '🎙️ Voix off naturelle (IA OpenAI)',
            '⬇️ Téléchargement MP3 illimité',
            '⚡ Génération en 5 secondes',
            '🎬 Structure vidéo automatique (bientôt)',
          ].map(f => (
            <div key={f} className="flex items-center gap-3 text-sm text-white/70">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}><IconCheck /></div>
              {f}
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {/* Plan Voix seul (si déjà Premium) */}
          {isPremium && (
            <div onClick={() => setSelectedPlan('voice')}
                 className="rounded-xl p-4 border cursor-pointer transition-all duration-200"
                 style={{
                   borderColor: selectedPlan === 'voice' ? 'rgba(139,92,246,0.6)' : 'rgba(255,255,255,0.1)',
                   background: selectedPlan === 'voice' ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                 }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">Pack Voix</p>
                  <p className="text-white/40 text-xs mt-0.5">Pour les abonnés Premium existants</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>12,99€</span>
                  <span className="text-white/40 text-xs">/mois</span>
                </div>
              </div>
            </div>
          )}

          {/* Pack Complet (si pas Premium) */}
          {!isPremium && (
            <div onClick={() => setSelectedPlan('complete')}
                 className="rounded-xl p-4 border cursor-pointer transition-all duration-200 relative overflow-hidden"
                 style={{
                   borderColor: selectedPlan === 'complete' ? 'rgba(255,215,0,0.6)' : 'rgba(255,255,255,0.1)',
                   background: selectedPlan === 'complete' ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)',
                 }}>
              <div className="absolute top-2 right-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700' }}>
                  MEILLEURE OFFRE
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">Pack Complet</p>
                  <p className="text-white/40 text-xs mt-0.5">Scripts illimités + Voix off</p>
                </div>
                <div className="text-right">
                  <p className="text-white/30 text-xs line-through">22,98€</p>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>19,99€</span>
                  <span className="text-white/40 text-xs">/mois</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => onCheckout(selectedPlan)} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all duration-200 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #00F5FF)',
                  color: '#fff',
                  boxShadow: '0 0 40px rgba(139,92,246,0.3)',
                }}>
          {loading ? 'Redirection...' : <><IconMic /> {isPremium ? 'Pack Voix — 12,99€/mois' : 'Pack Complet — 19,99€/mois'}</>}
        </button>
        <p className="text-white/20 text-xs mt-4 text-center">Paiement sécurisé par Stripe 🔒</p>
      </div>
    </div>
  )
}

// ─── Lecteur Audio ─────────────────────────────────────────────────
function AudioPlayer({ audioBase64, topic }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    if (audioBase64) {
      const blob = base64ToBlob(audioBase64, 'audio/mp3')
      const url = URL.createObjectURL(blob)
      if (audioRef.current) {
        audioRef.current.src = url
      }
      return () => URL.revokeObjectURL(url)
    }
  }, [audioBase64])

  const base64ToBlob = (base64, type) => {
    const binary = atob(base64)
    const array = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i)
    return new Blob([array], { type })
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
    else { audioRef.current.play(); setIsPlaying(true) }
  }

  const handleDownload = () => {
    const blob = base64ToBlob(audioBase64, 'audio/mp3')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voix-off-${topic?.slice(0, 20).replace(/\s/g, '-') || 'script'}.mp3`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-xl border border-white/10 p-4"
         style={{ background: 'rgba(139,92,246,0.05)' }}>
      <audio ref={audioRef}
             onEnded={() => setIsPlaying(false)}
             onTimeUpdate={() => {
               if (audioRef.current) {
                 setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0)
               }
             }} />

      <div className="flex items-center gap-3">
        <button onClick={togglePlay}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #00F5FF)' }}>
          {isPlaying ? <IconPause /> : <IconPlay />}
        </button>

        <div className="flex-1">
          <p className="text-xs text-white/50 mb-1.5">Voix off générée ✨</p>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-100"
                 style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #8B5CF6, #00F5FF)' }} />
          </div>
        </div>

        <button onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
          <IconDownload /> MP3
        </button>
      </div>
    </div>
  )
}

// ─── ResultCard ───────────────────────────────────────────────────
function ResultCard({ icon, label, accent, children, copyText, copyId, copied, onCopy }) {
  const accentColors = {
    pink: 'text-[#FF2D55] border-[#FF2D55]/30 bg-[#FF2D55]/5',
    cyan: 'text-[#00F5FF] border-[#00F5FF]/30 bg-[#00F5FF]/5',
    purple: 'text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/5',
    gold: 'text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/5',
  }
  const borderGlow = {
    pink: 'hover:border-[#FF2D55]/60 hover:shadow-[0_0_30px_rgba(255,45,85,0.15)]',
    cyan: 'hover:border-[#00F5FF]/60 hover:shadow-[0_0_30px_rgba(0,245,255,0.15)]',
    purple: 'hover:border-[#8B5CF6]/60 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    gold: 'hover:border-[#FFD700]/60 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]',
  }
  const isCopied = copied === copyId
  return (
    <div className={`relative border border-white/10 rounded-2xl p-6 transition-all duration-300 ${borderGlow[accent]}`}
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${accentColors[accent]}`}>
          <span>{icon}</span><span>{label}</span>
        </div>
        {copyText && (
          <button onClick={() => onCopy(copyText, copyId)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${isCopied ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 bg-white/5'}`}>
            {isCopied ? <IconCheck /> : <IconCopy />}
            {isCopied ? 'Copié !' : 'Copier'}
          </button>
        )}
      </div>
      <div className="text-white/85 text-sm leading-relaxed font-light">{children}</div>
    </div>
  )
}

// ─── Page principale ───────────────────────────────────────────────
export default function Home() {
  const router = useRouter()
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [voiceLoading, setVoiceLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [error, setError] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showVoiceModal, setShowVoiceModal] = useState(false)
  const [showPremiumBanner, setShowPremiumBanner] = useState(false)
  const [showVoiceBanner, setShowVoiceBanner] = useState(false)
  const [generationsUsed, setGenerationsUsed] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const [hasVoice, setHasVoice] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { copied, copy } = useCopy()
  const resultRef = useRef(null)

  const loadingSteps = ['Analyse du sujet…', 'Création du hook viral…', 'Écriture du script…', 'Optimisation des hashtags…', 'Finalisation…']

  const loadProfile = async (userId) => {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(prof)
    if (prof) {
      setIsPremium(prof.is_premium)
      setHasVoice(prof.has_voice || false)
      setGenerationsUsed(prof.generations_used || 0)
    }
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await loadProfile(user.id)
      } else {
        const used = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
        const premium = localStorage.getItem(PREMIUM_KEY) === 'true'
        setGenerationsUsed(used)
        setIsPremium(premium)
      }

      // Retour Stripe Premium
      const { success, success_voice, plan, session_id, canceled } = router.query
      if (success && session_id) {
        const res = await fetch('/api/verify-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: session_id, userId: user?.id }),
        })
        const data = await res.json()
        if (data.isPremium) {
          setIsPremium(true)
          setShowPremiumBanner(true)
          if (!user) localStorage.setItem(PREMIUM_KEY, 'true')
          if (user) await loadProfile(user.id)
          router.replace('/', undefined, { shallow: true })
        }
      }

      // Retour Stripe Voix
      if (success_voice && session_id && user) {
        // Activer has_voice dans Supabase
        const updates = { has_voice: true, voice_session_id: session_id }
        if (plan === 'complete') updates.is_premium = true
        await supabase.from('profiles').update(updates).eq('id', user.id)
        await loadProfile(user.id)
        setShowVoiceBanner(true)
        router.replace('/', undefined, { shallow: true })
      }
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [router.query])

  useEffect(() => {
    let interval
    if (loading) interval = setInterval(() => setLoadingStep(s => (s + 1) % loadingSteps.length), 900)
    else setLoadingStep(0)
    return () => clearInterval(interval)
  }, [loading])

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return
    if (!isPremium && generationsUsed >= FREE_LIMIT) { setShowPremiumModal(true); return }

    setLoading(true)
    setError('')
    setResult(null)
    setAudioData(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userId: user?.id }),
      })
      const data = await res.json()
      if (data.error === 'LIMIT_REACHED') { setShowPremiumModal(true); setLoading(false); return }
      if (!res.ok) { setError(data.error || 'Une erreur est survenue.'); setLoading(false); return }

      setResult(data)
      if (!isPremium) {
        const newCount = generationsUsed + 1
        setGenerationsUsed(newCount)
        if (!user) localStorage.setItem(STORAGE_KEY, newCount.toString())
      }
      if (user) await loadProfile(user.id)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch { setError('Impossible de contacter le serveur.') }
    finally { setLoading(false) }
  }

  const handleGenerateVoice = async () => {
    if (!result?.script) return
    if (!hasVoice) { setShowVoiceModal(true); return }

    setVoiceLoading(true)
    setError('')

    try {
      const res = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.script, userId: user?.id }),
      })
      const data = await res.json()
      if (data.error === 'VOICE_REQUIRED') { setShowVoiceModal(true); return }
      if (!res.ok) { setError(data.error || 'Erreur lors de la génération audio.'); return }
      setAudioData(data.audio)
    } catch { setError('Erreur lors de la génération de la voix.') }
    finally { setVoiceLoading(false) }
  }

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { setError(data.error || 'Erreur Stripe.'); setShowPremiumModal(false) }
    } catch { setError('Erreur Stripe.'); setShowPremiumModal(false) }
    finally { setCheckoutLoading(false) }
  }

  const handleVoiceCheckout = async (plan) => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/checkout-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { setError(data.error || 'Erreur Stripe.'); setShowVoiceModal(false) }
    } catch { setError('Erreur Stripe.'); setShowVoiceModal(false) }
    finally { setCheckoutLoading(false) }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null); setProfile(null); setIsPremium(false); setHasVoice(false)
    setGenerationsUsed(0); setUserMenuOpen(false)
  }

  const isBlocked = !isPremium && generationsUsed >= FREE_LIMIT
  const generationsLeft = isPremium ? '∞' : Math.max(0, FREE_LIMIT - generationsUsed)
  const allContent = result ? `🪝 HOOK\n${result.hook}\n\n📜 SCRIPT\n${result.script}\n\n📝 DESCRIPTION\n${result.description}\n\n#️⃣ HASHTAGS\n${result.hashtags}` : ''

  return (
    <>
      <Head>
        <title>TikTok Cash Machine — Scripts viraux + Voix off IA</title>
        <meta name="description" content="Génère des scripts TikTok viraux et des voix off professionnelles grâce à l'IA." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
      </Head>

      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} onCheckout={handleCheckout} loading={checkoutLoading} />}
      {showVoiceModal && <VoiceModal onClose={() => setShowVoiceModal(false)} onCheckout={handleVoiceCheckout} loading={checkoutLoading} isPremium={isPremium} />}

      {/* Bannières */}
      {showPremiumBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: 'rgba(255,215,0,0.1)', borderColor: 'rgba(255,215,0,0.3)' }}>
            <IconCrown /><span className="text-sm font-medium text-yellow-400 flex-1">🎉 Bienvenue en Premium !</span>
            <button onClick={() => setShowPremiumBanner(false)} className="text-white/30 hover:text-white/70"><IconX /></button>
          </div>
        </div>
      )}
      {showVoiceBanner && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl border" style={{ background: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.3)' }}>
            <IconMic /><span className="text-sm font-medium text-purple-400 flex-1">🎙️ Pack Voix activé !</span>
            <button onClick={() => setShowVoiceBanner(false)} className="text-white/30 hover:text-white/70"><IconX /></button>
          </div>
        </div>
      )}

      <div className="min-h-screen grid-bg relative" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #FF2D55, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #00F5FF, transparent 70%)' }} />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              <IconTikTok />
            </div>
            <span className="font-semibold text-white text-sm tracking-tight">TikTok Cash Machine</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Badges */}
            {isPremium && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
                   style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700', background: 'rgba(255,215,0,0.08)' }}>
                <IconCrown /> Premium
              </div>
            )}
            {hasVoice && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
                   style={{ borderColor: 'rgba(139,92,246,0.3)', color: '#8B5CF6', background: 'rgba(139,92,246,0.08)' }}>
                <IconMic /> Voix
              </div>
            )}
            {!isPremium && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs"
                   style={{ borderColor: isBlocked ? 'rgba(255,45,85,0.4)' : 'rgba(255,255,255,0.1)', color: isBlocked ? '#FF2D55' : 'rgba(255,255,255,0.4)' }}>
                {isBlocked ? <><IconLock /> Limite</> : `${generationsLeft} gratuite`}
              </div>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <IconUser />
                  <span className="hidden sm:block max-w-[100px] truncate">{user.email}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 w-48 rounded-xl border border-white/10 overflow-hidden z-50"
                       style={{ background: '#0F0F0F' }}>
                    <button onClick={() => { router.push('/mes-scripts'); setUserMenuOpen(false) }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors text-left">
                      <IconHistory /> Mes scripts
                    </button>
                    {!isPremium && (
                      <button onClick={() => { setShowPremiumModal(true); setUserMenuOpen(false) }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-yellow-400 hover:bg-white/5 transition-colors text-left">
                        <IconCrown /> Premium — 9,99€
                      </button>
                    )}
                    {!hasVoice && (
                      <button onClick={() => { setShowVoiceModal(true); setUserMenuOpen(false) }}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-purple-400 hover:bg-white/5 transition-colors text-left">
                        <IconMic /> Pack Voix — 12,99€
                      </button>
                    )}
                    <div className="border-t border-white/10" />
                    <button onClick={handleSignOut}
                            className="w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors text-left">
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => router.push('/auth')}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/60 hover:text-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                <IconUser /> Connexion
              </button>
            )}
          </div>
        </nav>

        <main className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-20">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium"
                 style={{ borderColor: 'rgba(255,45,85,0.4)', background: 'rgba(255,45,85,0.08)', color: '#FF2D55' }}>
              <IconZap /><span>Script TikTok viral + Voix off IA</span>
            </div>
          </div>

          <h1 className="text-center mb-4 leading-none"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', letterSpacing: '0.02em' }}>
            <span className="glitch-text" data-text="TIKTOK">TIKTOK</span>{' '}
            <span style={{ backgroundImage: 'linear-gradient(90deg, #FF2D55, #00F5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CASH</span>
            <br />
            <span className="glitch-text" data-text="MACHINE">MACHINE</span>
          </h1>

          <p className="text-center text-white/50 text-base mb-10 max-w-lg mx-auto leading-relaxed">
            Script viral + hook + hashtags + voix off professionnelle. Tout ce qu'il faut pour cartonner sur TikTok.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-10">
            {[{ label: 'Scripts générés', value: '47K+' }, { label: 'Vues cumulées', value: '2.1M' }, { label: 'Creators actifs', value: '8.3K' }].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>{value}</div>
                <div className="text-xs text-white/30 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Plans */}
          {!hasVoice && !isBlocked && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Gratuit', desc: '1 génération', price: '0€', color: 'rgba(255,255,255,0.1)', active: !isPremium },
                { label: 'Premium', desc: 'Scripts illimités', price: '9,99€/mois', color: 'rgba(255,215,0,0.3)', active: isPremium, icon: <IconCrown /> },
                { label: 'Voix Off', desc: 'Premium + audio', price: '12,99€/mois', color: 'rgba(139,92,246,0.3)', active: hasVoice, icon: <IconMic />, onClick: () => setShowVoiceModal(true) },
              ].map(({ label, desc, price, color, active, icon, onClick }) => (
                <div key={label}
                     onClick={onClick}
                     className={`rounded-xl p-4 border text-center transition-all duration-200 ${onClick ? 'cursor-pointer hover:scale-105' : ''}`}
                     style={{ borderColor: color, background: active ? `${color.replace('0.3', '0.08')}` : 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {icon && <span style={{ color: active ? '#FFD700' : 'rgba(255,255,255,0.4)' }}>{icon}</span>}
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">{label}</p>
                  </div>
                  <p className="text-white text-sm font-medium">{desc}</p>
                  <p className="text-white/40 text-xs mt-1">{price}</p>
                </div>
              ))}
            </div>
          )}

          {/* Bloqué */}
          {isBlocked && (
            <div className="rounded-2xl border p-5 mb-6 flex items-center gap-4"
                 style={{ borderColor: 'rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.05)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-yellow-400"
                   style={{ background: 'rgba(255,215,0,0.15)' }}><IconLock /></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Génération gratuite utilisée</p>
                <p className="text-xs text-white/40 mt-0.5">Passe en Premium pour continuer</p>
              </div>
              <button onClick={() => setShowPremiumModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 text-black"
                      style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)' }}>
                <IconCrown /> 9,99€/mois
              </button>
            </div>
          )}

          {/* Generator */}
          <div className="rounded-2xl border border-white/10 p-6 mb-6"
               style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
            <label className="block text-sm font-medium text-white/60 mb-3">Quel est ton sujet ?</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && handleGenerate()}
              placeholder="Ex: Comment gagner 1000€/mois en dropshipping..."
              rows={3}
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,45,85,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,45,85,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs">
                {isPremium ? <span className="text-yellow-500/60">✨ Premium actif</span>
                  : isBlocked ? <span className="text-[#FF2D55]">🔒 Limite atteinte</span>
                  : <span className="text-white/20">{generationsLeft} gratuite restante</span>}
              </span>
              <button onClick={handleGenerate} disabled={!topic.trim() || loading}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-40"
                      style={{
                        background: !topic.trim() || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FF2D55, #c0392b)',
                        boxShadow: topic.trim() && !loading ? '0 0 30px rgba(255,45,85,0.4)' : 'none',
                      }}>
                {loading ? <><span className="loading-dots"><span>●</span><span>●</span><span>●</span></span> Génération…</>
                  : isBlocked ? <><IconLock /> Passe en Premium</>
                  : <><IconZap /> Générer <IconArrow /></>}
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-white/10 p-6 mb-6 text-center" style={{ background: 'rgba(255,45,85,0.04)' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
                <div className="text-sm text-white/60">{loadingSteps[loadingStep]}</div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-300">
              ⚠ {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <div ref={resultRef} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <h2 className="text-sm font-semibold text-white/70">
                    Contenu pour : <span className="text-white">"{result.topic}"</span>
                  </h2>
                </div>
                <button onClick={() => copy(allContent, 'all')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                        style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700', background: 'rgba(255,215,0,0.05)' }}>
                  {copied === 'all' ? <IconCheck /> : <IconCopy />}
                  {copied === 'all' ? 'Copié !' : 'Tout copier'}
                </button>
              </div>

              <ResultCard icon="🪝" label="Hook Viral" accent="pink" copyText={result.hook} copyId="hook" copied={copied} onCopy={copy}>
                <p className="text-lg font-medium leading-snug text-white">"{result.hook}"</p>
              </ResultCard>

              {/* Script + Voix off */}
              <ResultCard icon="📜" label="Script Complet" accent="cyan" copyText={result.script} copyId="script" copied={copied} onCopy={copy}>
                <div className="whitespace-pre-line text-sm leading-7 mb-4">{result.script}</div>

                {/* Bouton Voix off */}
                {!audioData ? (
                  <button onClick={handleGenerateVoice} disabled={voiceLoading}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                          style={{
                            background: hasVoice ? 'linear-gradient(135deg, #8B5CF6, #00F5FF)' : 'rgba(139,92,246,0.1)',
                            color: hasVoice ? '#fff' : '#8B5CF6',
                            border: hasVoice ? 'none' : '1px solid rgba(139,92,246,0.3)',
                          }}>
                    {voiceLoading ? (
                      <><span className="loading-dots"><span>●</span><span>●</span><span>●</span></span> Génération audio…</>
                    ) : hasVoice ? (
                      <><IconMic /> Générer la voix off</>
                    ) : (
                      <><IconLock /> Voix off — Pack à 12,99€/mois</>
                    )}
                  </button>
                ) : (
                  <AudioPlayer audioBase64={audioData} topic={result.topic} />
                )}
              </ResultCard>

              <ResultCard icon="📝" label="Description" accent="purple" copyText={result.description} copyId="desc" copied={copied} onCopy={copy}>
                <p className="text-sm leading-relaxed">{result.description}</p>
              </ResultCard>

              <ResultCard icon="#️⃣" label="Hashtags" accent="gold" copyText={result.hashtags} copyId="tags" copied={copied} onCopy={copy}>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.split(' ').filter(Boolean).map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md font-mono"
                          style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.15)' }}>
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </ResultCard>

              {/* Structure vidéo (coming soon) */}
              <div className="rounded-2xl border border-white/10 p-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{ background: 'rgba(255,45,85,0.1)', color: '#FF2D55' }}>
                      🎬
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Vidéo automatique</p>
                      <p className="text-xs text-white/40 mt-0.5">Génération vidéo complète avec sous-titres</p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{ background: 'rgba(255,45,85,0.1)', color: '#FF2D55', border: '1px solid rgba(255,45,85,0.2)' }}>
                    Bientôt
                  </span>
                </div>
              </div>

              {result.tips?.length > 0 && (
                <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/5">
                      <span>💡</span><span>Conseils de tournage</span>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                              style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-center pt-4">
                {isPremium ? (
                  <button onClick={handleGenerate} disabled={loading}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <IconZap /> Regénérer
                  </button>
                ) : (
                  <button onClick={() => setShowPremiumModal(true)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black"
                          style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)' }}>
                    <IconCrown /> Passer en Premium
                  </button>
                )}
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🪝', title: 'Hook Viral', desc: "Un accroche qui stoppe le scroll dès la première seconde." },
                { icon: '🎙️', title: 'Voix Off IA', desc: "Transforme ton script en voix naturelle et télécharge le MP3." },
                { icon: '🎬', title: 'Vidéo Auto', desc: "Génération vidéo complète avec sous-titres — bientôt disponible." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="rounded-2xl border border-white/8 p-5 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="text-sm font-semibold text-white mb-1.5">{title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          )}
        </main>

        <footer className="relative z-10 border-t border-white/5 py-6 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/20">© 2025 TikTok Cash Machine.</span>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <span>Stripe 🔒</span><span>Claude AI</span><span>OpenAI TTS</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}













