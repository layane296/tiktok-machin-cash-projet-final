// components/VideoPlayer.js
import { useState, useEffect, useRef } from 'react'

export default function VideoPlayer({ videoData, topic }) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)
  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const canvasRef = useRef(null)

  const { segments = [], audio, totalDuration = 30, format = 'vertical' } = videoData || {}

  useEffect(() => {
    if (audio && audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${audio}`
    }
    return () => clearInterval(intervalRef.current)
  }, [audio])

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      startProgress()
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      clearInterval(intervalRef.current)
    }
  }

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      setCurrentSegment(0)
      setProgress(0)
      play()
    }
  }

  const startProgress = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const current = audioRef.current.currentTime
        const duration = audioRef.current.duration || totalDuration
        const pct = (current / duration) * 100
        setProgress(pct)

        // Changer de segment selon la progression
        const segIndex = Math.min(
          Math.floor((current / duration) * segments.length),
          segments.length - 1
        )
        setCurrentSegment(segIndex)

        if (pct >= 99) {
          setIsPlaying(false)
          setProgress(100)
          clearInterval(intervalRef.current)
        }
      }
    }, 100)
  }

  // ── Téléchargement MP4 via Canvas ────────────────────────────
  const downloadVideo = async () => {
    setDownloading(true)
    try {
      // Créer un canvas pour l'export vidéo
      const canvas = canvasRef.current
      if (!canvas) return

      const width = format === 'vertical' ? 1080 : 1920
      const height = format === 'vertical' ? 1920 : 1080
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // MediaRecorder pour capturer le canvas
      const stream = canvas.captureStream(30)

      // Ajouter la piste audio si disponible
      let mediaRecorder
      if (audio && audioRef.current) {
        try {
          const audioContext = new AudioContext()
          const audioBuffer = Uint8Array.from(atob(audio), c => c.charCodeAt(0))
          const decodedAudio = await audioContext.decodeAudioData(audioBuffer.buffer)
          const source = audioContext.createBufferSource()
          source.buffer = decodedAudio
          const dest = audioContext.createMediaStreamDestination()
          source.connect(dest)
          source.start()
          const audioTrack = dest.stream.getAudioTracks()[0]
          if (audioTrack) stream.addTrack(audioTrack)
        } catch (e) {
          console.log('Audio track error:', e)
        }
      }

      const chunks = []
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 8000000,
      })

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nexvari-${topic?.replace(/\s+/g, '-').slice(0, 30)}-${Date.now()}.webm`
        a.click()
        URL.revokeObjectURL(url)
        setDownloading(false)
        setDownloadReady(true)
      }

      mediaRecorder.start()

      // Animer chaque segment sur le canvas
      const segDuration = (totalDuration / segments.length) * 1000
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]

        // Charger l'image du segment
        if (seg.imageUrl) {
          await new Promise((resolve) => {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
              // Dessiner l'image en couvrant tout le canvas
              const aspectRatio = img.width / img.height
              const canvasAspect = width / height
              let drawW, drawH, drawX, drawY

              if (aspectRatio > canvasAspect) {
                drawH = height
                drawW = height * aspectRatio
                drawX = -(drawW - width) / 2
                drawY = 0
              } else {
                drawW = width
                drawH = width / aspectRatio
                drawX = 0
                drawY = -(drawH - height) / 2
              }

              ctx.drawImage(img, drawX, drawY, drawW, drawH)

              // Overlay sombre en bas
              const gradient = ctx.createLinearGradient(0, height * 0.6, 0, height)
              gradient.addColorStop(0, 'rgba(0,0,0,0)')
              gradient.addColorStop(1, 'rgba(0,0,0,0.85)')
              ctx.fillStyle = gradient
              ctx.fillRect(0, 0, width, height)

              // Texte du segment
              ctx.fillStyle = '#FFFFFF'
              ctx.font = `bold ${Math.floor(width * 0.048)}px Arial`
              ctx.textAlign = 'center'
              ctx.shadowColor = 'rgba(0,0,0,0.8)'
              ctx.shadowBlur = 15

              // Word wrap
              const words = seg.text.split(' ')
              const lines = []
              let line = ''
              const maxWidth = width * 0.85
              for (const word of words) {
                const testLine = line + word + ' '
                if (ctx.measureText(testLine).width > maxWidth && line !== '') {
                  lines.push(line.trim())
                  line = word + ' '
                } else {
                  line = testLine
                }
              }
              lines.push(line.trim())

              const lineHeight = Math.floor(width * 0.06)
              const totalTextHeight = lines.length * lineHeight
              let textY = height - 80 - totalTextHeight

              lines.forEach(l => {
                ctx.fillText(l, width / 2, textY)
                textY += lineHeight
              })

              // Logo Nexvari
              ctx.font = `bold ${Math.floor(width * 0.03)}px Arial`
              ctx.fillStyle = 'rgba(255,255,255,0.7)'
              ctx.fillText('nexvari.com', width / 2, 60)

              resolve()
            }
            img.onerror = resolve
            img.src = seg.imageUrl
          })
        } else {
          // Fond noir si pas d'image
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, width, height)
          ctx.fillStyle = '#fff'
          ctx.font = `bold ${Math.floor(width * 0.05)}px Arial`
          ctx.textAlign = 'center'
          ctx.fillText(seg.text, width / 2, height / 2)
        }

        // Attendre la durée du segment
        await new Promise(r => setTimeout(r, segDuration))
      }

      mediaRecorder.stop()
    } catch (err) {
      console.error('Download error:', err)
      // Fallback : télécharger juste le MP3
      if (audio) {
        const blob = new Blob([Uint8Array.from(atob(audio), c => c.charCodeAt(0))], { type: 'audio/mp3' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nexvari-${topic?.slice(0, 20)}.mp3`
        a.click()
      }
      setDownloading(false)
    }
  }

  const currentSeg = segments[currentSegment] || segments[0]
  const isVertical = format === 'vertical'

  return (
    <div className="space-y-4">
      {/* Canvas caché pour export */}
      <canvas ref={canvasRef} className="hidden" />
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setProgress(100) }} />

      {/* Player vidéo */}
      <div className="relative overflow-hidden rounded-2xl mx-auto"
           style={{
             width: isVertical ? '280px' : '100%',
             aspectRatio: isVertical ? '9/16' : '16/9',
             background: '#000',
             maxHeight: isVertical ? '500px' : 'auto',
           }}>

        {/* Image courante */}
        {currentSeg?.imageUrl ? (
          <img
            src={currentSeg.imageUrl}
            alt={currentSeg.text}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
            style={{ filter: 'brightness(0.85)' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
            <span className="text-white text-6xl">🎬</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

        {/* Logo */}
        <div className="absolute top-3 left-0 right-0 flex justify-center">
          <span className="text-white/70 text-xs font-semibold tracking-widest">nexvari.com</span>
        </div>

        {/* Texte du segment */}
        <div className="absolute bottom-12 left-0 right-0 px-4 text-center">
          <p className="text-white font-bold text-sm leading-relaxed"
             style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)', fontSize: isVertical ? '14px' : '16px' }}>
            {currentSeg?.text}
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1"
             style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div className="h-full transition-all duration-100"
               style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF2D55, #8B5CF6)' }} />
        </div>

        {/* Play/Pause overlay */}
        <button onClick={isPlaying ? pause : play}
                className="absolute inset-0 flex items-center justify-center transition-opacity"
                style={{ opacity: isPlaying ? 0 : 1 }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
               style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
            <span className="text-white text-3xl ml-1">▶</span>
          </div>
        </button>

        {/* Segment indicator */}
        <div className="absolute top-3 right-3 flex gap-1">
          {segments.map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
                 style={{ background: i === currentSegment ? '#FF2D55' : 'rgba(255,255,255,0.4)' }} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={restart}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white/60 border border-white/10 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
          ↺ Restart
        </button>

        <button onClick={isPlaying ? pause : play}
                className="px-6 py-2 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        <button onClick={downloadVideo} disabled={downloading}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                style={{
                  background: downloadReady ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                  color: downloadReady ? '#10B981' : '#fff',
                  border: downloadReady ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.1)',
                }}>
          {downloading ? '⏳ Génération...' : downloadReady ? '✅ Téléchargé !' : '⬇️ Télécharger MP4'}
        </button>
      </div>

      {/* Info */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Qualité', value: 'HD' },
          { label: 'Format', value: isVertical ? '9:16 TikTok' : '16:9 YouTube' },
          { label: 'Scènes', value: `${segments.length} images` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-2"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white/30 text-xs">{label}</p>
            <p className="text-white text-xs font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {downloading && (
        <div className="rounded-xl p-3 text-center"
             style={{ background: 'rgba(255,45,85,0.08)', border: '1px solid rgba(255,45,85,0.2)' }}>
          <p className="text-[#FF2D55] text-xs font-semibold">
            🎬 Génération de la vidéo MP4 en cours... Ne ferme pas la page.
          </p>
        </div>
      )}
    </div>
  )
}
