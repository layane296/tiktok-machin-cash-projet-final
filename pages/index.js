import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'

const FREE_LIMIT = 1

const IconTikTok = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/></svg>)
const IconZap = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>)
const IconCopy = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>)
const IconCheck = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="20 6 9 12 4 10"/></svg>)
const IconArrow = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>)
const IconCrown = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M2 20h20v2H2v-2zM4 18l4-8 4 4 4-6 4 10H4z"/></svg>)

function useCopy() {
  const [copied, setCopied] = useState(null)
  const copy = (text, id) => { navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000) }) }
  return { copied, copy }
}

function ResultCard({ icon, label, accent, children, copyText, copyId, copied, onCopy }) {
  const accentColors = { pink: 'text-[#FF2D55] border-[#FF2D55]/30 bg-[#FF2D55]/5', cyan: 'text-[#00F5FF] border-[#00F5FF]/30 bg-[#00F5FF]/5', purple: 'text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/5', gold: 'text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/5' }
  const borderGlow = { pink: 'hover:border-[#FF2D55]/60', cyan: 'hover:border-[#00F5FF]/60', purple: 'hover:border-[#8B5CF6]/60', gold: 'hover:border-[#FFD700]/60' }
  const isCopied = copied === copyId
  return (
    <div className={`relative border border-white/10 rounded-2xl p-6 transition-all duration-300 ${borderGlow[accent]}`} style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${accentColors[accent]}`}><span>{icon}</span><span>{label}</span></div>
        {copyText && (<button onClick={() => onCopy(copyText, copyId)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${isCopied ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-white/10 text-white/40 hover:text-white/80 hover:border-white/30 bg-white/5'}`}>{isCopied ? <IconCheck /> : <IconCopy />}{isCopied ? 'Copié !' : 'Copier'}</button>)}
      </div>
      <div className="text-white/85 text-sm leading-relaxed font-light">{children}</div>
    </div>
  )
}

function PaywallModal({ onSubscribe, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}>
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 p-8 text-center" style={{ background: '#0F0F0F' }}>
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.1) 0%, transparent 60%)' }} />
        <div className="text-5xl mb-5">🔒</div>
        <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>LIMITE ATTEINTE</h2>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">Tu as utilisé ta génération gratuite.<br />Passe en <span className="text-[#FFD700] font-semibold">Premium</span> pour des générations illimitées.</p>
        <div className="rounded-2xl border border-white/8 p-4 mb-6 text-left" style={{ background: 'rgba(255,215,0,0.04)' }}>
          {['🎬 Générations TikTok illimitées', '🪝 Hooks viraux sans limite', '#️⃣ Hashtags optimisés à volonté', '💡 Conseils de tournage exclusifs'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2"><span className="text-[#FFD700] text-xs">✓</span><span className="text-white/70 text-sm">{item}</span></div>
          ))}
        </div>
        <div className="mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>9,99€</span>
            <span className="text-white/40 text-sm">/mois</span>
          </div>
          <p className="text-white/30 text-xs mt-1">Annule à tout moment</p>
        </div>
        <button onClick={onSubscribe} disabled={loading} className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#000' }}>
          {loading ? <span className="loading-dots"><span>●</span><span>●</span><span>●</span></span> : <><IconCrown />Passer en Premium — 9,99€/mois<IconArrow /></>}
        </button>
        <p className="text-white/20 text-xs mt-4">Paiement sécurisé par Stripe 🔒</p>
      </div>
    </div>
  )
}

