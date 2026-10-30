'use client'

import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

type AudioGuideProps = {
  text: string
}

export function AudioGuide({ text }: AudioGuideProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  function togglePlayback() {
    if (!text.trim()) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'tr-TR'
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  return (
    <button
      type="button"
      onClick={togglePlayback}
      disabled={!text.trim()}
      aria-pressed={isPlaying}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 text-sm font-semibold text-amber-300 shadow-lg shadow-amber-950/20 transition-all hover:border-amber-300/70 hover:bg-amber-500/20 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
      {isPlaying ? 'Dinleniyor...' : 'Eseri Dinle'}
    </button>
  )
}
