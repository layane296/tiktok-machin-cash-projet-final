// pages/admin.js
import { useState, useEffect } from 'react'
import Head from 'next/head'

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || 'admin-tiktok-2025'

function StatCard({ label, value, sub, color, emoji }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5"
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">{label}</span>
        <span className="text-lg">{emoji}</span>
      </div>
      <p className="text-3xl font-bold text-white mb-1"
         style={{ fontFamily: 'var(--font-display)', color: color || '#fff', letterSpacing: '0.05em' }}>
        {value}
      </p>
      {sub && <p className="text-white/30 text-xs">{sub}</p>}
    </div>
  )
}

function PlanBadge({ plan }) {
  const colors = {
    'Pack Complet': { bg: 'rgba(255,45,85,0.15)', color: '#FF2D55' },
    'Pack Voix': { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6' },
    'Premium': { bg: 'rgba(255,215,0,0.15)', color: '#FFD700' },
    'Gratuit': { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' },
  }
  const style = colors[plan] || colors['Gratuit']
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
          style={{ background: style.bg, color: style.color }}>
      {plan}
    </span>
  )
}

function MiniBar({ value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
      <div className="h-full rounded-full transition-all duration-500"
           style={{ width: `${pct}%`, background: color || '#FF2D55' }} />
    </div>
  )
}

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastRefresh, setLastRefresh] = useState(null)

  const login = () => {
    if (password === ADMIN_SECRET) {
      setAuthenticated(true)
      fetchStats(password)
    } else {
      setError('Mot de passe incorrect.')
    }
  }

  const fetchStats = async (secret) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-secret': secret || password },
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setStats(data)
      setLastRefresh(new Date())
    } catch { setError('Erreur de connexion.') }
    finally { setLoading(false) }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

  const formatCurrency = (n) => `${n?.toFixed(2)}€`

  // ── Login screen ──────────────────────────────────────────────
  if (!authenticated) {
    return (
      <>
        <Head><title>Admin — TikTok Cash Machine</title></Head>
        <div className="min-h-screen grid-bg flex items-center justify-center px-4"
             style={{ fontFamily: 'var(--font-body)' }}>
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">🔐</div>
              <h1 className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                ADMIN DASHBOARD
              </h1>
              <p className="text-white/40 text-sm mt-1">TikTok Cash Machine</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-6"
                 style={{ background: 'rgba(255,255,255,0.03)' }}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="Mot de passe admin"
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none mb-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button onClick={login}
                      className="w-full py-3 rounded-xl font-bold text-sm text-white"
                      style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
                Accéder au dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────
  return (
    <>
      <Head><title>Admin Dashboard — TikTok Cash Machine</title></Head>
      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Nav */}
        <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              ADMIN
            </span>
            <span className="text-white/20 text-sm">TikTok Cash Machine</span>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-white/20 text-xs">
                Mis à jour : {lastRefresh.toLocaleTimeString('fr-FR')}
              </span>
            )}
            <button onClick={() => fetchStats()} disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/60 hover:text-white transition-all disabled:opacity-40"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
              {loading ? '⟳ Chargement...' : '⟳ Actualiser'}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {loading && !stats && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin" />
            </div>
          )}

          {stats && (
            <>
              {/* ── Revenue KPIs ── */}
              <section>
                <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">💰 Revenus</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label="MRR" value={formatCurrency(stats.revenue.mrr)} sub="Revenus mensuels" color="#10B981" emoji="💰" />
                  <StatCard label="ARR" value={formatCurrency(stats.revenue.arr)} sub="Revenus annuels estimés" color="#10B981" emoji="📈" />
                  <StatCard label="Premium" value={formatCurrency(stats.revenue.premiumRevenue)} sub={`${stats.users.premium} abonnés × 9,99€`} color="#FFD700" emoji="⚡" />
                  <StatCard label="Voix + Complet" value={formatCurrency(stats.revenue.voiceRevenue + stats.revenue.videoRevenue)} sub={`${stats.users.voice + stats.users.video} abonnés`} color="#8B5CF6" emoji="🎙️" />
                </div>
              </section>

              {/* ── User KPIs ── */}
              <section>
                <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">👥 Utilisateurs</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <StatCard label="Total" value={stats.users.total} sub="inscrits" emoji="👤" />
                  <StatCard label="Gratuit" value={stats.users.free} sub="non abonnés" color="rgba(255,255,255,0.5)" emoji="🆓" />
                  <StatCard label="Premium" value={stats.users.premium} sub="9,99€/mois" color="#FFD700" emoji="👑" />
                  <StatCard label="Pack Voix" value={stats.users.voice} sub="12,99€/mois" color="#8B5CF6" emoji="🎙️" />
                  <StatCard label="Pack Complet" value={stats.users.video} sub="29,99€/mois" color="#FF2D55" emoji="🎬" />
                  <StatCard label="Cette semaine" value={`+${stats.users.newThisWeek}`} sub="nouveaux" color="#00F5FF" emoji="🆕" />
                </div>

                {/* Plan distribution */}
                <div className="rounded-2xl border border-white/10 p-5 mt-4"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-4">Répartition des plans</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Gratuit', value: stats.users.free, color: 'rgba(255,255,255,0.3)' },
                      { label: 'Premium', value: stats.users.premium, color: '#FFD700' },
                      { label: 'Pack Voix', value: stats.users.voice, color: '#8B5CF6' },
                      { label: 'Pack Complet', value: stats.users.video, color: '#FF2D55' },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span style={{ color }}>{label}</span>
                          <span className="text-white/40">{value} ({stats.users.total > 0 ? Math.round(value / stats.users.total * 100) : 0}%)</span>
                        </div>
                        <MiniBar value={value} max={stats.users.total} color={color} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── Scripts + Referrals + Email ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Scripts */}
                <div className="rounded-2xl border border-white/10 p-5"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-4">📜 Scripts générés</p>
                  <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{stats.scripts.total}</p>
                  <p className="text-white/30 text-xs mb-4">+{stats.scripts.thisWeek} cette semaine</p>
                  <div className="space-y-2">
                    {stats.scripts.recent?.map((s, i) => (
                      <div key={i} className="text-xs text-white/40 truncate">
                        <span className="text-white/20 mr-2">{i + 1}.</span>{s.topic}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referrals */}
                <div className="rounded-2xl border border-white/10 p-5"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-4">🤝 Parrainages</p>
                  <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{stats.referrals.total}</p>
                  <p className="text-white/30 text-xs mb-4">{stats.referrals.converted} convertis</p>
                  <div className="rounded-xl p-3 text-center"
                       style={{ background: stats.referrals.conversionRate > 30 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${stats.referrals.conversionRate > 30 ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                    <p className="font-bold text-xl" style={{ color: stats.referrals.conversionRate > 30 ? '#10B981' : 'white', fontFamily: 'var(--font-display)' }}>
                      {stats.referrals.conversionRate}%
                    </p>
                    <p className="text-white/30 text-xs">taux de conversion</p>
                  </div>
                </div>

                {/* Email */}
                <div className="rounded-2xl border border-white/10 p-5"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-4">📧 Email marketing</p>
                  <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{stats.email.total}</p>
                  <p className="text-white/30 text-xs mb-4">{stats.email.active} actifs dans la séquence</p>
                  <div className="rounded-xl p-3 text-center"
                       style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
                    <p className="text-[#FF2D55] font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>
                      {stats.email.total > 0 ? Math.round(stats.email.active / stats.email.total * 100) : 0}%
                    </p>
                    <p className="text-white/30 text-xs">en séquence active</p>
                  </div>
                </div>
              </div>

              {/* ── Recent users table ── */}
              <section>
                <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">🆕 Derniers utilisateurs</h2>
                <div className="rounded-2xl border border-white/10 overflow-hidden"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          {['Email', 'Plan', 'Scripts', 'Parrainé', 'Inscrit le'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-white/30 text-xs font-medium uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stats.users.recent?.map((user, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                            <td className="px-4 py-3 text-white/70 text-xs">{user.email}</td>
                            <td className="px-4 py-3"><PlanBadge plan={user.plan} /></td>
                            <td className="px-4 py-3 text-white/50 text-xs">{user.generations}</td>
                            <td className="px-4 py-3 text-xs">{user.referred ? <span className="text-green-400">✓ oui</span> : <span className="text-white/20">—</span>}</td>
                            <td className="px-4 py-3 text-white/30 text-xs">{formatDate(user.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* ── Daily signups chart ── */}
              {stats.charts?.dailySignups && Object.keys(stats.charts.dailySignups).length > 0 && (
                <section>
                  <h2 className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-4">📊 Inscriptions (30 derniers jours)</h2>
                  <div className="rounded-2xl border border-white/10 p-5"
                       style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex items-end gap-1 h-32">
                      {Object.entries(stats.charts.dailySignups)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([date, count]) => {
                          const maxCount = Math.max(...Object.values(stats.charts.dailySignups))
                          const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                          return (
                            <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {count} · {new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </div>
                              <div className="w-full rounded-sm transition-all duration-300 hover:opacity-80"
                                   style={{ height: `${Math.max(4, height)}%`, background: 'linear-gradient(to top, #FF2D55, #FF2D5580)' }} />
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}
