const FAVORITES_STORAGE_KEY = 'kulturel-miras-favorites'
export const FAVORITES_UPDATED_EVENT = 'kulturel-miras-favorites-updated'

export function getFavoriteIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch (error) {
    console.error('Favoriler okunurken hata oluştu:', error)
    return []
  }
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id)
}

export function toggleFavorite(id: string): boolean {
  const favoriteIds = getFavoriteIds()
  const nextIds = favoriteIds.includes(id)
    ? favoriteIds.filter((favoriteId) => favoriteId !== id)
    : [...favoriteIds, id]

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextIds))
    window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT))
  } catch (error) {
    console.error('Favori kaydedilirken hata oluştu:', error)
  }

  return nextIds.includes(id)
}
