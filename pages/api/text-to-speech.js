// pages/api/text-to-speech.js
// Génère une voix off depuis le script via OpenAI TTS

export const config = {
  api: {
    responseLimit: '10mb',
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { text, userId } = req.body

  if (!text || text.trim().length < 10) {
    return res.status(400).json({ error: 'Texte trop court pour générer une voix.' })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return res.status(500).json({ error: 'Clé OpenAI manquante.' })
  }

  // Vérifier si l'utilisateur a le pack voix
  if (userId) {
    const { supabaseAdmin } = await import('../../lib/supabase-server')
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('has_voice, is_premium')
      .eq('id', userId)
      .single()

    if (!profile?.has_voice) {
      return res.status(403).json({ error: 'VOICE_REQUIRED' })
    }
  } else {
    return res.status(403).json({ error: 'VOICE_REQUIRED' })
  }

  // Nettoyer le texte pour la voix (supprimer les tirets de mise en forme)
  const cleanText = text
    .replace(/^[-–—]\s*/gm, '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s/g, '')
    .trim()
    .slice(0, 4000) // Limite OpenAI TTS

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: cleanText,
        voice: 'nova', // Voix féminine naturelle, parfaite pour TikTok
        response_format: 'mp3',
        speed: 1.05, // Légèrement plus rapide, style TikTok
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('OpenAI TTS error:', err)
      return res.status(502).json({ error: err.error?.message || 'Erreur OpenAI TTS' })
    }

    // Récupérer l'audio et le renvoyer
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')

    return res.status(200).json({
      audio: base64Audio,
      format: 'mp3',
    })
  } catch (err) {
    console.error('TTS error:', err)
    return res.status(500).json({ error: 'Erreur serveur lors de la génération audio.' })
  }
}
