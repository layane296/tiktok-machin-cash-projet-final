// components/VideoPlayer.js
import { useState, useEffect, useRef } from 'react'

export default function VideoPlayer({ videoData, topic }) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [downloadDone, setDownloadDone] = useState(false)
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

  // ── Télécharger tout le pack (images + audio) ─────────────────
  const downloadPack = async () => {
    setDownloading(true)
    try {
      // 1. Télécharger chaque image
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i]
        if (seg.imageUrl || seg.imageBase64) {
          const imgData = seg.imageBase64
            ? `data:image/png;base64,${seg.imageBase64}`
            : seg.imageUrl

          const a = document.createElement('a')
          a.href = imgData
          a.download = `nexvari-scene-${i + 1}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          // Petit délai entre chaque téléchargement
          await new Promise(r => setTimeout(r, 400))
        }
      }

      // 2. Télécharger la voix off MP3
      if (audio) {
        await new Promise(r => setTimeout(r, 400))
        const blob = new Blob(
          [Uint8Array.from(atob(audio), c => c.charCodeAt(0))],
          { type: 'audio/mp3' }
        )
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nexvari-voix-off.mp3`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }

      setDownloadDone(true)
    } catch (err) {
      console.error('Download error:', err)
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

          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 35%, rgba(0,0,0,0.75) 100%)' }} />

          <div className="absolute top-3 left-0 right-0 text-center">
            <span className="text-white/70 text-xs font-bold tracking-widest">nexvari.com</span>
          </div>

          <div className="absolute bottom-10 left-3 right-3 text-center">
            <p className="text-white font-bold leading-relaxed"
               style={{ fontSize: '13px', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              {currentSeg?.text}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="h-full transition-all duration-100"
                 style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #FF2D55, #8B5CF6)' }} />
          </div>

          {!isPlaying && (
            <button onClick={play} className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </button>
          )}

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
        <button onClick={downloadPack} disabled={downloading}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
                style={{
                  background: downloadDone ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                  color: downloadDone ? '#10B981' : '#fff',
                  border: `1px solid ${downloadDone ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.15)'}`,
                }}>
          {downloading ? '⏳ Téléchargement...' : downloadDone ? '✅ Pack téléchargé !' : '⬇️ Télécharger le pack'}
        </button>
      </div>

      {/* Infos pack */}
      <div className="rounded-2xl border border-white/10 p-4"
           style={{ background: 'rgba(255,255,255,0.02)' }}>
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">
          📦 Contenu du pack téléchargeable
        </p>
        <div className="space-y-2">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0"
                   style={{ background: 'rgba(255,255,255,0.05)' }}>
                {(seg.imageUrl || seg.imageBase64) && (
                  <img
                    src={seg.imageUrl || `data:image/png;base64,${seg.imageBase64}`}
                    alt={`Scene ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <p className="text-white/50 text-xs truncate flex-1">
                📸 Scene {i + 1} — {seg.text?.slice(0, 40)}...
              </p>
            </div>
          ))}
          {audio && (
            <div className="flex items-center gap-3 pt-1 border-t border-white/5 mt-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(139,92,246,0.2)' }}>
                🎙️
              </div>
              <p className="text-white/50 text-xs">Voix off — nexvari-voix-off.mp3</p>
            </div>
          )}
        </div>
      </div>

      {/* Guide CapCut */}
      {downloadDone && (
        <div className="rounded-2xl border border-green-500/20 p-4"
             style={{ background: 'rgba(16,185,129,0.05)' }}>
          <p className="text-green-400 text-xs font-semibold mb-2">✅ Pack téléchargé ! Voici comment assembler ta vidéo :</p>
          <ol className="space-y-1.5 text-white/50 text-xs">
            <li>1. Ouvre <strong className="text-white">CapCut</strong> (gratuit sur mobile/PC)</li>
            <li>2. Importe les images <strong className="text-white">scene-1, scene-2...</strong> dans l'ordre</li>
            <li>3. Importe la voix off <strong className="text-white">nexvari-voix-off.mp3</strong></li>
            <li>4. Ajuste la durée de chaque image selon la voix</li>
            <li>5. Exporte en MP4 et poste sur TikTok ! 🚀</li>
          </ol>
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
