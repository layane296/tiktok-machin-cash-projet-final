// pages/sitemap.xml.js
const BASE_URL = 'https://nexvari.com'

function generateSitemap() {
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/pricing', priority: '0.9', changefreq: 'weekly' },
    { url: '/auth', priority: '0.7', changefreq: 'monthly' },
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`
}

export default function Sitemap() {}

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(generateSitemap())
  res.end()
  return { props: {} }
}
