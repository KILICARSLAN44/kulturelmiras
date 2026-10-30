'use client'

import { type MouseEvent, type ReactNode, useState } from 'react'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 50, y: 50 })

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    setSpotlightPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    })
  }

  return (
    <div
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        '--spotlight-x': `${spotlightPosition.x}%`,
        '--spotlight-y': `${spotlightPosition.y}%`,
      } as React.CSSProperties}
    >
      <div className="spotlight-card__glow" aria-hidden="true" />
      {children}
    </div>
  )
}
