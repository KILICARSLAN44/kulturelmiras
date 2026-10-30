'use client'

import { Mic, MicOff, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type VoiceSearchInputProps = {
  value: string
  onChange: (value: string) => void
}

type SpeechRecognitionResultEvent = Event & {
  results: SpeechRecognitionResultList
}

type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export function VoiceSearchInput({ value, onChange }: VoiceSearchInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported] = useState(() => {
    if (typeof window === 'undefined') return true
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  })
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) return

    const recognition = new Recognition()
    recognition.lang = 'tr-TR'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim()

      if (transcript) onChange(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [onChange])

  function toggleListening() {
    const recognition = recognitionRef.current
    if (!recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
      return
    }

    recognition.start()
    setIsListening(true)
  }

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-amber-300" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Eser, antik kent veya bölge ara..."
        className="w-full rounded-2xl border-0 bg-transparent py-4 pl-12 pr-14 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <button
        type="button"
        onClick={toggleListening}
        disabled={!isSupported}
        aria-label={!isSupported ? 'Sesli arama bu tarayıcıda desteklenmiyor' : isListening ? 'Sesli aramayı durdur' : 'Sesli aramayı başlat'}
        title={!isSupported ? 'Sesli arama desteklenmiyor' : isListening ? 'Dinleme durduruluyor' : 'Sesli ara'}
        className={`absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl transition-all ${
          isListening
            ? 'animate-pulse bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30'
            : 'text-amber-300 hover:bg-amber-500/15 hover:text-amber-200'
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {isListening ? <MicOff className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
      </button>
      {isListening && <span className="sr-only" role="status">Dinleniyor, konuşabilirsiniz.</span>}
    </div>
  )
}
