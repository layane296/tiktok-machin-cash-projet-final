// components/VideoPlayer.js
import { useState, useRef, useEffect } from 'react'

export default function VideoPlayer({ videoData, topic }) {
  const [currentSegment, setCurrentSegment] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState(videoData?.format || 'vertical')
  const audioRef = useRef(null)
  const intervalRef = useRef(null)
  const segmentTimeRef = useRef(0)

  const segments = videoData?.segments || []
  const current = segments[currentSegment] || {}

  useEffect(() => {
    if (videoData?.audio && audioRef.current) {
      const blob = base64ToBlob(videoData.audio, 'audio/mp3')
      audioRef.current.src = URL.createObjectURL(blob)
    }
  }, [videoData])

  const base64ToBlob = (base64, type) => {
    const binary = atob(base64)
    const array = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i)
    return new Blob([array], { type })
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      clearInterval(intervalRef.current)
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
      runSegments()
    }
  }

  const runSegments = () => {
    clearInterval(intervalRef.current)
    let segIdx = currentSegment
    let elapsed = segmentTimeRef.current

    intervalRef.current = setInterval(() => {
      elapsed += 0.1
      segmentTimeRef.current = elapsed

      const seg = segments[segIdx]
      if (!seg) { clearInterval(intervalRef.current); setIsPlaying(false); return }

      const pct = Math.min(100, (elapsed / seg.duration) * 100)
      setProgress(pct)

      if (elapsed >= seg.duration) {
        elapsed = 0
        segmentTimeRef.current = 0
        segIdx = (segIdx + 1) % segments.length
        setCurrentSegment(segIdx)
        if (segIdx === 0) {
          clearInterval(intervalRef.current)
          setIsPlaying(false)
          audioRef.current?.pause()
        }
      }
    }, 100)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const handleDownload = (fmt) => {
    // Télécharger l'audio pour l'instant (vidéo MP4 nécessite FFmpeg server-side)
    if (videoData?.audio) {
      const blob = base64ToBlob(videoData.audio, 'audio/mp3')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `video-${topic?.slice(0, 20).replace(/\s/g, '-') || 'tiktok'}-${fmt}.mp3`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const isVertical = format === 'vertical'

  return (
    <div className="space-y-4">
      {/* Format selector */}
      <div className="flex gap-2">
        {['vertical', 'horizontal'].map(f => (
          <button key={f} onClick={() => setFormat(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                  style={{
                    borderColor: format === f ? 'rgba(255,45,85,0.5)' : 'rgba(255,255,255,0.1)',
                    background: format === f ? 'rgba(255,45,85,0.1)' : 'transparent',
                    color: format === f ? '#FF2D55' : 'rgba(255,255,255,0.4)',
                  }}>
            {f === 'vertical' ? '📱 TikTok (9:16)' : '🖥️ YouTube (16:9)'}
          </button>
        ))}
      </div>

      {/* Video preview */}
      <div className="flex justify-center">
        <div className="relative overflow-hidden rounded-2xl border border-white/10"
             style={{
               width: isVertical ? '200px' : '356px',
               height: isVertical ? '356px' : '200px',
               background: '#000',
             }}>
          {/* Image */}
          {current.imageUrl ? (
            <img src={current.imageUrl} alt={current.text}
                 className="w-full h-full object-cover"
                 style={{ opacity: 0.85 }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #0F0F0F, #1A1A1A)' }}>
              <span className="text-4xl">🎬</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />

          {/* Sous-titres */}
          <div className="absolute bottom-4 left-3 right-3 text-center">
            <p className="text-white text-xs font-bold leading-tight"
               style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontFamily: 'var(--font-body)' }}>
              {current.text}
            </p>
          </div>

          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5"
               style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div className="h-full transition-all duration-100"
                 style={{ width: `${progress}%`, background: '#FF2D55' }} />
          </div>

          {/* Segment indicators */}
          <div className="absolute top-2 left-2 right-2 flex gap-1">
            {segments.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full"
                   style={{ background: i <= currentSegment ? '#fff' : 'rgba(255,255,255,0.3)' }} />
            ))}
          </div>

          {/* Play button overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={togglePlay}
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                      style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </div>
          )}

          {/* Pause overlay */}
          {isPlaying && (
            <button onClick={togglePlay} className="absolute inset-0 w-full h-full" />
          )}
        </div>
      </div>

      {/* Controls */}
      <audio ref={audioRef} onEnded={() => { setIsPlaying(false); clearInterval(intervalRef.current) }} />

      <div className="flex items-center justify-between">
        <button onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-white/70 hover:text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
          {isPlaying ? (
            <><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause</>
          ) : (
            <><svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><polygon points="5 3 19 12 5 21 5 3"/></svg> Aperçu</>
          )}
        </button>

        <div className="flex gap-2">
          <button onClick={() => handleDownload('tiktok')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all"
                  style={{ borderColor: 'rgba(255,45,85,0.3)', color: '#FF2D55', background: 'rgba(255,45,85,0.05)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            TikTok
          </button>
          <button onClick={() => handleDownload('youtube')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all"
                  style={{ borderColor: 'rgba(0,245,255,0.3)', color: '#00F5FF', background: 'rgba(0,245,255,0.05)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            YouTube
          </button>
        </div>
      </div>

      {/* Segments list */}
      <div className="space-y-2">
        <p className="text-xs text-white/30 uppercase tracking-wider">Scènes générées</p>
        {segments.map((seg, i) => (
          <div key={i} onClick={() => { setCurrentSegment(i); setProgress(0) }}
               className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
               style={{
                 background: currentSegment === i ? 'rgba(255,45,85,0.08)' : 'rgba(255,255,255,0.02)',
                 border: `1px solid ${currentSegment === i ? 'rgba(255,45,85,0.3)' : 'rgba(255,255,255,0.05)'}`,
               }}>
            {seg.imageUrl && (
              <img src={seg.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/70 leading-relaxed line-clamp-2">{seg.text}</p>
              <p className="text-xs text-white/30 mt-1">{seg.duration}s</p>
            </div>
            {currentSegment === i && (
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D55] flex-shrink-0 mt-1.5 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
