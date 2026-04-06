// pages/404.js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SEO from '../components/SEO'

export default function NotFound() {
  const router = useRouter()
  const [count, setCount] = useState(5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(interval)
          router.push('/')
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <SEO title="Page introuvable — TikTok Cash Machine" />
      <div className="min-h-screen grid-bg flex items-center justify-center px-4"
           style={{ fontFamily: 'var(--font-body)' }}>

        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
               style={{ background: 'radial-gradient(circle, #FF2D55, transparent 70%)' }} />
        </div>

        <div className="text-center relative z-10">
          <div className="text-8xl mb-6 animate-bounce">🎬</div>

          <h1 className="text-white mb-2"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(60px, 15vw, 120px)', letterSpacing: '0.05em' }}>
            404
          </h1>

          <p className="text-white/50 text-lg mb-2">Cette page n'existe pas</p>
          <p className="text-white/30 text-sm mb-8">
            Redirection automatique dans{' '}
            <span className="text-[#FF2D55] font-bold">{count}</span>
            {' '}seconde{count > 1 ? 's' : ''}...
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push('/')}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)', boxShadow: '0 0 30px rgba(255,45,85,0.3)' }}>
              ⚡ Retour à l'accueil
            </button>
            <button onClick={() => router.push('/pricing')}
                    className="px-6 py-3 rounded-xl font-bold text-sm text-white/60 border border-white/10 hover:text-white transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
              Voir les tarifs
            </button>
          </div>

          {/* Fun message */}
          <div className="mt-12 rounded-2xl border border-white/10 p-5 max-w-sm mx-auto"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-white/40 text-sm">
              💡 Pendant que tu es là — génère un script TikTok viral gratuitement sur{' '}
              <button onClick={() => router.push('/')} className="text-[#FF2D55] hover:underline">
                nexvari.com
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
