// pages/api/generate-video.js
// Génère une vidéo TikTok/YouTube avec images IA + voix off + sous-titres via Cloudinary

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
      .select('has_video, has_voice, is_premium')
      .eq('id', userId)
      .single()

    if (!profile?.has_video) {
      return res.status(403).json({ error: 'VIDEO_REQUIRED' })
    }
  } else {
    return res.status(403).json({ error: 'VIDEO_REQUIRED' })
  }

  const openaiKey = process.env.OPENAI_API_KEY
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const cloudApiKey = process.env.CLOUDINARY_API_KEY
  const cloudApiSecret = process.env.CLOUDINARY_API_SECRET

  if (!openaiKey || !cloudName || !cloudApiKey || !cloudApiSecret) {
    return res.status(500).json({ error: 'Variables d\'environnement manquantes.' })
  }

  try {
    // 1. Découper le script en segments
    const segments = script
      .split('\n')
      .filter(line => line.trim().length > 10)
      .slice(0, 6)
      .map(line => line.replace(/^[-–—]\s*/, '').trim())

    // 2. Générer les images IA pour chaque segment
    const imageUrls = []
    for (let i = 0; i < Math.min(segments.length, 4); i++) {
      try {
        const imgRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: `Cinematic TikTok style image for: "${topic}". Scene: ${segments[i]}. Vibrant colors, modern aesthetic, no text, photorealistic.`,
            n: 1,
            size: format === 'vertical' ? '1024x1792' : '1792x1024',
            quality: 'standard',
          }),
        })
        if (imgRes.ok) {
          const imgData = await imgRes.json()
          imageUrls.push(imgData.data[0].url)
        }
      } catch (e) {
        console.error('Image generation error:', e)
      }
    }

    // 3. Générer la voix off
    let audioBase64 = null
    try {
      const cleanText = (hook + '. ' + script)
        .replace(/^[-–—]\s*/gm, '')
        .trim()
        .slice(0, 3000)

      const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: cleanText,
          voice: 'nova',
          response_format: 'mp3',
          speed: 1.05,
        }),
      })

      if (ttsRes.ok) {
        const audioBuffer = await ttsRes.arrayBuffer()
        audioBase64 = Buffer.from(audioBuffer).toString('base64')
      }
    } catch (e) {
      console.error('TTS error:', e)
    }

    // 4. Upload images sur Cloudinary
    const cloudinaryImageIds = []
    for (const imageUrl of imageUrls) {
      try {
        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: imageUrl,
              api_key: cloudApiKey,
              timestamp: Math.floor(Date.now() / 1000),
              folder: 'tiktok-cash-machine',
              upload_preset: 'ml_default',
            }),
          }
        )
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          cloudinaryImageIds.push(uploadData.public_id)
        }
      } catch (e) {
        console.error('Cloudinary upload error:', e)
      }
    }

    // 5. Créer la structure vidéo (métadonnées pour le player frontend)
    const videoStructure = {
      topic,
      format,
      segments: segments.map((text, i) => ({
        text,
        imageUrl: imageUrls[i] || null,
        cloudinaryId: cloudinaryImageIds[i] || null,
        duration: Math.max(3, Math.ceil(text.length / 15)), // ~15 chars/sec
      })),
      audio: audioBase64,
      totalDuration: segments.reduce((acc, text) => acc + Math.max(3, Math.ceil(text.length / 15)), 0),
    }

    return res.status(200).json(videoStructure)
  } catch (err) {
    console.error('Video generation error:', err)
    return res.status(500).json({ error: 'Erreur lors de la génération vidéo.' })
  }
}
