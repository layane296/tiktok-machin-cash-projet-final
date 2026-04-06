// pages/api/ai/generate-image.js
// Génération d'images via DALL-E 3 - réservé aux abonnés Premium+

import { supabaseAdmin } from '../../../lib/supabase-server'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, userId, size = '1024x1024' } = req.body

  if (!prompt?.trim()) return res.status(400).json({ error: 'Prompt vide.' })

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

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) return res.status(500).json({ error: 'Clé OpenAI manquante.' })

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: 'standard',
        response_format: 'url',
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(502).json({ error: err.error?.message || 'Erreur OpenAI.' })
    }

    const data = await response.json()
    const imageUrl = data.data?.[0]?.url

    return res.status(200).json({ imageUrl })
  } catch (err) {
    console.error('Image gen error:', err)
    return res.status(500).json({ error: 'Erreur serveur.' })
  }
}
