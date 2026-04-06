// pages/dashboard.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

// ─── Icônes ───────────────────────────────────────────────────────
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconScript = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconCrown = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M2 20h20v2H2v-2zM4 18l4-8 4 4 4-6 4 10H4z"/>
  </svg>
)
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="20 6 9 12 4 10"/>
  </svg>
)
const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
  </svg>
)
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  </svg>
)

const PLAN_INFO = {
  free: { label: 'Gratuit', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.05)' },
  premium: { label: 'Premium', color: '#FFD700', bg: 'rgba(255,215,0,0.1)', icon: <IconCrown /> },
  voice: { label: 'Pack Voix', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', icon: '🎙️' },
  video: { label: 'Pack Complet', color: '#FF2D55', bg: 'rgba(255,45,85,0.1)', icon: '🎬' },
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [scripts, setScripts] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      setNewEmail(user.email)

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      const { data: sc } = await supabase.from('scripts').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setScripts(sc || [])

      // Charger les favoris depuis localStorage
      const favs = JSON.parse(localStorage.getItem('tcm_favorites') || '[]')
      setFavorites(favs)

      setLoading(false)
    }
    init()
  }, [])

  const getPlan = () => {
    if (profile?.has_video) return 'video'
    if (profile?.has_voice) return 'voice'
    if (profile?.is_premium) return 'premium'
    return 'free'
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      if (newEmail !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: newEmail })
        if (error) throw error
        setSaveMsg('Email mis à jour ! Vérifie ta boîte mail.')
      }
      if (newPassword.length >= 6) {
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) throw error
        setSaveMsg('Mot de passe mis à jour !')
        setNewPassword('')
      }
      setEditMode(false)
    } catch (err) {
      setSaveMsg('Erreur : ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleFavorite = (scriptId) => {
    const newFavs = favorites.includes(scriptId)
      ? favorites.filter(f => f !== scriptId)
      : [...favorites, scriptId]
    setFavorites(newFavs)
    localStorage.setItem('tcm_favorites', JSON.stringify(newFavs))
  }

  const copyScript = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const deleteScript = async (id) => {
    await supabase.from('scripts').delete().eq('id', id)
    setScripts(prev => prev.filter(s => s.id !== id))
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })

  const plan = getPlan()
  const planInfo = PLAN_INFO[plan]
  const favoriteScripts = scripts.filter(s => favorites.includes(s.id))
  const scriptsThisWeek = scripts.filter(s => new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length

  if (loading) return (
    <div className="min-h-screen grid-bg flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
    </div>
  )

  return (
    <>
      <SEO title="Mon tableau de bord — TikTok Cash Machine" url="https://nexvari.com/dashboard" />

      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto border-b border-white/5">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              <IconTikTok />
            </div>
            <span className="font-semibold text-white text-sm">TikTok Cash Machine</span>
          </button>
          <button onClick={() => router.push('/')} className="text-sm text-white/40 hover:text-white transition-colors">
            ← Retour
          </button>
        </nav>

        <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 pb-20">

          {/* Profile header */}
          <div className="rounded-2xl border border-white/10 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-white font-bold text-lg">{user?.email}</h1>
                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: planInfo.bg, color: planInfo.color }}>
                  {planInfo.icon && <span>{planInfo.icon}</span>}
                  {planInfo.label}
                </span>
              </div>
              <p className="text-white/40 text-sm">
                Membre depuis {formatDate(user?.created_at)} • {scripts.length} script{scripts.length > 1 ? 's' : ''} générés
              </p>
            </div>
            <button onClick={() => router.push('/pricing')}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#000' }}>
              <IconCrown /> Upgrader
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Scripts générés', value: scripts.length, color: '#FF2D55', emoji: '📜' },
              { label: 'Cette semaine', value: scriptsThisWeek, color: '#00F5FF', emoji: '📈' },
              { label: 'Favoris', value: favoriteScripts.length, color: '#FFD700', emoji: '⭐' },
              { label: 'Parrainages', value: profile?.referral_code ? '✓' : '—', color: '#10B981', emoji: '🤝' },
            ].map(({ label, value, color, emoji }) => (
              <div key={label} className="rounded-2xl border border-white/8 p-4 text-center"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color }}>{value}</p>
                <p className="text-white/30 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble' },
              { id: 'scripts', label: '📜 Mes scripts' },
              { id: 'favorites', label: '⭐ Favoris' },
              { id: 'profile', label: '👤 Profil' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        background: activeTab === tab.id ? 'rgba(255,45,85,0.7)' : 'transparent',
                        color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
                      }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Plan actuel */}
              <div className="rounded-2xl border border-white/10 p-5"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Mon abonnement</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold text-lg" style={{ color: planInfo.color }}>{planInfo.label}</p>
                    <p className="text-white/40 text-xs mt-1">
                      {plan === 'free' ? '1 génération gratuite' :
                       plan === 'premium' ? 'Scripts illimités' :
                       plan === 'voice' ? 'Scripts + Voix off illimités' :
                       'Tout illimité — Scripts + Voix + Vidéo'}
                    </p>
                  </div>
                  {plan === 'free' && (
                    <button onClick={() => router.push('/pricing')}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-black"
                            style={{ background: 'linear-gradient(135deg, #FFD700, #FF8C00)' }}>
                      Upgrader
                    </button>
                  )}
                </div>
                {plan !== 'free' && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { label: 'Scripts', active: true },
                      { label: 'Voix off', active: plan === 'voice' || plan === 'video' },
                      { label: 'Vidéo IA', active: plan === 'video' },
                    ].map(({ label, active }) => (
                      <div key={label} className="rounded-xl p-3 text-center text-xs"
                           style={{ background: active ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                        <span style={{ color: active ? '#10B981' : 'rgba(255,255,255,0.2)' }}>
                          {active ? '✓' : '✗'} {label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Derniers scripts */}
              <div className="rounded-2xl border border-white/10 p-5"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/40 text-xs uppercase tracking-wider">Derniers scripts</p>
                  <button onClick={() => setActiveTab('scripts')} className="text-xs text-[#FF2D55] hover:underline">
                    Voir tout →
                  </button>
                </div>
                {scripts.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-white/30 text-sm">Aucun script généré encore</p>
                    <button onClick={() => router.push('/')}
                            className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
                      Générer mon premier script
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {scripts.slice(0, 3).map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-white/6"
                           style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-medium truncate">"{s.topic}"</p>
                          <p className="text-white/30 text-xs mt-0.5">{formatDate(s.created_at)}</p>
                        </div>
                        <button onClick={() => toggleFavorite(s.id)} className="ml-3 flex-shrink-0"
                                style={{ color: favorites.includes(s.id) ? '#FFD700' : 'rgba(255,255,255,0.2)' }}>
                          <IconStar />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Code parrainage */}
              {profile?.referral_code && (
                <div className="rounded-2xl border border-white/10 p-5"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Mon code de parrainage</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 rounded-xl p-3 text-center font-mono text-white font-bold tracking-widest"
                         style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
                      {profile.referral_code}
                    </div>
                    <button onClick={() => copyScript(`https://nexvari.com/?ref=${profile.referral_code}`, 'ref')}
                            className="px-4 py-3 rounded-xl text-xs font-bold text-white transition-all"
                            style={{ background: copied === 'ref' ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #FF2D55, #c0392b)', color: copied === 'ref' ? '#10B981' : '#fff' }}>
                      {copied === 'ref' ? '✓ Copié' : 'Copier lien'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Scripts tab ── */}
          {activeTab === 'scripts' && (
            <div className="space-y-3">
              {scripts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-4xl mb-4">📜</div>
                  <p className="text-white/40 text-sm mb-4">Aucun script généré encore</p>
                  <button onClick={() => router.push('/')}
                          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
                    Générer mon premier script
                  </button>
                </div>
              ) : scripts.map(s => (
                <div key={s.id} className="rounded-2xl border border-white/8 overflow-hidden"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center justify-between p-4 cursor-pointer"
                       onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">"{s.topic}"</p>
                      <p className="text-white/30 text-xs mt-0.5">{formatDate(s.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button onClick={e => { e.stopPropagation(); toggleFavorite(s.id) }}
                              style={{ color: favorites.includes(s.id) ? '#FFD700' : 'rgba(255,255,255,0.2)' }}>
                        <IconStar />
                      </button>
                      <button onClick={e => { e.stopPropagation(); copyScript(`${s.hook}\n\n${s.script}\n\n${s.hashtags}`, s.id) }}
                              className="text-white/30 hover:text-white/60 transition-colors">
                        {copied === s.id ? <IconCheck /> : <IconCopy />}
                      </button>
                      <button onClick={e => { e.stopPropagation(); deleteScript(s.id) }}
                              className="text-white/20 hover:text-red-400 transition-colors">
                        <IconTrash />
                      </button>
                      <span className="text-white/30 text-xs">{expanded === s.id ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {expanded === s.id && (
                    <div className="border-t border-white/8 p-4 space-y-3">
                      <div>
                        <p className="text-xs text-[#FF2D55] font-bold uppercase tracking-wider mb-1">🪝 Hook</p>
                        <p className="text-white/80 text-sm">"{s.hook}"</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#00F5FF] font-bold uppercase tracking-wider mb-1">📜 Script</p>
                        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{s.script}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#FFD700] font-bold uppercase tracking-wider mb-1">#️⃣ Hashtags</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.hashtags?.split(' ').filter(Boolean).map((tag, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-md font-mono"
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

          {/* ── Favorites tab ── */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteScripts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-4xl mb-4">⭐</div>
                  <p className="text-white/40 text-sm">Aucun favori encore</p>
                  <p className="text-white/20 text-xs mt-1">Clique sur ⭐ sur un script pour l'ajouter</p>
                </div>
              ) : favoriteScripts.map(s => (
                <div key={s.id} className="rounded-2xl border border-[#FFD700]/20 overflow-hidden"
                     style={{ background: 'rgba(255,215,0,0.03)' }}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">"{s.topic}"</p>
                      <p className="text-white/30 text-xs mt-0.5">{formatDate(s.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button onClick={() => toggleFavorite(s.id)} style={{ color: '#FFD700' }}><IconStar /></button>
                      <button onClick={() => copyScript(`${s.hook}\n\n${s.script}\n\n${s.hashtags}`, s.id)}
                              className="text-white/30 hover:text-white/60">
                        {copied === s.id ? <IconCheck /> : <IconCopy />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Profile tab ── */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 p-6"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-base">Informations du compte</h2>
                  <button onClick={() => setEditMode(!editMode)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-white/10 text-white/60 hover:text-white transition-all"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <IconEdit /> {editMode ? 'Annuler' : 'Modifier'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Email</label>
                    {editMode ? (
                      <input value={newEmail} onChange={e => setNewEmail(e.target.value)}
                             className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,45,85,0.4)' }} />
                    ) : (
                      <p className="text-white text-sm">{user?.email}</p>
                    )}
                  </div>

                  {editMode && (
                    <div>
                      <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Nouveau mot de passe</label>
                      <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                             placeholder="Laisse vide pour ne pas changer"
                             className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none placeholder-white/20"
                             style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    </div>
                  )}

                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Plan actuel</label>
                    <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-semibold"
                          style={{ background: planInfo.bg, color: planInfo.color }}>
                      {planInfo.label}
                    </span>
                  </div>

                  <div>
                    <label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Membre depuis</label>
                    <p className="text-white text-sm">{formatDate(user?.created_at)}</p>
                  </div>
                </div>

                {editMode && (
                  <div className="mt-6">
                    {saveMsg && (
                      <p className={`text-xs mb-3 ${saveMsg.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
                        {saveMsg}
                      </p>
                    )}
                    <button onClick={handleSaveProfile} disabled={saving}
                            className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
                      {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                    </button>
                  </div>
                )}
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-500/20 p-5"
                   style={{ background: 'rgba(255,45,85,0.03)' }}>
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">⚠️ Zone dangereuse</p>
                <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all">
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
