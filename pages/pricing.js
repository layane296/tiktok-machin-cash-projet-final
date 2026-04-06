// pages/pricing.js
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
    <polyline points="20 6 9 12 4 10"/>
  </svg>
)
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 opacity-30">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
  </svg>
)

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0',
    period: '',
    description: 'Pour découvrir l\'outil',
    color: 'rgba(255,255,255,0.1)',
    textColor: '#fff',
    badge: null,
    features: [
      { text: '1 génération de script', included: true },
      { text: 'Hook viral', included: true },
      { text: 'Script complet', included: true },
      { text: 'Hashtags optimisés', included: true },
      { text: 'Générations illimitées', included: false },
      { text: 'Voix off IA (MP3)', included: false },
      { text: 'Vidéo avec images IA', included: false },
      { text: 'Sauvegarde des scripts', included: false },
    ],
    cta: 'Commencer gratuitement',
    ctaStyle: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '9,99',
    period: '/mois',
    description: 'Pour les créateurs sérieux',
    color: '#FFD700',
    textColor: '#000',
    badge: null,
    features: [
      { text: 'Générations illimitées', included: true },
      { text: 'Hook viral', included: true },
      { text: 'Script complet', included: true },
      { text: 'Hashtags optimisés', included: true },
      { text: 'Sauvegarde des scripts', included: true },
      { text: 'Voix off IA (MP3)', included: false },
      { text: 'Vidéo avec images IA', included: false },
      { text: 'Export TikTok + YouTube', included: false },
    ],
    cta: 'Choisir Premium',
    ctaStyle: { background: 'linear-gradient(135deg, #FFD700, #FF8C00)', color: '#000' },
  },
  {
    id: 'voice',
    name: 'Pack Voix',
    price: '12,99',
    period: '/mois',
    description: 'Scripts + voix off professionnelle',
    color: '#8B5CF6',
    textColor: '#fff',
    badge: null,
    features: [
      { text: 'Générations illimitées', included: true },
      { text: 'Hook viral', included: true },
      { text: 'Script complet', included: true },
      { text: 'Hashtags optimisés', included: true },
      { text: 'Sauvegarde des scripts', included: true },
      { text: 'Voix off IA (MP3)', included: true },
      { text: 'Vidéo avec images IA', included: false },
      { text: 'Export TikTok + YouTube', included: false },
    ],
    cta: 'Choisir Pack Voix',
    ctaStyle: { background: 'linear-gradient(135deg, #8B5CF6, #00F5FF)', color: '#fff' },
  },
  {
    id: 'complete',
    name: 'Pack Complet',
    price: '29,99',
    period: '/mois',
    description: 'Tout inclus — la solution ultime',
    color: '#FF2D55',
    textColor: '#fff',
    badge: '🔥 MEILLEUR',
    features: [
      { text: 'Générations illimitées', included: true },
      { text: 'Hook viral', included: true },
      { text: 'Script complet', included: true },
      { text: 'Hashtags optimisés', included: true },
      { text: 'Sauvegarde des scripts', included: true },
      { text: 'Voix off IA (MP3)', included: true },
      { text: 'Vidéo avec images IA', included: true },
      { text: 'Export TikTok + YouTube', included: true },
    ],
    cta: 'Choisir Pack Complet',
    ctaStyle: { background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)', color: '#fff' },
  },
]

const FAQ = [
  { q: 'Est-ce que je peux annuler à tout moment ?', a: 'Oui, tu peux résilier ton abonnement à tout moment depuis ton tableau de bord Stripe. Aucune question posée.' },
  { q: 'Comment fonctionne la génération gratuite ?', a: 'Sans compte, tu peux générer 1 script complet gratuitement. Crée un compte pour sauvegarder tes scripts.' },
  { q: 'Quelle qualité pour la voix off ?', a: 'On utilise OpenAI TTS (la même technologie que ChatGPT vocal). La voix est naturelle et indiscernable d\'un humain.' },
  { q: 'Les vidéos sont-elles vraiment générées par IA ?', a: 'Oui ! On utilise DALL-E 3 pour les images et OpenAI TTS pour la voix. Le tout est assemblé automatiquement.' },
  { q: 'Puis-je utiliser le contenu commercialement ?', a: 'Absolument. Tout le contenu généré t\'appartient. Tu peux le poster, le monétiser et le revendre.' },
  { q: 'Y a-t-il une limite au nombre de vidéos ?', a: 'Avec les plans payants, tu as des générations illimitées. Génère autant de scripts et vidéos que tu veux.' },
]

