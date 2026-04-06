// components/Onboarding.js
import { useState, useEffect } from 'react'

const STEPS = [
  {
    id: 1,
    emoji: '👋',
    title: 'Bienvenue sur TikTok Cash Machine !',
    description: 'Tu es à 3 étapes de ta première vidéo virale. On t\'explique tout en 1 minute.',
    cta: 'Commencer le tour',
    highlight: null,
  },
  {
    id: 2,
    emoji: '✍️',
    title: 'Entre ton sujet ici',
    description: 'Tape n\'importe quel sujet : "comment gagner de l\'argent", "recette healthy", "fait insolite"... L\'IA s\'occupe du reste.',
    cta: 'Compris !',
    highlight: 'textarea',
    example: 'Ex: "Les 3 habitudes des millionnaires"',
  },
  {
    id: 3,
    emoji: '⚡',
    title: 'Clique sur "Générer"',
    description: 'En 10 secondes tu obtiens un hook viral, un script complet et 20 hashtags optimisés pour l\'algorithme TikTok.',
    cta: 'Super !',
    highlight: 'button',
  },
  {
    id: 4,
    emoji: '🎙️',
    title: 'Génère ta voix off',
    description: 'Après la génération, clique sur "Générer la voix off" pour obtenir un MP3 prêt à coller dans CapCut ou Premiere.',
    cta: 'J\'ai compris',
    highlight: null,
    badge: 'Pack Voix',
  },
  {
    id: 5,
    emoji: '🚀',
    title: 'Tu es prêt à cartonner !',
    description: 'Génère ton premier script maintenant. C\'est gratuit et ça prend 10 secondes. Bonne chance ! 🔥',
    cta: 'Générer mon premier script !',
    highlight: null,
    isLast: true,
  },
]

export default function Onboarding({ onComplete, onSkip }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const [animating, setAnimating] = useState(false)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const nextStep = () => {
    if (isLast) {
      handleComplete()
      return
    }
    setAnimating(true)
    setTimeout(() => {
      setStep(s => s + 1)
      setAnimating(false)
    }, 200)
  }

  const handleComplete = () => {
    setVisible(false)
    localStorage.setItem('tcm_onboarding_done', 'true')
    onComplete?.()
  }

  const handleSkip = () => {
    setVisible(false)
    localStorage.setItem('tcm_onboarding_done', 'true')
    onSkip?.()
  }

  if (!visible) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100]"
           style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
           onClick={handleSkip} />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-sm rounded-2xl border border-white/10 overflow-hidden pointer-events-auto"
             style={{
               background: '#0F0F0F',
               transform: animating ? 'scale(0.95)' : 'scale(1)',
               opacity: animating ? 0 : 1,
               transition: 'all 0.2s ease',
             }}>

          {/* Progress bar */}
          <div className="h-1 w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full transition-all duration-500"
                 style={{
                   width: `${((step + 1) / STEPS.length) * 100}%`,
                   background: 'linear-gradient(90deg, #FF2D55, #8B5CF6)',
                 }} />
          </div>

          <div className="p-6">
            {/* Skip button */}
            {!isLast && (
              <button onClick={handleSkip}
                      className="absolute top-4 right-4 text-white/20 hover:text-white/50 text-xs transition-colors">
                Passer ✕
              </button>
            )}

            {/* Step indicator */}
            <div className="flex gap-1 mb-6">
              {STEPS.map((_, i) => (
                <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                     style={{ background: i <= step ? '#FF2D55' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>

            {/* Emoji */}
            <div className="text-center mb-4">
              <span className="text-5xl">{current.emoji}</span>
            </div>

            {/* Content */}
            <h2 className="text-white font-bold text-lg text-center mb-3 leading-tight">
              {current.title}
            </h2>
            <p className="text-white/50 text-sm text-center leading-relaxed mb-4">
              {current.description}
            </p>

            {/* Example */}
            {current.example && (
              <div className="rounded-xl p-3 mb-4 text-center"
                   style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
                <p className="text-white/60 text-xs italic">{current.example}</p>
              </div>
            )}

            {/* Badge */}
            {current.badge && (
              <div className="flex justify-center mb-4">
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                      style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
                  {current.badge}
                </span>
              </div>
            )}

            {/* CTA Button */}
            <button onClick={nextStep}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105"
                    style={{
                      background: isLast
                        ? 'linear-gradient(135deg, #FF2D55, #c0392b)'
                        : 'linear-gradient(135deg, #FF2D55, #8B5CF6)',
                      boxShadow: '0 0 30px rgba(255,45,85,0.3)',
                    }}>
              {current.cta} {!isLast && '→'}
            </button>

            {/* Step counter */}
            <p className="text-white/20 text-xs text-center mt-3">
              Étape {step + 1} sur {STEPS.length}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
