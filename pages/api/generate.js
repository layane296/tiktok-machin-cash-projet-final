// pages/api/generate.js
// API Route — appelé depuis le frontend, compatible Vercel Edge/Node

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { topic } = req.body

  if (!topic || topic.trim().length < 3) {
    return res.status(400).json({ error: 'Le sujet est trop court. Essaie avec au moins 3 caractères.' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API Anthropic manquante. Ajoute ANTHROPIC_API_KEY dans tes variables Vercel.' })
  }

  const systemPrompt = `Tu es un expert en création de contenu TikTok viral. Tu crées des scripts percutants, des hooks accrocheurs et des descriptions optimisées pour maximiser la portée organique. Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks, sans commentaires. Format attendu:
{
  "hook": "string — une phrase d'accroche de 1-2 lignes ultra-percutante qui arrête le scroll",
  "script": "string — script complet TikTok de 150-250 mots, structuré en 3 actes: hook visuel, contenu de valeur, call-to-action. Utilise des tirets pour les lignes parlées.",
  "description": "string — description optimisée de 100-150 mots pour maximiser la découverte",
  "hashtags": "string — 15-20 hashtags séparés par des espaces, mix viral + niche",
  "tips": ["tip1", "tip2", "tip3"] — 3 conseils de tournage spécifiques pour ce contenu
}`

  const userPrompt = `Crée un contenu TikTok viral complet sur le sujet suivant : "${topic.trim()}"`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Anthropic API error:', response.status, errorData)
      return res.status(502).json({ error: `Erreur API Anthropic: ${response.status}` })
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || ''

    // Nettoyer le JSON si Claude l'a entouré de backticks
    const cleaned = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.error('JSON parse error. Raw text:', rawText)
      return res.status(500).json({ error: 'Réponse invalide du modèle. Réessaie.' })
    }

    return res.status(200).json({
      hook: parsed.hook || '',
      script: parsed.script || '',
      description: parsed.description || '',
      hashtags: parsed.hashtags || '',
      tips: Array.isArray(parsed.tips) ? parsed.tips : [],
      topic: topic.trim(),
    })
  } catch (err) {
    console.error('Handler error:', err)
    return res.status(500).json({ error: 'Erreur serveur inattendue. Réessaie dans quelques secondes.' })
  }
}
