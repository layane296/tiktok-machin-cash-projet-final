// pages/legal.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import SEO from '../components/SEO'

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.18 8.18 0 0 0 4.78 1.52V7a4.85 4.85 0 0 1-1.01-.31z"/>
  </svg>
)

const SECTIONS = {
  cgu: [
    {
      title: '1. Objet',
      content: 'Les présentes Conditions Générales d\'Utilisation (CGU) régissent l\'accès et l\'utilisation du service TikTok Cash Machine, accessible sur nexvari.com. En utilisant notre service, vous acceptez sans réserve les présentes CGU.'
    },
    {
      title: '2. Description du service',
      content: 'TikTok Cash Machine est un service SaaS permettant la génération automatique de scripts TikTok, voix off et vidéos grâce à l\'intelligence artificielle. Le service est fourni tel quel, sans garantie de résultats spécifiques en termes de vues ou de revenus.'
    },
    {
      title: '3. Accès au service',
      content: 'L\'accès au service nécessite la création d\'un compte utilisateur. Vous êtes responsable de la confidentialité de vos identifiants. Une génération gratuite est offerte sans inscription. Les fonctionnalités avancées nécessitent un abonnement payant.'
    },
    {
      title: '4. Abonnements et paiements',
      content: 'Les abonnements sont facturés mensuellement via Stripe. Le prélèvement est effectué à la date d\'anniversaire de l\'abonnement. Vous pouvez résilier à tout moment depuis votre espace client, sans frais. La résiliation prend effet à la fin de la période en cours.'
    },
    {
      title: '5. Propriété intellectuelle',
      content: 'Le contenu généré par notre IA vous appartient intégralement. Vous pouvez l\'utiliser librement à des fins commerciales ou personnelles. TikTok Cash Machine conserve ses droits sur la plateforme, son code et ses algorithmes.'
    },
    {
      title: '6. Utilisation acceptable',
      content: 'Vous vous engagez à ne pas utiliser le service pour générer du contenu illégal, diffamatoire, haineux ou portant atteinte aux droits de tiers. Tout abus entraînera la suspension immédiate du compte sans remboursement.'
    },
    {
      title: '7. Limitation de responsabilité',
      content: 'TikTok Cash Machine ne peut être tenu responsable des performances de vos vidéos TikTok, des changements d\'algorithme des plateformes, ni de toute perte de revenus liée à l\'utilisation du service.'
    },
    {
      title: '8. Modifications',
      content: 'Nous nous réservons le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email en cas de changement substantiel. La poursuite de l\'utilisation du service vaut acceptation des nouvelles CGU.'
    },
    {
      title: '9. Droit applicable',
      content: 'Les présentes CGU sont soumises au droit français. Tout litige sera soumis à la compétence des tribunaux français.'
    },
  ],
  privacy: [
    {
      title: '1. Responsable du traitement',
      content: 'TikTok Cash Machine (nexvari.com) est responsable du traitement de vos données personnelles conformément au RGPD.'
    },
    {
      title: '2. Données collectées',
      content: 'Nous collectons : votre adresse email (inscription), vos scripts générés (sauvegarde), votre adresse IP (sécurité), et vos données de paiement (traitées par Stripe, jamais stockées chez nous).'
    },
    {
      title: '3. Finalités du traitement',
      content: 'Vos données sont utilisées pour : fournir le service, envoyer des emails de la séquence marketing (avec votre consentement), améliorer notre service, et prévenir les fraudes.'
    },
    {
      title: '4. Base légale',
      content: 'Le traitement est basé sur : l\'exécution du contrat (service), le consentement (emails marketing), et l\'intérêt légitime (sécurité et amélioration du service).'
    },
    {
      title: '5. Conservation des données',
      content: 'Vos données sont conservées pendant la durée de votre abonnement plus 3 ans. Les données de facturation sont conservées 10 ans conformément aux obligations légales.'
    },
    {
      title: '6. Partage des données',
      content: 'Nous partageons vos données avec : Supabase (base de données, hébergée en Europe), Stripe (paiements), Resend (emails), Anthropic et OpenAI (génération de contenu, sans données personnelles identifiables).'
    },
    {
      title: '7. Vos droits',
      content: 'Conformément au RGPD, vous disposez des droits d\'accès, de rectification, d\'effacement, de portabilité et d\'opposition. Pour exercer ces droits, contactez-nous à privacy@nexvari.com.'
    },
    {
      title: '8. Cookies',
      content: 'Nous utilisons des cookies techniques nécessaires au fonctionnement du service (authentification, préférences). Aucun cookie publicitaire n\'est utilisé.'
    },
    {
      title: '9. Sécurité',
      content: 'Vos données sont protégées par chiffrement TLS, stockées sur des serveurs sécurisés en Europe, avec accès restreint aux seules personnes autorisées.'
    },
    {
      title: '10. Contact',
      content: 'Pour toute question relative à vos données personnelles : privacy@nexvari.com — Nous répondons sous 30 jours.'
    },
  ],
}

export default function Legal() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('cgu')

  return (
    <>
      <SEO
        title="CGU & Politique de confidentialité — TikTok Cash Machine"
        description="Conditions générales d'utilisation et politique de confidentialité de TikTok Cash Machine (nexvari.com)."
        url="https://nexvari.com/legal"
        keywords="cgu tiktok cash machine, politique confidentialite, rgpd"
      />

      <div className="min-h-screen grid-bg" style={{ fontFamily: 'var(--font-body)' }}>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
              <IconTikTok />
            </div>
            <span className="font-semibold text-white text-sm">TikTok Cash Machine</span>
          </button>
          <button onClick={() => router.push('/')} className="text-sm text-white/50 hover:text-white transition-colors">
            ← Retour
          </button>
        </nav>

        <main className="relative z-10 max-w-3xl mx-auto px-6 py-8 pb-20">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-white text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
              MENTIONS LÉGALES
            </h1>
            <p className="text-white/40 text-sm">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              { id: 'cgu', label: '📋 CGU' },
              { id: 'privacy', label: '🔒 Confidentialité' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        background: activeTab === tab.id ? 'rgba(255,45,85,0.8)' : 'transparent',
                        color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.4)',
                      }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-6">
            {SECTIONS[activeTab].map((section, i) => (
              <div key={i} className="rounded-2xl border border-white/8 p-6"
                   style={{ background: 'rgba(255,255,255,0.02)' }}>
                <h2 className="text-white font-bold text-base mb-3">{section.title}</h2>
                <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-white/10 p-6 mt-8 text-center"
               style={{ background: 'rgba(255,45,85,0.04)' }}>
            <p className="text-white/50 text-sm">
              Des questions ? Contactez-nous à{' '}
              <a href="mailto:contact@nexvari.com" className="text-[#FF2D55] hover:underline">
                contact@nexvari.com
              </a>
            </p>
          </div>
        </main>

        <footer className="relative z-10 border-t border-white/5 py-6 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-6 text-xs text-white/20">
            <button onClick={() => router.push('/')} className="hover:text-white/40">Accueil</button>
            <button onClick={() => router.push('/pricing')} className="hover:text-white/40">Tarifs</button>
            <span>© 2025 TikTok Cash Machine</span>
          </div>
        </footer>
      </div>
    </>
  )
}
