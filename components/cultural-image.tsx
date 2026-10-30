'use client'

import { Landmark } from 'lucide-react'
import { useState } from 'react'

type CulturalImageProps = {
  src?: string | null
  alt: string
  className?: string
  fallbackClassName?: string
}

export function CulturalImage({ src, alt, className = '', fallbackClassName = '' }: CulturalImageProps) {
  const [hasError, setHasError] = useState(false)
  const showFallback = !src?.trim() || hasError

  if (showFallback) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-900 via-amber-950/20 to-zinc-900 ${fallbackClassName}`} role="img" aria-label={alt}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.16),transparent_58%)]" aria-hidden="true" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10 text-amber-300 shadow-[0_0_35px_rgba(251,191,36,0.18)] backdrop-blur-md">
          <Landmark className="h-8 w-8" strokeWidth={1.4} aria-hidden="true" />
        </span>
      </div>
    )
  }

  return <img src={src ?? undefined} alt={alt} className={className} onError={() => setHasError(true)} />
}
