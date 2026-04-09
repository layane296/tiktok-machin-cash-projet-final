// components/VideoPlayer.js
import { useState, useEffect, useRef } from 'react'

export default function VideoPlayer({ videoData, topic }) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadReady, setDownloadReady] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const audioRef = useRef(null)
  const intervalRef = useRef(null)

  const { segments = [], audio, totalDuration = 30, format = 'vertical' } = videoData || {}
  const isVertical = format === 'vertical'

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
        setProgress(Math.min(pct, 100))
        const segIndex = Math.min(
          Math.floor((current / duration) * segments.length),
          segments.length - 1
        )
        setCurrentSegment(segIndex)
        if (pct >= 99) {
          setIsPlaying(false)
          clearInterval(intervalRef.current)
        }
      }
    }, 100)
  }

  // ── Génération vidéo MP4 avec Canvas frame par frame ──────────
  const downloadVideo = async () => {
    setDownloading(true)
    setDownloadProgress(0)
    setDownloadError('')

    try {
      const width = isVertical ? 1080 : 1920
      const height = isVertical ? 1920 : 1080
      const fps = 30
      const segDuration = Math.max(3, Math.floor((totalDuration || segments.length * 4) / segments.length))

      // Créer canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Pré-charger toutes les images
      setDownloadProgress(5)
      const loadedImages = []
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]
        if (seg.imageUrl || seg.imageBase64) {
          const img = new Image()
          await new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
            img.src = seg.imageUrl || `data:image/png;base64,${seg.imageBase64}`
          })
          loadedImages.push(img)
        } else {
          loadedImages.push(null)
        }
        setDownloadProgress(5 + Math.floor((i / segments.length) * 20))
      }
      setDownloadProgress(25)

      // Générer les frames PNG pour chaque segment
      const allFrames = []
      const framesPerSegment = fps * segDuration

      for (let si = 0; si < segments.length; si++) {
        const seg = segments[si]
        const img = loadedImages[si]

        for (let f = 0; f < framesPerSegment; f++) {
          // Fond noir
          ctx.fillStyle = '#000'
          ctx.fillRect(0, 0, width, height)

          // Image du segment
          if (img && img.complete && img.naturalWidth > 0) {
            // Cover fit
            const imgAspect = img.naturalWidth / img.naturalHeight
            const canvasAspect = width / height
            let dw, dh, dx, dy
            if (imgAspect > canvasAspect) {
              dh = height; dw = height * imgAspect
              dx = -(dw - width) / 2; dy = 0
            } else {
              dw = width; dh = width / imgAspect
              dx = 0; dy = -(dh - height) / 2
            }
            ctx.drawImage(img, dx, dy, dw, dh)
          } else {
            // Fond dégradé si pas d'image
            const grad = ctx.createLinearGradient(0, 0, width, height)
            grad.addColorStop(0, '#FF2D55')
            grad.addColorStop(1, '#8B5CF6')
            ctx.fillStyle = grad
            ctx.fillRect(0, 0, width, height)
          }

          // Overlay sombre en bas
          const gradient = ctx.createLinearGradient(0, height * 0.5, 0, height)
          gradient.addColorStop(0, 'rgba(0,0,0,0)')
          gradient.addColorStop(1, 'rgba(0,0,0,0.85)')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, width, height)

          // Logo nexvari.com en haut
          ctx.save()
          ctx.font = `bold ${Math.floor(width * 0.028)}px Arial`
          ctx.fillStyle = 'rgba(255,255,255,0.8)'
          ctx.textAlign = 'center'
          ctx.shadowColor = 'rgba(0,0,0,0.8)'
          ctx.shadowBlur = 10
          ctx.fillText('nexvari.com', width / 2, Math.floor(height * 0.045))
          ctx.restore()

          // Texte du segment avec word wrap
          ctx.save()
          const fontSize = Math.floor(width * 0.045)
          ctx.font = `bold ${fontSize}px Arial`
          ctx.fillStyle = '#FFFFFF'
          ctx.textAlign = 'center'
          ctx.shadowColor = 'rgba(0,0,0,0.9)'
          ctx.shadowBlur = 20

          const words = seg.text.split(' ')
          const lines = []
          let line = ''
          const maxW = width * 0.85
          for (const word of words) {
            const test = line + word + ' '
            if (ctx.measureText(test).width > maxW && line) {
              lines.push(line.trim()); line = word + ' '
            } else { line = test }
          }
          lines.push(line.trim())

          const lineH = fontSize * 1.3
          let textY = height - Math.floor(height * 0.08) - (lines.length - 1) * lineH
          for (const l of lines) {
            ctx.fillText(l, width / 2, textY)
            textY += lineH
          }
          ctx.restore()

          // Capturer le frame
          allFrames.push(canvas.toDataURL('image/jpeg', 0.85))
        }

        setDownloadProgress(25 + Math.floor(((si + 1) / segments.length) * 50))
      }

      setDownloadProgress(75)

      // Encoder en WebM via MediaRecorder avec canvas animé
      const offscreenCanvas = document.createElement('canvas')
      offscreenCanvas.width = width
      offscreenCanvas.height = height
      const offCtx = offscreenCanvas.getContext('2d')

      const stream = offscreenCanvas.captureStream(fps)

      // Ajouter audio au stream
      if (audio) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
          const audioBytes = Uint8Array.from(atob(audio), c => c.charCodeAt(0))
          const decoded = await audioCtx.decodeAudioData(audioBytes.buffer)
          const src = audioCtx.createBufferSource()
          src.buffer = decoded
          const dest = audioCtx.createMediaStreamDestination()
          src.connect(dest)
          src.start(0)
          for (const track of dest.stream.getAudioTracks()) {
            stream.addTrack(track)
          }
        } catch (e) { console.log('Audio stream error:', e) }
      }

      const chunks = []
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm'

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 })
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }

      await new Promise((resolve) => {
        recorder.onstop = resolve
        recorder.start()

        let frameIndex = 0
        const totalFrames = allFrames.length
        const frameInterval = 1000 / fps

        const renderFrame = () => {
          if (frameIndex >= totalFrames) {
            recorder.stop()
            return
          }
          const imgEl = new Image()
          imgEl.onload = () => {
            offCtx.drawImage(imgEl, 0, 0, width, height)
            const prog = 75 + Math.floor((frameIndex / totalFrames) * 20)
            setDownloadProgress(Math.min(prog, 95))
            frameIndex++
            setTimeout(renderFrame, frameInterval)
          }
          imgEl.src = allFrames[frameIndex]
        }
        renderFrame()
      })

      setDownloadProgress(98)

      // Télécharger
      const blob = new Blob(chunks, { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nexvari-${(topic || 'video').replace(/\s+/g, '-').slice(0, 30)}.webm`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadProgress(100)
      setDownloadReady(true)
    } catch (err) {
      console.error('Download error:', err)
      setDownloadError('Erreur de génération. Essaie sur Chrome ou Edge.')

      // Fallback : télécharger juste le MP3
      if (audio) {
        const blob = new Blob([Uint8Array.from(atob(audio), c => c.charCodeAt(0))], { type: 'audio/mp3' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nexvari-${(topic || 'audio').slice(0, 20)}.mp3`
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setDownloading(false)
    }
  }

  const currentSeg = segments[currentSegment] || segments[0]

  return (
    <div className="space-y-4">
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); setProgress(100) }} />

      {/* Player */}
      <div className="flex justify-center">
        <div className="relative overflow-hidden rounded-2xl"
             style={{
               width: isVertical ? '260px' : '100%',
               aspectRatio: isVertical ? '9/16' : '16/9',
               background: '#000',
               maxHeight: isVertical ? '460px' : 'auto',
             }}>

          {/* Image courante */}
          {(currentSeg?.imageUrl || currentSeg?.imageBase64) ? (
            <img
              src={currentSeg.imageUrl || `data:image/png;base64,${currentSeg.imageBase64}`}
              alt={currentSeg.text}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.85)' }}
            />
          ) : (
            <div className="absolute inset-0"
                 style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }} />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 35%, rgba(0,0,0,0.75) 100%)' }} />

          {/* Logo */}
          <div className="absolute top-3 left-0 right-0 text-center">
            <span className="text-white/70 text-xs font-bold tracking-widest">nexvari.com</span>
          </div>

          {/* Texte */}
          <div className="absolute bottom-10 left-3 right-3 text-center">
            <p className="text-white font-bold leading-relaxed"
               style={{ fontSize: '13px', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              {currentSeg?.text}
            </p>
          </div>

          {/* Progress */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="h-full transition-all duration-100"
                 style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF2D55, #8B5CF6)' }} />
          </div>

          {/* Play button */}
          {!isPlaying && (
            <button onClick={play}
                    className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </button>
          )}

          {/* Dots */}
          <div className="absolute top-3 right-3 flex gap-1">
            {segments.map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                   style={{ background: i === currentSegment ? '#FF2D55' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button onClick={restart}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/60 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
          ↺ Restart
        </button>
        <button onClick={isPlaying ? pause : play}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FF2D55, #8B5CF6)' }}>
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={downloadVideo} disabled={downloading}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
                style={{
                  background: downloadReady ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                  color: downloadReady ? '#10B981' : '#fff',
                  border: `1px solid ${downloadReady ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.15)'}`,
                }}>
          {downloading ? `⏳ ${downloadProgress}%` : downloadReady ? '✅ Téléchargé !' : '⬇️ Télécharger vidéo'}
        </button>
      </div>

      {/* Progress bar téléchargement */}
      {downloading && (
        <div className="rounded-xl overflow-hidden border border-white/10">
          <div className="h-2 bg-white/5">
            <div className="h-full transition-all duration-300"
                 style={{ width: `${downloadProgress}%`, background: 'linear-gradient(90deg, #FF2D55, #8B5CF6)' }} />
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-white/50 text-xs">
              {downloadProgress < 25 ? '🖼️ Chargement des images...' :
               downloadProgress < 75 ? '🎨 Génération des frames...' :
               downloadProgress < 95 ? '🎬 Encodage vidéo...' : '✅ Finalisation...'}
            </p>
          </div>
        </div>
      )}

      {downloadError && (
        <div className="rounded-xl p-3 text-center border border-red-500/20"
             style={{ background: 'rgba(255,45,85,0.05)' }}>
          <p className="text-red-400 text-xs">{downloadError}</p>
          <p className="text-white/30 text-xs mt-1">Le fichier MP3 a été téléchargé à la place.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Qualité', value: 'HD' },
          { label: 'Format', value: isVertical ? '9:16 TikTok' : '16:9 YouTube' },
          { label: 'Scènes', value: `${segments.length} images` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-2 text-center"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white/30 text-xs">{label}</p>
            <p className="text-white text-xs font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
