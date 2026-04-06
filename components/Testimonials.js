// components/Testimonials.js
import { useState, useEffect, useRef } from 'react'

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Alexandre M.',
    role: 'Créateur lifestyle',
    avatar: '👨‍💼',
    plan: 'Premium',
    planColor: '#FFD700',
    stars: 5,
    text: "J'avais jamais fait de TikTok de ma vie. J'ai entré 'les 3 règles des millionnaires' et en 20 secondes j'avais un script complet. 50K vues sur ma première vidéo. Incroyable.",
    metric: '50K vues',
    metricLabel: 'première vidéo',
  },
  {
    id: 2,
    name: 'Sarah K.',
    role: 'Coach fitness',
    avatar: '👩‍🦱',
    plan: 'Pack Voix',
    planColor: '#8B5CF6',
    stars: 5,
    text: "La voix off est bluffante. Mes abonnés pensent que c'est moi qui parle. Je poste 2 vidéos par jour maintenant sans jamais me filmer. Mon compte a explosé en 3 semaines.",
    metric: '+12K',
    metricLabel: 'abonnés en 3 semaines',
  },
  {
    id: 3,
    name: 'Thomas B.',
    role: 'Entrepreneur e-commerce',
    avatar: '👨‍💻',
    plan: 'Pack Complet',
    planColor: '#FF2D55',
    stars: 5,
    text: "Je gérais 4 comptes TikTok pour mes clients. Avec le Pack Complet je génère 3 vidéos par compte par jour. Ce qui me prenait 8h me prend maintenant 30 minutes.",
    metric: '8h → 30min',
    metricLabel: 'de travail par jour',
  },
  {
    id: 4,
    name: 'Léa D.',
    role: 'Créatrice finance',
    avatar: '👩‍💼',
    plan: 'Premium',
    planColor: '#FFD700',
    stars: 5,
    text: "Les hooks générés sont vraiment viraux. J'ai arrêté de me prendre la tête à chercher des idées. Je génère 5 scripts en 2 minutes et je choisis le meilleur. Simple et efficace.",
    metric: '5 scripts',
    metricLabel: 'en 2 minutes',
  },
  {
    id: 5,
    name: 'Marc R.',
    role: 'Agence social media',
    avatar: '👨‍🎨',
    plan: 'Pack Complet',
    planColor: '#FF2D55',
    stars: 5,
    text: "On gère 12 comptes clients. TikTok Cash Machine a divisé notre temps de production par 5. Le ROI est dingue. Nos clients voient leurs vues tripler et nous on scale facilement.",
    metric: '12 comptes',
    metricLabel: 'gérés facilement',
  },
  {
    id: 6,
    name: 'Julie F.',
    role: 'Créatrice cuisine',
    avatar: '👩‍🍳',
    plan: 'Pack Voix',
    planColor: '#8B5CF6',
    stars: 5,
    text: "Je cuisine, je génère le script et la voix off en parallèle. Je monte tout dans CapCut en 10 minutes. Mes vidéos sont plus pro qu'avant et je les fais 10x plus vite.",
    metric: '10x',
    metricLabel: 'plus rapide',
  },
  {
    id: 7,
    name: 'Rayan T.',
    role: 'Créateur motivation',
    avatar: '🧑‍🏫',
    plan: 'Premium',
    planColor: '#FFD700',
    stars: 5,
    text: "Les scripts sont vraiment adaptés à mon style. J'entre un sujet vague et l'IA comprend exactement le ton que je veux. J'ai augmenté ma fréquence de publication de 3x.",
    metric: '3x',
    metricLabel: 'plus de publications',
  },
  {
    id: 8,
    name: 'Emma P.',
    role: 'Créatrice voyage',
    avatar: '👩‍✈️',
    plan: 'Pack Complet',
    planColor: '#FF2D55',
    stars: 5,
    text: "Les images IA générées pour mes vidéos sont magnifiques. Je voyage et je poste du contenu de qualité sans avoir besoin d'un cadreur. 200K vues ce mois-ci, record personnel.",
    metric: '200K vues',
    metricLabel: 'ce mois-ci',
  },
  {
    id: 9,
    name: 'Nico V.',
    role: 'Créateur tech',
    avatar: '🧑‍💻',
    plan: 'Premium',
    planColor: '#FFD700',
    stars: 5,
    text: "J'utilise ça pour mon compte TikTok sur l'IA et la tech. Les hashtags sont vraiment optimisés. Depuis que j'utilise cet outil mes vidéos font en moyenne 3x plus de vues.",
    metric: '3x',
    metricLabel: 'de vues en moyenne',
  },
]

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: '#FFD700', fontSize: '12px' }}>★</span>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)

  const VISIBLE = 3
  const maxIndex = TESTIMONIALS.length - VISIBLE

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(i => i >= maxIndex ? 0 : i + 1)
      }, 3500)
    }
    return () => clearInterval(intervalRef.current)
  }, [isAutoPlaying, maxIndex])

  const prev = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(i => Math.max(0, i - 1))
  }

  const next = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(i => Math.min(maxIndex, i + 1))
  }

  const visible = TESTIMONIALS.slice(currentIndex, currentIndex + VISIBLE)

  return (
    <section className="py-16 px-4 relative">

      {/* Header */}
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border"
             style={{ borderColor: 'rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.08)', color: '#FFD700' }}>
          ⭐ Avis clients
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
          ILS CARTONNENT DÉJÀ
        </h2>
        <p className="text-white/50 text-base">
          Des créateurs comme toi qui ont multiplié leurs vues grâce à l'IA
        </p>

        {/* Global rating */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#FFD700', fontSize: '18px' }}>★</span>)}
          </div>
          <span className="text-white font-bold text-lg">4,9/5</span>
          <span className="text-white/40 text-sm">• 2 847 avis</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative max-w-4xl mx-auto">

        {/* Flèche gauche */}
        <button onClick={prev} disabled={currentIndex === 0}
                className="absolute -left-5 sm:-left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {visible.map((t) => (
            <div key={t.id}
                 className="rounded-2xl border border-white/8 p-5 flex flex-col gap-4 transition-all duration-300 hover:border-white/20"
                 style={{ background: 'rgba(255,255,255,0.02)' }}>

              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                       style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                      style={{ background: `${t.planColor}15`, color: t.planColor, border: `1px solid ${t.planColor}30` }}>
                  {t.plan}
                </span>
              </div>

              {/* Stars */}
              <StarRating count={t.stars} />

              {/* Text */}
              <p className="text-white/70 text-sm leading-relaxed flex-1">
                "{t.text}"
              </p>

              {/* Metric */}
              <div className="rounded-xl p-3 text-center"
                   style={{ background: `${t.planColor}10`, border: `1px solid ${t.planColor}20` }}>
                <p className="font-bold text-lg" style={{ color: t.planColor, fontFamily: 'var(--font-display)' }}>
                  {t.metric}
                </p>
                <p className="text-white/40 text-xs">{t.metricLabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Flèche droite */}
        <button onClick={next} disabled={currentIndex >= maxIndex}
                className="absolute -right-5 sm:-right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-20"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button key={i}
                  onClick={() => { setIsAutoPlaying(false); setCurrentIndex(i) }}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: currentIndex === i ? '20px' : '6px',
                    height: '6px',
                    background: currentIndex === i ? '#FFD700' : 'rgba(255,255,255,0.15)',
                  }} />
        ))}
      </div>
    </section>
  )
}
