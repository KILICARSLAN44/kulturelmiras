'use client'

import Link from 'next/link'
import { Heart, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SiteHeader } from '@/components/site-header'
import { FavoriteButton } from '@/components/favorite-button'
import { FAVORITES_UPDATED_EVENT, getFavoriteIds } from '@/lib/favorites'
import { supabase } from '@/lib/supabase/client'
import { normalizeCategory } from '@/lib/categories'
import { CulturalImage } from '@/components/cultural-image'

type FavoriteSite = {
  id: string
  title: string
  category: string
  city?: string | null
  location: string
  details: string
  image?: string | string[] | null
  image_urls?: string[] | null
}

export default function FavoritesPage() {
  const [sites, setSites] = useState<FavoriteSite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFavorites() {
      const ids = getFavoriteIds()
      if (ids.length === 0) {
        setSites([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase.from('eserler').select('*').in('id', ids).eq('is_approved', true)
      if (error) {
        console.error('Favoriler yüklenirken hata oluştu:', error)
      } else {
        const order = new Map(ids.map((id, index) => [id, index]))
        setSites((data ?? []).sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)))
      }
      setLoading(false)
    }

    fetchFavorites()
    window.addEventListener(FAVORITES_UPDATED_EVENT, fetchFavorites)
    window.addEventListener('storage', fetchFavorites)
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, fetchFavorites)
      window.removeEventListener('storage', fetchFavorites)
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Kişisel koleksiyonun</p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold text-zinc-100 sm:text-4xl"><Heart className="h-8 w-8 fill-amber-400 text-amber-400" /> Favorilerim</h1>
          <p className="mt-3 text-zinc-400">Beğendiğin eserleri üyelik olmadan bu tarayıcıda saklayabilirsin.</p>
        </div>

        {loading ? <p className="py-16 text-center text-sm text-zinc-500">Favoriler yükleniyor...</p> : sites.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 px-6 py-16 text-center backdrop-blur-xl">
            <Heart className="mx-auto mb-4 h-10 w-10 text-zinc-600" />
            <h2 className="text-xl font-semibold text-zinc-200">Henüz favori eserin yok</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">Eser kartlarındaki kalp ikonunu kullanarak favorilerini burada toplayabilirsin.</p>
            <Link href="/" className="mt-6 inline-flex rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-amber-400">Eserleri keşfet</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {sites.map((site) => (
              <Link key={site.id} href={`/eser/${site.id}`} className="group block h-full">
                <Card className="h-full overflow-hidden border border-zinc-800 bg-zinc-900/50 text-zinc-100 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-amber-500/40">
                  <div className="relative isolate h-48 overflow-hidden">
                    <CulturalImage src={(Array.isArray(site.image_urls) ? site.image_urls[0] : Array.isArray(site.image) ? site.image[0] : site.image) || undefined} alt={site.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                    <FavoriteButton siteId={site.id} className="absolute right-3 top-3 z-10" />
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <Badge className="mb-2 w-fit border border-amber-400/30 bg-amber-500/10 text-amber-300">{normalizeCategory(site.category)}</Badge>
                    <CardTitle className="font-heading luxury-heading text-lg group-hover:text-amber-200">{site.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0"><p className="flex items-center gap-1.5 text-xs text-zinc-500"><MapPin className="h-3.5 w-3.5 text-amber-500" />{site.city || site.location}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">{site.details}</p></CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
