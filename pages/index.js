import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'

// ─── Icônes SVG inline ─────────────────────────────────────────────
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

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const IconHash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
)

const IconLightbulb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
  </svg>
)

// ─── Hook pour copier ──────────────────────────────────────────────
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

// ─── Composant ResultCard ──────────────────────────────────────────
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
    <div className={`relative border border-white/10 rounded-2xl p-6 transition-all duration-300 ${borderGlow[accent]} group`}
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      {/* Label */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${accentColors[accent]}`}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>
        {copyText && (
          <button
            onClick={() => onCopy(copyText, copyId)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
              isCopied
                ? 'border-green-500/50 text-green-400 bg-green-500/10'
                : 'border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 bg-white/5'
            }`}
          >
            {isCopied ? <IconCheck /> : <IconCopy />}
            {isCopied ? 'Copié !' : 'Copier'}
          </button>
        )}
      </div>
      {/* Content */}
      <div className="text-white/85 text-sm leading-relaxed font-light">
        {children}
      </div>
    </div>
  )
}

// ─── Composant principal ───────────────────────────────────────────
export default function Home() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const { copied, copy } = useCopy()
  const resultRef = useRef(null)
  const textareaRef = useRef(null)

  const loadingSteps = [
    'Analyse du sujet en cours…',
    'Création du hook viral…',
    'Écriture du script…',
    'Optimisation des hashtags…',
    'Finalisation du contenu…',
  ]

  useEffect(() => {
    let interval
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingSteps.length)
      }, 900)
    } else {
      setLoadingStep(0)
    }
    return () => clearInterval(interval)
  }, [loading])

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
      } else {
        setResult(data)
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } catch {
      setError('Impossible de contacter le serveur. Vérifie ta connexion.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  const allContent = result
    ? `🪝 HOOK\n${result.hook}\n\n📜 SCRIPT\n${result.script}\n\n📝 DESCRIPTION\n${result.description}\n\n#️⃣ HASHTAGS\n${result.hashtags}`
    : ''

  return (
    <>
      <Head>
        <title>TikTok Cash Machine — Génère du contenu viral en secondes</title>
        <meta name="description" content="Crée des scripts TikTok viraux, hooks percutants et hashtags optimisés grâce à l'IA. Lance-toi en 10 secondes." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
      </Head>

      <div className="min-h-screen grid-bg relative" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #FF2D55, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #00F5FF, transparent 70%)' }} />
          <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
               style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
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
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/10 text-xs text-white/40">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Alimenté par Claude AI
            </div>
          </div>
        </nav>

        {/* Hero */}
        <main className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-20">

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium"
                 style={{ borderColor: 'rgba(255,45,85,0.4)', background: 'rgba(255,45,85,0.08)', color: '#FF2D55' }}>
              <IconZap />
              <span>Script TikTok viral en 10 secondes</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center mb-4 leading-none"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', letterSpacing: '0.02em' }}>
            <span className="glitch-text" data-text="TIKTOK">TIKTOK</span>{' '}
            <span style={{ backgroundImage: 'linear-gradient(90deg, #FF2D55, #00F5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CASH
            </span>
            <br />
            <span className="glitch-text" data-text="MACHINE">MACHINE</span>
          </h1>

          <p className="text-center text-white/50 text-base mb-12 max-w-lg mx-auto leading-relaxed">
            Donne-nous un sujet. On te sort un script viral, un hook qui arrête le scroll, et des hashtags qui cartonnent.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            {[
              { label: 'Scripts générés', value: '47K+' },
              { label: 'Vues cumulées', value: '2.1M' },
              { label: 'Creators actifs', value: '8.3K' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>{value}</div>
                <div className="text-xs text-white/30 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Generator Card */}
          <div className="rounded-2xl border border-white/10 p-6 mb-6"
               style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>

            <label className="block text-sm font-medium text-white/60 mb-3 tracking-wide">
              Quel est ton sujet ?
            </label>

            <textarea
              ref={textareaRef}
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Comment gagner 1000€/mois en dropshipping, Les 3 habitudes des millionnaires, Recette ramen en 10 minutes..."
              rows={3}
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.6',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,45,85,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,45,85,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-white/20">
                {topic.length > 0 ? `${topic.length} caractères` : 'Cmd+Enter pour générer'}
              </span>
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || loading}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: !topic.trim() || loading
                    ? 'rgba(255,255,255,0.1)'
                    : 'linear-gradient(135deg, #FF2D55 0%, #c0392b 100%)',
                  boxShadow: topic.trim() && !loading ? '0 0 30px rgba(255,45,85,0.4)' : 'none',
                }}
              >
                {loading ? (
                  <>
                    <span className="loading-dots text-base">
                      <span>●</span><span>●</span><span>●</span>
                    </span>
                    <span>Génération…</span>
                  </>
                ) : (
                  <>
                    <IconZap />
                    <span>Générer le contenu</span>
                    <IconArrow />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="rounded-2xl border border-white/10 p-6 mb-6 text-center"
                 style={{ background: 'rgba(255,45,85,0.04)' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
                <div className="text-sm text-white/60 min-h-[20px] transition-all">{loadingSteps[loadingStep]}</div>
                <div className="flex gap-1">
                  {loadingSteps.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                         style={{ background: i <= loadingStep ? '#FF2D55' : 'rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-300 flex items-start gap-3">
              <span className="text-red-400 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Results */}
          {result && (
            <div ref={resultRef} className="space-y-4">

              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <h2 className="text-sm font-semibold text-white/70 tracking-wider uppercase">
                    Contenu généré pour : <span className="text-white">"{result.topic}"</span>
                  </h2>
                </div>
                <button
                  onClick={() => copy(allContent, 'all')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                  style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700', background: 'rgba(255,215,0,0.05)' }}
                >
                  {copied === 'all' ? <IconCheck /> : <IconCopy />}
                  {copied === 'all' ? 'Copié !' : 'Tout copier'}
                </button>
              </div>

              {/* Hook */}
              <ResultCard icon="🪝" label="Hook Viral" accent="pink" copyText={result.hook} copyId="hook" copied={copied} onCopy={copy}>
                <p className="text-lg font-medium leading-snug" style={{ color: '#fff' }}>
                  "{result.hook}"
                </p>
              </ResultCard>

              {/* Script */}
              <ResultCard icon="📜" label="Script Complet" accent="cyan" copyText={result.script} copyId="script" copied={copied} onCopy={copy}>
                <div className="whitespace-pre-line text-sm leading-7">
                  {result.script}
                </div>
              </ResultCard>

              {/* Description */}
              <ResultCard icon="📝" label="Description" accent="purple" copyText={result.description} copyId="desc" copied={copied} onCopy={copy}>
                <p className="text-sm leading-relaxed">{result.description}</p>
              </ResultCard>

              {/* Hashtags */}
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

              {/* Tips */}
              {result.tips?.length > 0 && (
                <div className="rounded-2xl border border-white/10 p-6"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/5">
                      <span>💡</span>
                      <span>Conseils de tournage</span>
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

              {/* Regenerate */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <IconZap />
                  Regénérer une version différente
                </button>
              </div>
            </div>
          )}

          {/* Features */}
          {!result && !loading && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🪝', title: 'Hook Viral', desc: "Un accroche qui stoppe le scroll dès la première seconde.", color: '#FF2D55' },
                { icon: '📜', title: 'Script Complet', desc: "Script en 3 actes structuré pour maximiser la rétention.", color: '#00F5FF' },
                { icon: '#️⃣', title: 'Hashtags Optimisés', desc: "Mix viral + niche pour exploser l'algorithme TikTok.", color: '#FFD700' },
              ].map(({ icon, title, desc, color }) => (
                <div key={title} className="rounded-2xl border border-white/8 p-5 text-center"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="text-sm font-semibold text-white mb-1.5">{title}</div>
                  <div className="text-xs text-white/40 leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-6 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/20">© 2025 TikTok Cash Machine. Construit avec ❤️ et Claude AI.</span>
            <div className="flex items-center gap-1 text-xs text-white/20">
              <span>Alimenté par</span>
              <span className="text-white/40 font-medium ml-1">Claude Sonnet</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
