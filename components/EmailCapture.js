// components/EmailCapture.js
import { useState } from 'react'

export default function EmailCapture({ userId }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Entre un email valide.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch {
      setError('Erreur de connexion.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border p-6 text-center"
           style={{ borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.05)' }}>
        <div className="text-3xl mb-3">🎉</div>
        <p className="text-white font-semibold text-sm">C'est parti !</p>
        <p className="text-white/50 text-xs mt-1">Vérifie ta boîte mail — tu vas recevoir des astuces virales 🔥</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border p-6"
         style={{ borderColor: 'rgba(255,45,85,0.2)', background: 'rgba(255,45,85,0.04)' }}>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📧</span>
        <p className="text-white font-semibold text-sm">
          Reçois 5 astuces TikTok virales gratuitement
        </p>
      </div>
      <p className="text-white/40 text-xs mb-4 leading-relaxed">
        Hooks, scripts, tendances — directement dans ta boîte mail. Zéro spam.
      </p>

      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="ton@email.com"
          className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(255,45,85,0.5)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}
        >
          {loading ? '...' : '⚡ Go'}
        </button>
      </div>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      <p className="text-white/20 text-xs mt-2">🔒 Zéro spam • Désinscription en 1 clic</p>
    </div>
  )
}
