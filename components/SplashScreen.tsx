'use client'

import { useEffect, useState } from 'react'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setIsComplete(true)
    }, 2500)

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false)
    }, 3900)

    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      aria-label="Kültürel Miras yükleniyor"
      aria-live="polite"
      className={`splash-screen ${isComplete ? 'splash-screen--complete' : ''}`}
      role="status"
    >
      <div className="splash-screen__brand">
        <svg
          aria-hidden="true"
          className="splash-screen__mark"
          fill="none"
          viewBox="0 0 160 128"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="splash-gold" x1="36" x2="126" y1="18" y2="112" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE68A" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
          </defs>

          <path
            className="splash-screen__stroke splash-screen__stem"
            d="M34 16V112"
            pathLength="1"
            stroke="url(#splash-gold)"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            className="splash-screen__stroke splash-screen__arm splash-screen__arm--top"
            d="M38 65L82 20"
            pathLength="1"
            stroke="url(#splash-gold)"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            className="splash-screen__stroke splash-screen__arm splash-screen__arm--bottom"
            d="M38 64L83 108"
            pathLength="1"
            stroke="url(#splash-gold)"
            strokeLinecap="round"
            strokeWidth="8"
          />

          <path
            className="splash-screen__crescent"
            d="M104 31C78 40 76 80 101 96C113 104 128 101 138 92C119 94 104 80 104 64C104 48 119 34 138 36C129 28 115 27 104 31Z"
            fill="url(#splash-gold)"
          />
          <path
            className="splash-screen__star"
            d="M137 18L140 25L148 26L142 31L144 39L137 35L130 39L132 31L126 26L134 25L137 18Z"
            fill="#FDE68A"
            transform-origin="137 29"
          />
        </svg>

        <span className="splash-screen__wordmark">ÜLTÜREL MİRAS</span>
      </div>

      <style jsx>{`
        .splash-screen {
          align-items: center;
          background: #09090b;
          display: flex;
          inset: 0;
          justify-content: center;
          opacity: 1;
          position: fixed;
          transition: opacity 1.4s ease;
          z-index: 100;
        }

        .splash-screen--complete {
          opacity: 0;
          pointer-events: none;
        }

        .splash-screen__brand {
          align-items: center;
          display: flex;
          gap: 0.5rem;
          max-width: calc(100vw - 2rem);
        }

        .splash-screen__mark {
          flex: 0 0 auto;
          height: 7rem;
          overflow: visible;
          width: 9rem;
        }

        .splash-screen__stroke {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }

        .splash-screen__stem {
          animation: draw-stem 0.7s ease-out 0.15s forwards;
        }

        .splash-screen__arm--top {
          animation: draw-arm 0.65s ease-out 0.55s forwards;
        }

        .splash-screen__arm--bottom {
          animation: draw-arm 0.65s ease-out 0.85s forwards;
        }

        .splash-screen__crescent {
          animation: reveal-crescent 1s ease-out 1.15s forwards;
          opacity: 0;
          transform-origin: 108px 64px;
        }

        .splash-screen__star {
          animation: spin-star 1.25s cubic-bezier(0.2, 0.8, 0.2, 1) 1.45s forwards;
          opacity: 0;
          transform: scale(0.2) rotate(-90deg);
        }

        .splash-screen__wordmark {
          color: #fcd34d;
          font-size: clamp(0.7rem, 3vw, 1.1rem);
          font-weight: 700;
          letter-spacing: 0.28em;
          margin-left: 0.28em;
          opacity: 0;
          transform: translateY(0.5rem);
        }

        .splash-screen--complete .splash-screen__wordmark {
          animation: reveal-wordmark 0.7s ease-out forwards;
        }

        @keyframes draw-stem {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes draw-arm {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes reveal-crescent {
          from {
            opacity: 0;
            transform: scale(0.7) rotate(-20deg);
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

        @keyframes reveal-wordmark {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .splash-screen__stroke,
          .splash-screen__crescent,
          .splash-screen__star,
          .splash-screen__wordmark {
            animation: none;
            opacity: 1;
            stroke-dashoffset: 0;
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