export default function Pricing() {
  const router = useRouter()
  const [openFaq, setOpenFaq] = useState(null)

  const handleCTA = (planId) => {
    if (planId === 'free') {
      router.push('/')
    } else {
      router.push('/?pricing=true')
    }
  }

  return (
    <>
      <Head>
        <title>Tarifs — TikTok Cash Machine</title>
        <meta name="description" content="Découvrez nos plans : Gratuit, Premium 9,99€, Pack Voix 12,99€ et Pack Complet 29,99€. Générez des scripts TikTok viraux avec l'IA." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #FF2D55, transparent 70%)' }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              <IconTikTok />
            </div>
            <span className="font-semibold text-white text-sm">TikTok Cash Machine</span>
          </button>
          <button onClick={() => router.push('/')}
                  className="text-sm text-white/50 hover:text-white transition-colors">
            ← Retour au site
          </button>
        </nav>

        <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 pb-20">

          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold mb-6"
                 style={{ borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.08)', color: '#FF2D55' }}>
              💎 Plans & Tarifs
            </div>
            <h1 className="text-white mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 72px)', letterSpacing: '0.02em' }}>
              UN PLAN POUR
              <br />
              <span style={{ backgroundImage: 'linear-gradient(90deg, #FF2D55, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CHAQUE CRÉATEUR
              </span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Commence gratuitement. Upgrade quand tu es prêt. Résilie à tout moment.
            </p>
          </div>

          {/* Plans grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
            {PLANS.map((plan) => (
              <div key={plan.id}
                   className="relative rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col"
                   style={{
                     borderColor: plan.badge ? plan.color : 'rgba(255,255,255,0.08)',
                     background: plan.badge ? `${plan.color}08` : 'rgba(255,255,255,0.02)',
                     boxShadow: plan.badge ? `0 0 40px ${plan.color}20` : 'none',
                   }}>

                {/* Badge */}
                {plan.badge && (
                  <div className="text-center py-2 text-xs font-bold"
                       style={{ background: plan.color, color: plan.textColor }}>
                    {plan.badge}
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  {/* Plan name */}
                  <div className="mb-4">
                    <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                    <p className="text-white/40 text-xs">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white"
                            style={{ fontFamily: 'var(--font-display)' }}>
                        {plan.price}€
                      </span>
                      <span className="text-white/40 text-sm">{plan.period}</span>
                    </div>
                    {plan.period && (
                      <p className="text-white/20 text-xs mt-1">Résiliable à tout moment</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm">
                        <span style={{ color: feature.included ? plan.color || '#10B981' : 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
                          {feature.included ? <IconCheck /> : <IconX />}
                        </span>
                        <span style={{ color: feature.included ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)' }}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button onClick={() => handleCTA(plan.id)}
                          className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
                          style={plan.ctaStyle}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison banner */}
          <div className="rounded-2xl border border-white/10 p-8 mb-20 text-center"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-white text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              🤔 LEQUEL CHOISIR ?
            </h2>
            <p className="text-white/50 text-sm mb-8">Notre recommandation selon ton profil</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { emoji: '🌱', profile: 'Tu débutes sur TikTok', plan: 'Premium 9,99€', desc: 'Scripts illimités pour poster chaque jour et tester ta niche.', color: '#FFD700' },
                { emoji: '🎙️', profile: 'Tu veux du contenu faceless', plan: 'Pack Voix 12,99€', desc: 'Génère scripts + voix off. Colle dans CapCut et poste.', color: '#8B5CF6' },
                { emoji: '🚀', profile: 'Tu veux aller vite', plan: 'Pack Complet 29,99€', desc: 'Vidéo complète avec images IA en 2 minutes. Le tout automatisé.', color: '#FF2D55' },
              ].map(({ emoji, profile, plan, desc, color }) => (
                <div key={profile} className="rounded-xl p-4 border border-white/8"
                     style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-2xl mb-2">{emoji}</div>
                  <p className="text-white/50 text-xs mb-1">{profile}</p>
                  <p className="text-white font-bold text-sm mb-2" style={{ color }}>{plan}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white text-2xl font-bold text-center mb-8"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              FAQ
            </h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-xl border border-white/8 overflow-hidden"
                     style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left">
                    <span className="text-white text-sm font-medium">{item.q}</span>
                    <span className="text-white/40 text-lg flex-shrink-0 ml-4">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-4 pb-4">
                      <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-white/40 text-sm mb-4">Rejoins des milliers de créateurs qui cartonnent sur TikTok</p>
            <button onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)', boxShadow: '0 0 40px rgba(255,45,85,0.4)' }}>
              ⚡ Commencer gratuitement
            </button>
            <p className="text-white/20 text-xs mt-3">Sans carte bancaire • 1 génération gratuite</p>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 py-6 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/20">© 2025 TikTok Cash Machine.</span>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <button onClick={() => router.push('/')} className="hover:text-white/40">Accueil</button>
              <span>Stripe 🔒</span>
              <span>Claude AI</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
