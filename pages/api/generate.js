// pages/api/generate.js
import { supabaseAdmin } from '../../lib/supabase-server'

const FREE_LIMIT = 1

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { topic, userId } = req.body

  if (!topic || topic.trim().length < 3) {
    return res.status(400).json({ error: 'Le sujet est trop court.' })
  }

  // Vérification utilisateur connecté
  if (userId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_premium, generations_used')
      .eq('id', userId)
      .single()

    if (profile && !profile.is_premium && profile.generations_used >= FREE_LIMIT) {
      return res.status(403).json({ error: 'LIMIT_REACHED' })
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API Anthropic manquante.' })
  }

  const systemPrompt = `Tu es un expert en création de contenu TikTok viral. Tu crées des scripts percutants, des hooks accrocheurs et des descriptions optimisées pour maximiser la portée organique. Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans commentaires. Format attendu:
{
  "hook": "string — une phrase d'accroche de 1-2 lignes ultra-percutante qui arrête le scroll",
  "script": "string — script complet TikTok de 150-250 mots, structuré en 3 actes: hook visuel, contenu de valeur, call-to-action. Utilise des tirets pour les lignes parlées.",
  "description": "string — description optimisée de 100-150 mots pour maximiser la découverte",
  "hashtags": "string — 15-20 hashtags séparés par des espaces, mix viral + niche",
  "tips": ["tip1", "tip2", "tip3"] — 3 conseils de tournage spécifiques pour ce contenu
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Crée un contenu TikTok viral complet sur le sujet suivant : "${topic.trim()}"` }],
      }),
    })

    if (!response.ok) {
      return res.status(502).json({ error: `Erreur API Anthropic: ${response.status}` })
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || ''
    const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return res.status(500).json({ error: 'Réponse invalide du modèle. Réessaie.' })
    }

    const result = {
      hook: parsed.hook || '',
      script: parsed.script || '',
      description: parsed.description || '',
      hashtags: parsed.hashtags || '',
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      topic: topic.trim(),
    }

    // Sauvegarder le script et incrémenter le compteur si connecté
    if (userId) {
      // Sauvegarder le script
      await supabaseAdmin.from('scripts').insert({
        user_id: userId,
        topic: result.topic,
        hook: result.hook,
        script: result.script,
        description: result.description,
        hashtags: result.hashtags,
        tips: result.tips,
      })

      // Incrémenter le compteur
      await supabaseAdmin.rpc('increment_generations', { user_id_param: userId })
    }

    return res.status(200).json(result)
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Erreur serveur inattendue.' })
  }
}
