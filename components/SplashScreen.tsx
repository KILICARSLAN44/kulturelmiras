'use client'

import { useEffect, useState } from 'react'

type SplashScreenProps = {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const [showWordmark, setShowWordmark] = useState(false)

  useEffect(() => {
    const wordmarkTimer = window.setTimeout(() => setShowWordmark(true), 1500)
    const fadeTimer = window.setTimeout(() => setIsFading(true), 2000)
    const completeTimer = window.setTimeout(() => {
      setShow(false)
      onComplete()
    }, 2500)

    return () => {
      window.clearTimeout(wordmarkTimer)
      window.clearTimeout(fadeTimer)
      window.clearTimeout(completeTimer)
    }
  }, [onComplete])

  if (!show) {
    return null
  }

  return (
    <div
      aria-label="Kültürel Miras yükleniyor"
      aria-live="polite"
      className={`fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black transition-opacity duration-500 ${
        isFading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
    >
      <svg
        aria-hidden="true"
        className="h-auto w-[min(90vw,36rem)] overflow-visible"
        fill="none"
        viewBox="0 0 560 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="splash-gold" x1="26" x2="145" y1="20" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF3C7" />
            <stop offset="0.5" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <filter id="splash-star-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          className="splash-k-stem"
          d="M38 25V135"
          pathLength="1"
          stroke="url(#splash-gold)"
          strokeLinecap="round"
          strokeWidth="9"
        />
        <path
          className="splash-crescent"
          d="M116 24C82 24 57 49 57 80C57 111 82 136 116 136C100 124 91 104 91 80C91 56 100 36 116 24Z"
          fill="url(#splash-gold)"
        />
        <path
          className="splash-star"
          d="M111 47L115 58L127 58L117 65L121 76L111 69L101 76L105 65L95 58L107 58L111 47Z"
          fill="#FEF3C7"
          filter="url(#splash-star-glow)"
          transform-origin="111 62"
        />
        <text
          className={`splash-wordmark ${showWordmark ? 'splash-wordmark--visible' : ''}`}
          x="151"
          y="96"
          fill="#FEF3C7"
          fontFamily="Arial, sans-serif"
          fontSize="29"
          fontWeight="600"
          letterSpacing="3"
        >
          ÜLTÜREL MİRAS
        </text>
      </svg>

      <style jsx>{`
        .splash-k-stem {
          animation: draw-stem 0.8s ease-out forwards;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }

        .splash-crescent {
          animation: reveal-crescent 0.9s ease-out 0.35s forwards;
          opacity: 0;
          transform-origin: 88px 80px;
        }

        .splash-star {
          animation: spin-star 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.8s forwards;
          opacity: 0;
          transform: scale(0.2) rotate(-90deg);
        }

        .splash-wordmark {
          opacity: 0;
          transform: translateX(-18px);
          transform-box: fill-box;
          transform-origin: left center;
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .splash-wordmark--visible {
          opacity: 1;
          transform: translateX(0);
        }

        @keyframes draw-stem {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes reveal-crescent {
          from {
            opacity: 0;
            transform: scale(0.7) rotate(-12deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0);
          }
        }

        @keyframes spin-star {
          0% {
            opacity: 0;
            transform: scale(0.2) rotate(-90deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.15) rotate(270deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-k-stem,
          .splash-crescent,
          .splash-star {
            animation: none;
            opacity: 1;
            stroke-dashoffset: 0;
            transform: none;
          }

          .splash-wordmark {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}