export default function Home() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [generationsUsed, setGenerationsUsed] = useState(0)
  const [isPremium, setIsPremium] = useState(false)
  const { copied, copy } = useCopy()
  const resultRef = useRef(null)
  const loadingSteps = ['Analyse du sujet en cours…', 'Création du hook viral…', 'Écriture du script…', 'Optimisation des hashtags…', 'Finalisation du contenu…']

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPremium(localStorage.getItem('tcm_premium') === 'true')
      setGenerationsUsed(parseInt(localStorage.getItem('tcm_generations') || '0', 10))
    }
  }, [])

  useEffect(() => {
    let interval
    if (loading) { interval = setInterval(() => setLoadingStep(s => (s + 1) % loadingSteps.length), 900) } else { setLoadingStep(0) }
    return () => clearInterval(interval)
  }, [loading])

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return
    if (!isPremium && generationsUsed >= FREE_LIMIT) { setShowPaywall(true); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Une erreur est survenue.') } else {
        setResult(data)
        const newCount = generationsUsed + 1
        setGenerationsUsed(newCount)
        if (typeof window !== 'undefined') localStorage.setItem('tcm_generations', newCount.toString())
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    } catch { setError('Impossible de contacter le serveur.') } finally { setLoading(false) }
  }

  const handleSubscribe = async () => {
    setStripeLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) { window.location.href = data.url } else { alert('Erreur : ' + (data.error || 'Impossible de créer la session.')) }
    } catch { alert('Erreur de connexion à Stripe.') } finally { setStripeLoading(false) }
  }

  const allContent = result ? `🪝 HOOK\n${result.hook}\n\n📜 SCRIPT\n${result.script}\n\n📝 DESCRIPTION\n${result.description}\n\n#️⃣ HASHTAGS\n${result.hashtags}` : ''
  const remainingFree = Math.max(0, FREE_LIMIT - generationsUsed)

  return (
    <>
      <Head>
        <title>TikTok Cash Machine — Génère du contenu viral en secondes</title>
        <meta name="description" content="Scripts TikTok viraux générés par IA." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {showPaywall && <PaywallModal onSubscribe={handleSubscribe} loading={stripeLoading} />}
      <div className="min-h-screen grid-bg relative" style={{ fontFamily: 'var(--font-body)' }}>
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #FF2D55, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #00F5FF, transparent 70%)' }} />
        </div>
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}><IconTikTok /></div>
            <span className="font-semibold text-white text-sm tracking-tight">TikTok Cash Machine</span>
          </div>
          <div>
            {isPremium ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}><IconCrown />Premium ✨</div>
            ) : (
              <button onClick={() => setShowPaywall(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
                {remainingFree > 0 ? `${remainingFree} essai gratuit` : '🔒 Passer Premium'}
              </button>
            )}
          </div>
        </nav>
        <main className="relative z-10 max-w-3xl mx-auto px-6 pt-12 pb-20">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium" style={{ borderColor: 'rgba(255,45,85,0.4)', background: 'rgba(255,45,85,0.08)', color: '#FF2D55' }}><IconZap />Script TikTok viral en 10 secondes</div>
          </div>
          <h1 className="text-center mb-4 leading-none" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(56px, 10vw, 96px)', color: '#fff', letterSpacing: '0.02em' }}>
            <span className="glitch-text" data-text="TIKTOK">TIKTOK</span>{' '}
            <span style={{ backgroundImage: 'linear-gradient(90deg, #FF2D55, #00F5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CASH</span>
            <br /><span className="glitch-text" data-text="MACHINE">MACHINE</span>
          </h1>
          <p className="text-center text-white/50 text-base mb-12 max-w-lg mx-auto leading-relaxed">Donne-nous un sujet. On te sort un script viral, un hook qui arrête le scroll, et des hashtags qui cartonnent.</p>
          <div className="flex justify-center gap-8 mb-12">
            {[{ label: 'Scripts générés', value: '47K+' }, { label: 'Vues cumulées', value: '2.1M' }, { label: 'Creators actifs', value: '8.3K' }].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>{value}</div>
                <div className="text-xs text-white/30 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
            {!isPremium && remainingFree === 0 && (
              <div className="rounded-xl p-4 mb-4 flex items-center justify-between gap-4" style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <div><div className="text-sm font-semibold text-[#FFD700]">Limite gratuite atteinte</div><div className="text-xs text-white/40">Passe en Premium pour continuer</div></div>
                </div>
                <button onClick={() => setShowPaywall(true)} className="flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold" style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#000' }}>9,99€/mois</button>
              </div>
            )}
            <label className="block text-sm font-medium text-white/60 mb-3 tracking-wide">Quel est ton sujet ?</label>
            <textarea value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate() }}
              placeholder="Ex: Comment gagner 1000€/mois en dropshipping, Les 3 habitudes des millionnaires..." rows={3}
              className="w-full rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)', lineHeight: '1.6' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(255,45,85,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,45,85,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }} />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-white/20">{isPremium ? '✨ Premium — illimité' : `${remainingFree} génération gratuite restante`}</span>
              <button onClick={handleGenerate} disabled={!topic.trim() || loading}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: !topic.trim() || loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #FF2D55 0%, #c0392b 100%)', boxShadow: topic.trim() && !loading ? '0 0 30px rgba(255,45,85,0.4)' : 'none' }}>
                {loading ? (<><span className="loading-dots text-base"><span>●</span><span>●</span><span>●</span></span><span>Génération…</span></>) : (<><IconZap /><span>Générer</span><IconArrow /></>)}
              </button>
            </div>
          </div>
          {loading && (
            <div className="rounded-2xl border border-white/10 p-6 mb-6 text-center" style={{ background: 'rgba(255,45,85,0.04)' }}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
                <div className="text-sm text-white/60">{loadingSteps[loadingStep]}</div>
                <div className="flex gap-1">{loadingSteps.map((_, i) => (<div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300" style={{ background: i <= loadingStep ? '#FF2D55' : 'rgba(255,255,255,0.15)' }} />))}</div>
              </div>
            </div>
          )}
          {error && (<div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-300 flex items-start gap-3"><span className="text-red-400 mt-0.5">⚠</span><span>{error}</span></div>)}
          {result && (
            <div ref={resultRef} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /><h2 className="text-sm font-semibold text-white/70 tracking-wider uppercase">Contenu pour : <span className="text-white">"{result.topic}"</span></h2></div>
                <button onClick={() => copy(allContent, 'all')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200" style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700', background: 'rgba(255,215,0,0.05)' }}>
                  {copied === 'all' ? <IconCheck /> : <IconCopy />}{copied === 'all' ? 'Copié !' : 'Tout copier'}
                </button>
              </div>
              <ResultCard icon="🪝" label="Hook Viral" accent="pink" copyText={result.hook} copyId="hook" copied={copied} onCopy={copy}><p className="text-lg font-medium leading-snug" style={{ color: '#fff' }}>"{result.hook}"</p></ResultCard>
              <ResultCard icon="📜" label="Script Complet" accent="cyan" copyText={result.script} copyId="script" copied={copied} onCopy={copy}><div className="whitespace-pre-line text-sm leading-7">{result.script}</div></ResultCard>
              <ResultCard icon="📝" label="Description" accent="purple" copyText={result.description} copyId="desc" copied={copied} onCopy={copy}><p className="text-sm leading-relaxed">{result.description}</p></ResultCard>
              <ResultCard icon="#️⃣" label="Hashtags" accent="gold" copyText={result.hashtags} copyId="tags" copied={copied} onCopy={copy}>
                <div className="flex flex-wrap gap-2">{result.hashtags.split(' ').filter(Boolean).map((tag, i) => (<span key={i} className="text-xs px-2 py-1 rounded-md font-mono" style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.15)' }}>{tag.startsWith('#') ? tag : `#${tag}`}</span>))}</div>
              </ResultCard>
              {result.tips?.length > 0 && (
                <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-2 mb-4"><div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#8B5CF6]/5"><span>💡</span><span>Conseils de tournage</span></div></div>
                  <ul className="space-y-3">{result.tips.map((tip, i) => (<li key={i} className="flex items-start gap-3 text-sm text-white/70"><span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>{i + 1}</span>{tip}</li>))}</ul>
                </div>
              )}
              <div className="flex justify-center pt-4">
                {!isPremium && remainingFree === 0 ? (
                  <button onClick={() => setShowPaywall(true)} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold" style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#000' }}><IconCrown />Passer en Premium pour continuer</button>
                ) : (
                  <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all" style={{ background: 'rgba(255,255,255,0.04)' }}><IconZap />Regénérer une version différente</button>
                )}
              </div>
            </div>
          )}
          {!result && !loading && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{ icon: '🪝', title: 'Hook Viral', desc: "Un accroche qui stoppe le scroll dès la première seconde." }, { icon: '📜', title: 'Script Complet', desc: "Script en 3 actes structuré pour maximiser la rétention." }, { icon: '#️⃣', title: 'Hashtags Optimisés', desc: "Mix viral + niche pour exploser l'algorithme TikTok." }].map(({ icon, title, desc }) => (
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
            <div className="flex items-center gap-3 text-xs text-white/20"><span>Paiements sécurisés par Stripe 🔒</span><span>·</span><span>Propulsé par Claude AI</span></div>
          </div>
        </footer>
      </div>
    </>
  )
}
