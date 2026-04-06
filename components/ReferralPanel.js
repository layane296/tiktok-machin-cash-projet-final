// components/ReferralPanel.js
import { useState, useEffect } from 'react'

const PLANS = [
  { id: 'premium', name: 'Premium', price: '9,99€', discounted10: '8,99€', discounted20: '7,99€' },
  { id: 'voice',   name: 'Pack Voix', price: '12,99€', discounted10: '11,69€', discounted20: '10,39€' },
  { id: 'complete',name: 'Pack Complet', price: '29,99€', discounted10: '26,99€', discounted20: '23,99€' },
]

export default function ReferralPanel({ user, isPremium, profile }) {
  const [code, setCode] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Filleul
  const [referralInput, setReferralInput] = useState('')
  const [claimLoading, setClaimLoading] = useState(false)
  const [claimResult, setClaimResult] = useState(null)
  const [claimError, setClaimError] = useState('')
  const [selectedFilleulPlan, setSelectedFilleulPlan] = useState('premium')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Parrain
  const [selectedReferrerPlan, setSelectedReferrerPlan] = useState('premium')
  const [applyLoading, setApplyLoading] = useState(false)

  const BASE_URL = typeof window !== 'undefined' ? window.location.origin : ''
  const hasPendingDiscount = profile?.pending_discount
  const expiresAt = claimResult?.expiresAt ? new Date(claimResult.expiresAt) : null

  useEffect(() => {
    if (user && isPremium) fetchCode()
  }, [user, isPremium])

  const fetchCode = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/referral/get-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (data.code) { setCode(data.code); setStats(data.stats) }
    } catch {}
    finally { setLoading(false) }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${BASE_URL}/?ref=${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClaim = async () => {
    if (!referralInput.trim() || !user) return
    setClaimLoading(true)
    setClaimError('')
    try {
      const res = await fetch('/api/referral/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: referralInput.trim(), referredUserId: user.id }),
      })
      const data = await res.json()
      if (!res.ok) setClaimError(data.error || 'Code invalide.')
      else setClaimResult(data)
    } catch { setClaimError('Erreur de connexion.') }
    finally { setClaimLoading(false) }
  }

  const handleFilleulCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/referral/checkout-with-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan: selectedFilleulPlan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {}
    finally { setCheckoutLoading(false) }
  }

  const handleApplyDiscount = async () => {
    setApplyLoading(true)
    try {
      const res = await fetch('/api/referral/apply-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan: selectedReferrerPlan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {}
    finally { setApplyLoading(false) }
  }

  // ─── Parrain : réduction -20% disponible ──────────────────────
  if (isPremium && hasPendingDiscount) {
    return (
      <div className="rounded-2xl border p-6"
           style={{ borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.05)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">💰</span>
          <div>
            <h3 className="text-white font-bold text-sm">-20% disponible !</h3>
            <p className="text-white/40 text-xs">Ton filleul s'est abonné — choisis où appliquer ta réduction</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelectedReferrerPlan(p.id)}
                 className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
                 style={{
                   border: `1px solid ${selectedReferrerPlan === p.id ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.08)'}`,
                   background: selectedReferrerPlan === p.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                     style={{ borderColor: selectedReferrerPlan === p.id ? '#10B981' : 'rgba(255,255,255,0.2)' }}>
                  {selectedReferrerPlan === p.id && <div className="w-2 h-2 rounded-full bg-green-400" />}
                </div>
                <span className="text-white text-sm font-medium">{p.name}</span>
              </div>
              <div className="text-right">
                <span className="text-white/30 text-xs line-through">{p.price}</span>
                <span className="text-green-400 font-bold text-sm ml-2">{p.discounted20}</span>
                <span className="text-white/30 text-xs">/mois</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleApplyDiscount} disabled={applyLoading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
          {applyLoading ? 'Redirection...' : '💰 Appliquer mon -20% sur ' + PLANS.find(p => p.id === selectedReferrerPlan)?.name}
        </button>
      </div>
    )
  }

  // ─── Parrain : afficher code + stats ─────────────────────────
  if (isPremium) {
    return (
      <div className="rounded-2xl border border-white/10 p-6"
           style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🤝</span>
          <h3 className="text-white font-bold text-sm">Programme de parrainage</h3>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="w-6 h-6 rounded-full border-2 border-[#FF2D55] border-t-transparent animate-spin mx-auto" />
          </div>
        ) : code ? (
          <>
            <div className="space-y-2 mb-4">
              {[
                { emoji: '👤', text: 'Ton filleul reçoit +1 script gratuit' },
                { emoji: '⏰', text: 'S\'il s\'abonne en 24h → -10% sur le plan de son choix' },
                { emoji: '💰', text: 'Tu reçois -20% sur le plan de ton choix' },
                { emoji: '⚠️', text: 'Minimum : ton filleul doit prendre le Premium (9,99€)' },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-start gap-2 text-xs text-white/60">
                  <span className="flex-shrink-0">{emoji}</span><span>{text}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-4 mb-4 text-center"
                 style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
              <p className="text-white/40 text-xs mb-1">Ton code de parrainage</p>
              <p className="text-white font-bold text-2xl font-mono tracking-widest">{code}</p>
            </div>

            <button onClick={copyLink}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all mb-4"
                    style={{
                      background: copied ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #FF2D55, #c0392b)',
                      color: copied ? '#10B981' : '#fff',
                      border: copied ? '1px solid rgba(16,185,129,0.4)' : 'none',
                    }}>
              {copied ? '✅ Lien copié !' : '🔗 Copier mon lien de parrainage'}
            </button>

            {stats && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>{stats.total_referrals || 0}</p>
                  <p className="text-white/40 text-xs">Parrainages</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}>
                  <p className="text-yellow-400 font-bold text-xl" style={{ fontFamily: 'var(--font-display)' }}>{stats.total_discounts_earned || 0}</p>
                  <p className="text-white/40 text-xs">Réductions gagnées</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {[
                { name: 'WhatsApp', color: '#25D366', url: `https://wa.me/?text=J'utilise TikTok Cash Machine pour générer des scripts TikTok viraux ! Essaie avec mon code ${code} : ${BASE_URL}/?ref=${code}` },
                { name: 'Twitter/X', color: '#1DA1F2', url: `https://twitter.com/intent/tweet?text=Je génère mes scripts TikTok en 10 secondes avec l'IA 🤖&url=${BASE_URL}/?ref=${code}` },
              ].map(({ name, color, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                   className="flex-1 py-2 rounded-xl text-xs font-semibold text-center hover:opacity-80"
                   style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
                  {name}
                </a>
              ))}
            </div>
          </>
        ) : <p className="text-white/40 text-sm text-center">Erreur de chargement.</p>}
      </div>
    )
  }

  // ─── Filleul : entrer code + choisir plan avec -10% ──────────
  return (
    <div className="rounded-2xl border border-white/10 p-6"
         style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎁</span>
        <h3 className="text-white font-bold text-sm">Tu as un code de parrainage ?</h3>
      </div>

      {claimResult ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-green-400 font-semibold text-sm">+1 script gratuit ajouté !</p>
            {expiresAt && (
              <p className="text-white/50 text-xs mt-1">
                ⏰ Offre -10% expire le {expiresAt.toLocaleString('fr-FR')}
              </p>
            )}
          </div>

          <div>
            <p className="text-white/60 text-xs mb-3">
              Choisis ton plan et bénéficie de <strong className="text-white">-10%</strong> sur le premier mois :
            </p>
            <div className="space-y-2 mb-4">
              {PLANS.map(p => (
                <div key={p.id} onClick={() => setSelectedFilleulPlan(p.id)}
                     className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all"
                     style={{
                       border: `1px solid ${selectedFilleulPlan === p.id ? 'rgba(255,45,85,0.6)' : 'rgba(255,255,255,0.08)'}`,
                       background: selectedFilleulPlan === p.id ? 'rgba(255,45,85,0.08)' : 'rgba(255,255,255,0.02)',
                     }}>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                         style={{ borderColor: selectedFilleulPlan === p.id ? '#FF2D55' : 'rgba(255,255,255,0.2)' }}>
                      {selectedFilleulPlan === p.id && <div className="w-2 h-2 rounded-full bg-[#FF2D55]" />}
                    </div>
                    <span className="text-white text-sm font-medium">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white/30 text-xs line-through">{p.price}</span>
                    <span className="text-[#FF2D55] font-bold text-sm ml-2">{p.discounted10}</span>
                    <span className="text-white/30 text-xs">/mois</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleFilleulCheckout} disabled={checkoutLoading}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)', boxShadow: '0 0 20px rgba(255,45,85,0.3)' }}>
              {checkoutLoading ? 'Redirection...' : `⚡ S'abonner avec -10% — ${PLANS.find(p => p.id === selectedFilleulPlan)?.discounted10}/mois`}
            </button>
            <p className="text-white/20 text-xs text-center mt-2">Réduction sur le premier mois uniquement</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-white/40 text-xs mb-4 leading-relaxed">
            Entre le code d'un ami pour recevoir <strong className="text-white">+1 script gratuit</strong> et <strong className="text-white">-10%</strong> sur l'abonnement de ton choix si tu t'abonnes dans les 24h.
          </p>
          <div className="flex gap-2">
            <input
              value={referralInput}
              onChange={e => setReferralInput(e.target.value.toUpperCase())}
              placeholder="TCM-XXXXXX"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none font-mono tracking-wider"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,45,85,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button onClick={handleClaim} disabled={claimLoading || !referralInput.trim()}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
              {claimLoading ? '...' : '✓'}
            </button>
          </div>
          {claimError && <p className="text-red-400 text-xs mt-2">{claimError}</p>}
        </>
      )}
    </div>
  )
}
