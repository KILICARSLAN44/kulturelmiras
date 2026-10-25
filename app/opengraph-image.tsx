import { ImageResponse } from 'next/og'

export const alt = 'Kültürel Miras Arşivi'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          color: '#FEF3C7',
        }}
      >
        <svg
          aria-hidden="true"
          height="160"
          viewBox="0 0 760 160"
          width="760"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="og-gold" x1="26" x2="145" y1="20" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF3C7" />
              <stop offset="0.5" stopColor="#FBBF24" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
            <filter id="og-star-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur result="blur" stdDeviation="2.5" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d="M38 25V135" stroke="url(#og-gold)" strokeLinecap="round" strokeWidth="9" />
          <path
            d="M116 24C82 24 57 49 57 80C57 111 82 136 116 136C100 124 91 104 91 80C91 56 100 36 116 24Z"
            fill="url(#og-gold)"
          />
          <path
            d="M111 47L115 58L127 58L117 65L121 76L111 69L101 76L105 65L95 58L107 58L111 47Z"
            fill="#FEF3C7"
            filter="url(#og-star-glow)"
          />
          <text
            x="154"
            y="96"
            fill="#FEF3C7"
            fontFamily="Arial, sans-serif"
            fontSize="29"
            fontWeight="600"
            letterSpacing="3"
          >
            KÜLTÜREL MİRAS ARŞİVİ
          </text>
        </svg>
      </div>
    ),
    size,
  )
}
