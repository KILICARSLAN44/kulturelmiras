'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type SplashScreenProps = {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(false)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    if (window.sessionStorage.getItem('hasSeenSplash') === 'true') {
      const completeTimer = window.setTimeout(onComplete, 0)
      return () => window.clearTimeout(completeTimer)
    }

    let fadeTimer: number | undefined
    let completeTimer: number | undefined
    const startTimer = window.requestAnimationFrame(() => {
      window.sessionStorage.setItem('hasSeenSplash', 'true')
      setVisible(true)
      fadeTimer = window.setTimeout(() => setIsFading(true), 2400)
      completeTimer = window.setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 3000)
    })

    return () => {
      window.cancelAnimationFrame(startTimer)
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer)
      if (completeTimer !== undefined) window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!visible) {
    return null
  }

  return (
    <div
      aria-label="Kültürel Miras yükleniyor"
      aria-live="polite"
      className={`splash-overlay fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black ${
        isFading ? 'pointer-events-none splash-overlay--fading' : ''
      }`}
      role="status"
    >
      <Image
        src="/og-image.png"
        alt="Kültürel Miras Arşivi"
        width={1200}
        height={630}
        priority
        sizes="(max-width: 768px) 92vw, 75vw"
        className="splash-image h-auto w-[min(92vw,75rem)] max-h-[82vh] object-contain"
      />

      <style jsx>{`
        .splash-overlay {
          opacity: 1;
          transition: opacity 0.6s ease-in;
        }

        .splash-overlay--fading {
          opacity: 0;
        }

        .splash-image {
          animation: splash-image-in 0.9s ease-out 0.1s both;
        }

        @keyframes splash-image-in {
          from {
            opacity: 0;
            transform: scale(0.97);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-overlay,
          .splash-image {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}
