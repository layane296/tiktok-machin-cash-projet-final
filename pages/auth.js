// pages/auth.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const router = useRouter()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) return
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Compte créé ! Vérifie ton email pour confirmer.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>{mode === 'login' ? 'Connexion' : 'Inscription'} — TikTok Cash Machine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen grid-bg flex items-center justify-center px-4" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #FF2D55, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
        </div>

        <div className="relative w-full max-w-md">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                   style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
                </svg>
              </div>
              <span className="font-bold text-white text-lg tracking-tight">TikTok Cash Machine</span>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 p-8"
               style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>

            {/* Tabs */}
            <div className="flex rounded-xl p-1 mb-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {['login', 'signup'].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          background: mode === m ? 'rgba(255,45,85,0.8)' : 'transparent',
                          color: mode === m ? '#fff' : 'rgba(255,255,255,0.4)',
                        }}>
                  {m === 'login' ? 'Connexion' : 'Inscription'}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,45,85,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,45,85,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'var(--font-body)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,45,85,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,45,85,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-4 text-sm text-red-300">
                ⚠ {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 mb-4 text-sm text-green-300">
                ✓ {success}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!email || !password || loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, #FF2D55, #c0392b)',
                boxShadow: '0 0 30px rgba(255,45,85,0.3)',
              }}
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>

            {/* Back */}
            <div className="mt-6 text-center">
              <button onClick={() => router.push('/')}
                      className="text-xs text-white/30 hover:text-white/60 transition-colors">
                ← Retour au site
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
