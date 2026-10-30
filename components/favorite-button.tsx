'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FAVORITES_UPDATED_EVENT, isFavorite, toggleFavorite } from '@/lib/favorites'

type FavoriteButtonProps = {
  siteId: string
  className?: string
  label?: boolean
}

export function FavoriteButton({ siteId, className = '', label = false }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const updateSavedState = () => setSaved(isFavorite(siteId))
    updateSavedState()
    window.addEventListener(FAVORITES_UPDATED_EVENT, updateSavedState)
    window.addEventListener('storage', updateSavedState)

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, updateSavedState)
      window.removeEventListener('storage', updateSavedState)
    }
  }, [siteId])

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    setSaved(toggleFavorite(siteId))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      title={saved ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      className={`inline-flex items-center justify-center gap-2 rounded-full border transition-all ${
        saved
          ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
          : 'border-zinc-600/80 bg-zinc-950/70 text-zinc-300 hover:border-amber-400/60 hover:bg-amber-500/15 hover:text-amber-300'
      } ${label ? 'px-4 py-2 text-sm font-semibold' : 'h-10 w-10'} ${className}`}
    >
      <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
      {label && (saved ? 'Favorilerde' : 'Favorilere ekle')}
    </button>
  )
}
