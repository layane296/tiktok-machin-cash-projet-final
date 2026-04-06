// pages/blog/comment-creer-script-tiktok-viral.js
import { useRouter } from 'next/router'
import SEO from '../../components/SEO'

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
  </svg>
)

export default function Article1() {
  const router = useRouter()

  return (
    <>
      <SEO
        title="Comment créer un script TikTok viral en 2025 — Guide complet"
        description="Découvrez les 5 techniques des créateurs qui font des millions de vues. Hook, structure, call-to-action : le guide complet pour créer un script TikTok viral."
        url="https://nexvari.com/blog/comment-creer-script-tiktok-viral"
        keywords="script tiktok viral, créer script tiktok, hook tiktok, structure video tiktok"
        type="article"
      />

      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-3xl mx-auto">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              <IconTikTok />
            </div>
            <span className="font-semibold text-white text-sm">TikTok Cash Machine</span>
          </button>
          <button onClick={() => router.push('/blog')} className="text-sm text-white/50 hover:text-white">← Blog</button>
        </nav>

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-8 pb-20">

          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block"
                  style={{ background: 'rgba(255,45,85,0.15)', color: '#FF2D55' }}>
              🎬 Stratégie
            </span>
            <h1 className="text-white text-3xl font-bold leading-tight mb-4">
              Comment créer un script TikTok viral en 2025
            </h1>
            <div className="flex items-center gap-4 text-xs text-white/30">
              <span>🕐 5 min de lecture</span>
              <span>📅 1 avril 2025</span>
            </div>
          </div>

          {/* Article content */}
          <div className="prose prose-invert max-w-none space-y-6 text-white/70 text-sm leading-relaxed">

            <p className="text-white/80 text-base">
              Chaque jour, des millions de vidéos sont publiées sur TikTok. Mais seules quelques-unes deviennent virales. La différence ? Un script bien structuré.
            </p>

            <h2 className="text-white text-xl font-bold mt-8 mb-3">1. Le hook : les 3 premières secondes sont cruciales</h2>
            <p>L'algorithme TikTok mesure le taux de rétention dès les premières secondes. Si les spectateurs défilent rapidement, votre vidéo ne sera pas distribuée. Votre hook doit créer une curiosité immédiate.</p>

            <div className="rounded-xl border border-[#FF2D55]/20 p-4" style={{ background: 'rgba(255,45,85,0.05)' }}>
              <p className="text-[#FF2D55] font-semibold text-xs uppercase tracking-wider mb-2">✨ Formules de hooks qui fonctionnent</p>
              <ul className="space-y-1.5 text-xs text-white/60">
                <li>→ "Ce que personne ne te dit sur [sujet]..."</li>
                <li>→ "J'ai testé [X] pendant 30 jours et voici..."</li>
                <li>→ "POV : tu découvres que [révélation]..."</li>
                <li>→ "Stop ! Tu fais cette erreur sur [sujet]"</li>
              </ul>
            </div>

            <h2 className="text-white text-xl font-bold mt-8 mb-3">2. La structure en 3 actes</h2>
            <p>Les meilleures vidéos TikTok suivent toutes la même structure narrative :</p>
            <ul className="space-y-2">
              <li><strong className="text-white">Acte 1 (0-5s) :</strong> Le hook — tu accroches l'attention</li>
              <li><strong className="text-white">Acte 2 (5-45s) :</strong> La valeur — tu délivres le contenu promis</li>
              <li><strong className="text-white">Acte 3 (45-60s) :</strong> Le CTA — tu guides vers une action</li>
            </ul>

            <h2 className="text-white text-xl font-bold mt-8 mb-3">3. Les hashtags stratégiques</h2>
            <p>Contrairement aux idées reçues, utiliser uniquement des hashtags massifs (#fyp, #viral) n'est pas optimal. La meilleure stratégie combine :</p>
            <ul className="space-y-1.5">
              <li>• 3-5 hashtags de niche (10K-500K vues)</li>
              <li>• 3-5 hashtags moyens (500K-5M vues)</li>
              <li>• 2-3 hashtags larges (#tiktokfrance, #apprendresurtiktok)</li>
            </ul>

            <h2 className="text-white text-xl font-bold mt-8 mb-3">4. La longueur optimale</h2>
            <p>En 2025, les vidéos de 30 à 60 secondes obtiennent le meilleur taux de rétention. Les vidéos de moins de 15 secondes peuvent fonctionner pour les formats "choc", mais la valeur perçue est moindre.</p>

            <h2 className="text-white text-xl font-bold mt-8 mb-3">5. L'IA pour automatiser tout ça</h2>
            <p>Créer manuellement un script optimisé prend entre 30 minutes et 2 heures. Avec un outil IA comme TikTok Cash Machine, vous obtenez en 10 secondes :</p>
            <ul className="space-y-1.5">
              <li>✅ Un hook testé et optimisé</li>
              <li>✅ Un script en 3 actes structuré</li>
              <li>✅ 20 hashtags stratégiques</li>
              <li>✅ Une voix off IA professionnelle</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="rounded-2xl border border-[#FF2D55]/20 p-6 mt-10 text-center"
               style={{ background: 'rgba(255,45,85,0.05)' }}>
            <p className="text-white font-bold text-lg mb-2">Prêt à créer ton premier script viral ?</p>
            <p className="text-white/50 text-sm mb-4">Génère un script complet en 10 secondes, gratuitement.</p>
            <button onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)', boxShadow: '0 0 30px rgba(255,45,85,0.3)' }}>
              ⚡ Générer gratuitement
            </button>
          </div>

          {/* Related */}
          <div className="mt-10">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-4">Articles similaires</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { slug: 'meilleurs-hooks-tiktok', title: 'Les 20 meilleurs hooks TikTok', emoji: '🪝' },
                { slug: 'algorithme-tiktok-2025', title: 'Comprendre l\'algorithme TikTok 2025', emoji: '🤖' },
              ].map(a => (
                <button key={a.slug} onClick={() => router.push(`/blog/${a.slug}`)}
                        className="flex items-center gap-3 p-3 rounded-xl border border-white/8 hover:border-white/20 transition-all text-left"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-white/60 text-xs">{a.title}</span>
                </button>
              ))}
            </div>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-6 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-white/20">
            <span>© 2025 TikTok Cash Machine</span>
            <button onClick={() => router.push('/legal')} className="hover:text-white/40">CGU</button>
          </div>
        </footer>
      </div>
    </>
  )
}
