// pages/api/ai/chat.js
// Chat IA avec streaming - réponses mot par mot comme ChatGPT

import { supabaseAdmin } from '../../../lib/supabase-server'

export const config = {
  api: {
    responseLimit: false,
  },
}

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

  const messages = [
    ...(history || []).slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ]

  try {
    // Streaming response
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Haiku = 3x plus rapide que Sonnet
        max_tokens: 4000,
        stream: true,
        system: `Tu es Nexvari AI, un assistant IA expert en développement et créativité. Tu es capable de :

🖥️ CODE (tous les langages) :
- Python, JavaScript, TypeScript, React, Next.js, Node.js
- HTML, CSS, Tailwind, SQL, PHP, Java, C++, C#, Swift, Kotlin
- Scripts bash/shell, automatisation, APIs, bases de données
- Tu fournis toujours du code complet, fonctionnel et bien commenté
- Tu utilises des blocs de code markdown avec le bon langage (ex: \`\`\`python)

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
      res.write(`data: ${JSON.stringify({ error: err.error?.message || 'Erreur API.' })}\n\n`)
      res.end()
      return
    }

    // Lire le stream et le transmettre au client
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            res.write(`data: ${JSON.stringify({ text: parsed.delta.text })}\n\n`)
          }
        } catch {}
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()

  } catch (err) {
    console.error('Chat error:', err)
    res.write(`data: ${JSON.stringify({ error: 'Erreur serveur.' })}\n\n`)
    res.end()
  }
}
