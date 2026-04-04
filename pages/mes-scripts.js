// pages/mes-scripts.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '../lib/supabase'

export default function MesScripts() {
  const router = useRouter()
  const [scripts, setScripts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)

      const { data } = await supabase
        .from('scripts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setScripts(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const copyText = (text) => navigator.clipboard.writeText(text)

  return (
    <>
      <Head>
        <title>Mes Scripts — TikTok Cash Machine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
          <button onClick={() => router.push('/')}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            ← Retour
          </button>
          <h1 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
            MES SCRIPTS
          </h1>
          <span className="text-white/30 text-sm">{scripts.length} script{scripts.length > 1 ? 's' : ''}</span>
        </nav>

        <main className="max-w-4xl mx-auto px-6 pb-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
            </div>
          ) : scripts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🎬</div>
              <p className="text-white/40 text-sm">Aucun script généré pour l'instant.</p>
              <button onClick={() => router.push('/')}
                      className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                      style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
                Générer mon premier script
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {scripts.map((s) => (
                <div key={s.id} className="rounded-2xl border border-white/10 overflow-hidden"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>

                  {/* Header */}
                  <div className="flex items-center justify-between p-5 cursor-pointer"
                       onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">"{s.topic}"</p>
                      <p className="text-white/30 text-xs mt-1">{formatDate(s.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button onClick={e => { e.stopPropagation(); copyText(`${s.hook}\n\n${s.script}\n\n${s.description}\n\n${s.hashtags}`) }}
                              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white/70 transition-colors">
                        Copier
                      </button>
                      <span className="text-white/30 text-xs">{expanded === s.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded */}
                  {expanded === s.id && (
                    <div className="border-t border-white/10 p-5 space-y-4">
                      <div>
                        <p className="text-xs text-[#FF2D55] font-semibold uppercase tracking-wider mb-2">🪝 Hook</p>
                        <p className="text-white/80 text-sm leading-relaxed">"{s.hook}"</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#00F5FF] font-semibold uppercase tracking-wider mb-2">📜 Script</p>
                        <p className="text-white/70 text-sm leading-7 whitespace-pre-line">{s.script}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider mb-2">📝 Description</p>
                        <p className="text-white/70 text-sm leading-relaxed">{s.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#FFD700] font-semibold uppercase tracking-wider mb-2">#️⃣ Hashtags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.hashtags.split(' ').filter(Boolean).map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-md font-mono"
                                  style={{ background: 'rgba(255,215,0,0.08)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.15)' }}>
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
