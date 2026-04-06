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
        max_tokens: 4000,
        system: `Tu es Nexvari AI, un assistant IA intelligent, créatif et bienveillant. Tu aides les utilisateurs avec toutes leurs questions : rédaction, code, analyse, créativité, business, TikTok, marketing, etc. Tu réponds en français par défaut sauf si l'utilisateur écrit dans une autre langue. Tu es précis, utile et tu vas droit au but. Tu peux formater tes réponses avec du markdown quand c'est utile.`,
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
