// pages/api/ai/chat.js
// API chat IA - réservé aux abonnés Premium+

import { supabaseAdmin } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { message, history, userId } = req.body

  if (!message?.trim()) return res.status(400).json({ error: 'Message vide.' })

  // Vérifier Premium
  if (userId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_premium, has_voice, has_video')
      .eq('id', userId)
      .single()

    const hasPremium = profile?.is_premium || profile?.has_voice || profile?.has_video
    if (!hasPremium) return res.status(403).json({ error: 'Premium requis.' })
  } else {
    return res.status(403).json({ error: 'Connexion requise.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Clé API manquante.' })

  try {
    const messages = [
      ...(history || []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message },
    ]

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 8000,
        system: `Tu es Nexvari AI, un assistant IA expert en développement et créativité. Tu es capable de :

🖥️ CODE (tous les langages) :
- Python, JavaScript, TypeScript, React, Next.js, Node.js
- HTML, CSS, Tailwind, SQL, PHP, Java, C++, C#, Swift, Kotlin
- Scripts bash/shell, automatisation, APIs, bases de données
- Tu fournis toujours du code complet, fonctionnel et bien commenté
- Tu utilises des blocs de code markdown avec le bon langage (ex: \`\`\`python)
- Tu expliques le code après l'avoir fourni
- Si le code est long, tu le divises en sections claires

📝 RÉDACTION & CRÉATIVITÉ :
- Scripts TikTok, YouTube, podcasts
- Emails, landing pages, copywriting
- Articles, blogs, posts réseaux sociaux

🧠 ANALYSE & CONSEIL :
- Business, marketing, stratégie
- Données, Excel, analyses
- SEO, growth hacking

🌍 LANGUES : Tu réponds dans la langue de l'utilisateur (français par défaut).

RÈGLES :
- Code toujours complet et prêt à l'emploi
- Explications claires après chaque bloc de code
- Tu ne refuses jamais d'écrire du code légal
- Tu proposes des améliorations quand c'est pertinent`,
        messages,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(502).json({ error: err.error?.message || 'Erreur API.' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    return res.status(200).json({ response: text })
  } catch (err) {
    console.error('Chat error:', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}
