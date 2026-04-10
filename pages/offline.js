// pages/offline.js
import { useRouter } from 'next/router'

export default function Offline() {
  const router = useRouter()
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4"
         style={{ fontFamily: 'var(--font-body)' }}>
      <div className="text-center">
        <div className="text-6xl mb-6">📵</div>
        <h1 className="text-white text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
          HORS LIGNE
        </h1>
        <p className="text-white/50 text-sm mb-6">
          Reconnecte-toi à internet pour utiliser Nexvari
        </p>
        <button onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
          ⚡ Réessayer
        </button>
      </div>
    </div>
  )
}
