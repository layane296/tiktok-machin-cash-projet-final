// components/SEO.js
import Head from 'next/head'

const DEFAULT = {
  title: 'TikTok Cash Machine — Génère des scripts viraux en 10 secondes avec l\'IA',
  description: 'Crée des scripts TikTok viraux, voix off IA et vidéos automatiques en 10 secondes. Hook percutant, hashtags optimisés, export MP3 et MP4. Essaie gratuitement.',
  url: 'https://tiktok-machin-cash-projet-final.vercel.app',
  image: 'https://tiktok-machin-cash-projet-final.vercel.app/og-image.png',
  keywords: 'script tiktok viral, générateur script tiktok, voix off ia tiktok, créer vidéo tiktok automatique, tiktok ia, contenu tiktok automatique, hook tiktok viral, hashtags tiktok, script tiktok gratuit',
}

export default function SEO({
  title,
  description,
  url,
  image,
  keywords,
  type = 'website',
}) {
  const seoTitle = title || DEFAULT.title
  const seoDesc = description || DEFAULT.description
  const seoUrl = url || DEFAULT.url
  const seoImage = image || DEFAULT.image
  const seoKeywords = keywords || DEFAULT.keywords

  return (
    <Head>
      {/* Basics */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="TikTok Cash Machine" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="TikTok Cash Machine" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={seoImage} />

      {/* Favicon */}
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'TikTok Cash Machine',
            description: seoDesc,
            url: DEFAULT.url,
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web',
            offers: [
              {
                '@type': 'Offer',
                name: 'Gratuit',
                price: '0',
                priceCurrency: 'EUR',
                description: '1 génération gratuite',
              },
              {
                '@type': 'Offer',
                name: 'Premium',
                price: '9.99',
                priceCurrency: 'EUR',
                description: 'Scripts illimités',
              },
              {
                '@type': 'Offer',
                name: 'Pack Voix',
                price: '12.99',
                priceCurrency: 'EUR',
                description: 'Scripts + voix off IA',
              },
              {
                '@type': 'Offer',
                name: 'Pack Complet',
                price: '29.99',
                priceCurrency: 'EUR',
                description: 'Scripts + voix + vidéo IA',
              },
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '2847',
            },
          }),
        }}
      />
    </Head>
  )
}
