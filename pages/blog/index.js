// pages/blog/index.js
import { useRouter } from 'next/router'
import SEO from '../../components/SEO'

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
  </svg>
)

const ARTICLES = [
  {
    slug: 'comment-creer-script-tiktok-viral',
    title: 'Comment créer un script TikTok viral en 2025',
    description: 'Découvrez les 5 techniques des créateurs qui font des millions de vues. Hook, structure, call-to-action : le guide complet.',
    category: 'Stratégie',
    readTime: '5 min',
    date: '2025-04-01',
    emoji: '🎬',
    color: '#FF2D55',
  },
  {
    slug: 'meilleurs-hooks-tiktok',
    title: 'Les 20 meilleurs hooks TikTok qui arrêtent le scroll',
    description: 'Copie ces formules éprouvées utilisées par les plus grands créateurs TikTok francophones.',
    category: 'Hooks',
    readTime: '4 min',
    date: '2025-03-28',
    emoji: '🪝',
    color: '#8B5CF6',
  },
  {
    slug: 'algorithme-tiktok-2025',
    title: 'Comprendre l\'algorithme TikTok en 2025',
    description: 'Tout ce que vous devez savoir sur le fonctionnement de l\'algorithme TikTok pour maximiser votre portée organique.',
    category: 'Algorithme',
    readTime: '7 min',
    date: '2025-03-25',
    emoji: '🤖',
    color: '#00F5FF',
  },
  {
    slug: 'hashtags-tiktok-viral',
    title: 'Hashtags TikTok : le guide ultime pour exploser en 2025',
    description: 'Comment choisir les bons hashtags TikTok pour toucher votre audience cible et booster votre visibilité.',
    category: 'Hashtags',
    readTime: '6 min',
    date: '2025-03-20',
    emoji: '#️⃣',
    color: '#FFD700',
  },
  {
    slug: 'contenu-faceless-tiktok',
    title: 'Créer du contenu TikTok sans se filmer (faceless)',
    description: 'Le guide complet pour créer des vidéos TikTok virales sans montrer son visage. Outils, techniques et exemples.',
    category: 'Faceless',
    readTime: '8 min',
    date: '2025-03-15',
    emoji: '🎭',
    color: '#10B981',
  },
  {
    slug: 'gagner-argent-tiktok',
    title: 'Comment gagner de l\'argent avec TikTok en 2025',
    description: 'TikTok Creator Fund, brand deals, affiliation, produits digitaux... Toutes les méthodes pour monétiser votre audience.',
    category: 'Monétisation',
    readTime: '10 min',
    date: '2025-03-10',
    emoji: '💰',
    color: '#FF8C00',
  },
]

export default function Blog() {
  const router = useRouter()

  return (
    <>
      <SEO
        title="Blog TikTok — Conseils, stratégies et astuces virales | TikTok Cash Machine"
        description="Découvrez nos guides sur TikTok : comment créer des scripts viraux, comprendre l'algorithme, choisir ses hashtags et gagner de l'argent sur TikTok."
        url="https://nexvari.com/blog"
        keywords="blog tiktok, script tiktok viral, algorithme tiktok, hashtags tiktok, créer contenu tiktok"
      />

      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              <IconTikTok />
            </div>
            <span className="font-semibold text-white text-sm">TikTok Cash Machine</span>
          </button>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <button onClick={() => router.push('/pricing')} className="hover:text-white transition-colors">Tarifs</button>
            <button onClick={() => router.push('/')}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)' }}>
              ⚡ Essayer
            </button>
          </div>
        </nav>

        <main className="relative z-10 max-w-5xl mx-auto px-6 py-8 pb-20">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold mb-4"
                 style={{ borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.08)', color: '#FF2D55' }}>
              📝 Blog
            </div>
            <h1 className="text-white mb-3"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: '0.02em' }}>
              CONSEILS TIKTOK VIRAL
            </h1>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              Stratégies, astuces et guides pour cartonner sur TikTok en 2025
            </p>
          </div>

          {/* Featured article */}
          <div onClick={() => router.push(`/blog/${ARTICLES[0].slug}`)}
               className="rounded-2xl border border-white/10 p-6 sm:p-8 mb-8 cursor-pointer transition-all duration-300 hover:border-[#FF2D55]/40 hover:scale-[1.01]"
               style={{ background: 'rgba(255,255,255,0.02)' }}>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                   style={{ background: `${ARTICLES[0].color}15` }}>
                {ARTICLES[0].emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: `${ARTICLES[0].color}20`, color: ARTICLES[0].color }}>
                    {ARTICLES[0].category}
                  </span>
                  <span className="text-white/20 text-xs">⭐ À la une</span>
                </div>
                <h2 className="text-white font-bold text-xl mb-2">{ARTICLES[0].title}</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-3">{ARTICLES[0].description}</p>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  <span>🕐 {ARTICLES[0].readTime} de lecture</span>
                  <span>📅 {new Date(ARTICLES[0].date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARTICLES.slice(1).map((article) => (
              <div key={article.slug}
                   onClick={() => router.push(`/blog/${article.slug}`)}
                   className="rounded-2xl border border-white/8 p-5 cursor-pointer transition-all duration-300 hover:border-white/20 hover:scale-105 flex flex-col"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>

                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                     style={{ background: `${article.color}15` }}>
                  {article.emoji}
                </div>

                <span className="text-xs font-semibold mb-2"
                      style={{ color: article.color }}>
                  {article.category}
                </span>

                <h3 className="text-white font-bold text-sm leading-tight mb-2 flex-1">
                  {article.title}
                </h3>

                <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">
                  {article.description}
                </p>

                <div className="flex items-center justify-between text-xs text-white/20">
                  <span>🕐 {article.readTime}</span>
                  <span>→ Lire</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-white/40 text-sm mb-4">Prêt à créer ton premier script viral ?</p>
            <button onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base text-white hover:scale-105 transition-all"
                    style={{ background: 'linear-gradient(135deg, #FF2D55, #c0392b)', boxShadow: '0 0 40px rgba(255,45,85,0.4)' }}>
              ⚡ Générer gratuitement
            </button>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-6 px-6">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-white/20">© 2025 TikTok Cash Machine</span>
            <div className="flex items-center gap-4 text-xs text-white/20">
              <button onClick={() => router.push('/')} className="hover:text-white/40">Accueil</button>
              <button onClick={() => router.push('/pricing')} className="hover:text-white/40">Tarifs</button>
              <button onClick={() => router.push('/legal')} className="hover:text-white/40">CGU</button>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
