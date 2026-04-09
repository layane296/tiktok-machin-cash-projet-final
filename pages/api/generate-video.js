// pages/api/generate-video.js
// Génère une vidéo TikTok ultra-réaliste avec images HD + voix off + téléchargement MP4

export const config = {
  api: {
    responseLimit: '50mb',
    bodyParser: { sizeLimit: '10mb' },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { script, hook, topic, userId, format = 'vertical' } = req.body

  if (!script || !topic) return res.status(400).json({ error: 'Script et sujet requis.' })

  // Vérifier pack vidéo
  if (userId) {
    const { supabaseAdmin } = await import('../../lib/supabase-server')
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('has_video')
      .eq('id', userId)
      .single()

    if (!profile?.has_video) return res.status(403).json({ error: 'VIDEO_REQUIRED' })
  } else {
    return res.status(403).json({ error: 'VIDEO_REQUIRED' })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) return res.status(500).json({ error: 'Clé OpenAI manquante.' })

  try {
    // 1. Découper le script en segments (max 5)
    const rawSegments = script
      .split('\n')
      .filter(line => line.trim().length > 8)
      .slice(0, 5)
      .map(line => line.replace(/^[-–—•*]\s*/, '').trim())

    const segments = rawSegments.length > 0 ? rawSegments : [hook, script.slice(0, 200)]

    // 2. Générer images ultra-réalistes avec DALL-E 3
    const imageUrls = []
    const imageSize = format === 'vertical' ? '1024x1792' : '1792x1024'

    // Prompts ultra-réalistes pour chaque segment
    const realisticPrompts = segments.map((seg, i) => {
      const basePrompts = [
        `Ultra-photorealistic cinematic scene, 8K quality, professional photography, for TikTok video about "${topic}". ${seg}. Real people, real environment, perfect lighting, no text, no watermark, hyperrealistic.`,
        `Professional stock photo quality, ultra-realistic, cinematic lighting, 8K resolution. Topic: "${topic}". Visual: ${seg}. Shot on Sony A7R, f/1.8, golden hour lighting, sharp focus, photorealistic.`,
        `Hyperrealistic photograph, professional DSLR quality, studio lighting, ultra-detailed. About: "${topic}". Scene: ${seg}. Realistic skin texture, real environment, no AI artifacts, photorealistic render.`,
        `Cinematic 4K quality, real-world photography style, professional grade. Theme: "${topic}". Showing: ${seg}. Natural colors, realistic shadows, authentic environment, photorealistic.`,
        `Ultra-realistic documentary style photo, National Geographic quality. Subject: "${topic}". Depicting: ${seg}. True-to-life colors, professional composition, realistic details.`,
      ]
      return basePrompts[i % basePrompts.length]
    })

    for (let i = 0; i < segments.length; i++) {
      try {
        const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: realisticPrompts[i],
            n: 1,
            size: imageSize,
            quality: 'hd', // HD au lieu de standard
            style: 'natural', // natural pour plus de réalisme
          }),
        })
        if (imgRes.ok) {
          const imgData = await imgRes.json()
          imageUrls.push(imgData.data[0].url)
        }
      } catch (e) {
        console.error('Image error:', e)
      }
    }

    // 3. Générer la voix off HD
    let audioBase64 = null
    let audioDuration = 0
    try {
      const cleanText = (hook + '. ' + script)
        .replace(/^[-–—•*]\s*/gm, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 4000)

      const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd', // HD audio
          input: cleanText,
          voice: 'nova',
          response_format: 'mp3',
          speed: 1.0,
        }),
      })

      if (ttsRes.ok) {
        const audioBuffer = await ttsRes.arrayBuffer()
        audioBase64 = Buffer.from(audioBuffer).toString('base64')
        // Estimer la durée (~150 mots/min)
        const wordCount = cleanText.split(' ').length
        audioDuration = Math.ceil((wordCount / 150) * 60)
      }
    } catch (e) {
      console.error('TTS error:', e)
    }

    // 4. Construire la structure vidéo avec durées synchronisées
    const totalDuration = audioDuration || segments.length * 4
    const segmentDuration = Math.max(3, Math.floor(totalDuration / segments.length))

    const videoStructure = {
      topic,
      format,
      quality: 'HD',
      totalDuration,
      segments: segments.map((text, i) => ({
        text,
        imageUrl: imageUrls[i] || null,
        duration: segmentDuration,
        index: i,
      })),
      audio: audioBase64,
      audioDuration,
      downloadable: true,
    }

    return res.status(200).json(videoStructure)
  } catch (err) {
    console.error('Video generation error:', err)
    return res.status(500).json({ error: 'Erreur lors de la génération vidéo.' })
  }
}
