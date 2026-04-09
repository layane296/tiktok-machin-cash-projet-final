// pages/api/generate-video.js
// Génère une vidéo TikTok HD - images stockées en base64 pour éviter l'expiration

export const config = {
  api: {
    responseLimit: '100mb',
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

    // 2. Générer images HD et les convertir en base64 immédiatement
    const imageSize = format === 'vertical' ? '1024x1792' : '1792x1024'
    const segmentsWithImages = []

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      let imageBase64 = null

      try {
        const prompt = `Ultra-photorealistic, 8K quality, professional photography. 
Topic: "${topic}". Scene: ${seg}. 
Shot on professional DSLR, perfect lighting, hyperrealistic, no text, no watermark, 
cinematic composition, vibrant colors, sharp focus.`

        const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt,
            n: 1,
            size: imageSize,
            quality: 'hd',
            style: 'natural',
            response_format: 'b64_json', // ← Base64 directement !
          }),
        })

        if (imgRes.ok) {
          const imgData = await imgRes.json()
          imageBase64 = imgData.data[0].b64_json
          console.log(`✅ Image ${i + 1}/${segments.length} générée`)
        } else {
          const err = await imgRes.json()
          console.error(`❌ Image ${i + 1} error:`, err)
        }
      } catch (e) {
        console.error(`❌ Image ${i + 1} exception:`, e)
      }

      segmentsWithImages.push({
        text: seg,
        imageBase64, // stocké en base64 — ne expire jamais !
        imageUrl: imageBase64 ? `data:image/png;base64,${imageBase64}` : null,
        duration: 4,
        index: i,
      })
    }

    // 3. Générer voix off HD
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
          model: 'tts-1-hd',
          input: cleanText,
          voice: 'nova',
          response_format: 'mp3',
          speed: 1.0,
        }),
      })

      if (ttsRes.ok) {
        const audioBuffer = await ttsRes.arrayBuffer()
        audioBase64 = Buffer.from(audioBuffer).toString('base64')
        const wordCount = cleanText.split(' ').length
        audioDuration = Math.ceil((wordCount / 150) * 60)
        console.log('✅ Voix off générée')
      }
    } catch (e) {
      console.error('❌ TTS error:', e)
    }

    // 4. Durées synchronisées
    const totalDuration = audioDuration || segments.length * 4
    const segDuration = Math.max(3, Math.floor(totalDuration / segments.length))
    segmentsWithImages.forEach(s => s.duration = segDuration)

    const videoStructure = {
      topic,
      format,
      quality: 'HD',
      totalDuration,
      segments: segmentsWithImages,
      audio: audioBase64,
      audioDuration,
      downloadable: true,
    }

    console.log(`✅ Vidéo complète: ${segmentsWithImages.length} segments, audio: ${!!audioBase64}`)
    return res.status(200).json(videoStructure)

  } catch (err) {
    console.error('Video generation error:', err)
    return res.status(500).json({ error: 'Erreur lors de la génération vidéo: ' + err.message })
  }
}
