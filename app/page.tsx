'use client'

import React, { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Filter, MapPinned } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { categories, normalizeCategory } from '@/lib/categories'
import { SiteHeader } from '@/components/site-header'
import { SplashScreen } from '@/components/SplashScreen'
import { FavoriteButton } from '@/components/favorite-button'
import { VoiceSearchInput } from '@/components/voice-search-input'
import { NearbySites } from '@/components/nearby-sites'
import { CulturalImage } from '@/components/cultural-image'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SpotlightCard } from '@/components/spotlight-card'

type Site = {
  id: string
  title: string
  category: string
  city?: string | null
  location: string
  details: string
  latitude?: number | string | null
  longitude?: number | string | null
  image?: string | string[] | null
  image_urls?: string[] | null
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categoryFilters = ['Tümü', ...categories]
  const hasActiveDiscoveryFilter = searchQuery.trim() !== '' || selectedCategory !== 'Tümü'
  const handleSplashComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Supabase'den verileri çekme
  useEffect(() => {
    async function fetchSites() {
      setLoading(true)
      const { data, error } = await supabase.from('eserler').select('*').eq('is_approved', true)
      if (error) {
        console.error('Veri çekilirken hata oluştu:', error)
      } else if (data) {
        setSites(data)
      }
      setLoading(false)
    }
    fetchSites()
  }, [])

  // Filtreleme mantığı
  const filteredSites = sites.filter(site => {
    const normalizedCategory = normalizeCategory(site.category)
    const matchesCategory = selectedCategory === 'Tümü' || normalizedCategory === selectedCategory
    const matchesSearch = site.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.details?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const siteSkeletons = Array.from({ length: 8 })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {isLoading && <SplashScreen onComplete={handleSplashComplete} />}
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-zinc-950 to-zinc-950 px-6 pb-12 pt-20 md:pb-16 md:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))]" />
        
        <SpotlightCard className="mx-auto max-w-6xl rounded-[2rem]">
          <div className="relative space-y-6 rounded-[2rem] border border-white/10 bg-zinc-950/35 px-4 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_70px_rgba(2,6,23,0.2)] backdrop-blur-xl sm:px-8 md:py-12">
          <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
            🏛️ TÜRKİYE KÜLTÜREL MİRAS ARŞİVİ
          </Badge>
          
          <h1 className="luxury-heading text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Tarihi ve{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Kültürel Mirasımızı
            </span>{' '}
            <br className="hidden md:block" />
            geleceğe taşıyoruz
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg font-normal leading-8 text-zinc-300/85 md:text-xl">
            Asırlık medeniyetlerin izlerini, mimari eserlerini ve sözlü kültür mirasını dijital dünyada keşfedin ve koruyun.
          </p>

          {/* Dinamik Arama Çubuğu */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-1 shadow-[0_16px_34px_rgba(2,6,23,0.2)] backdrop-blur-xl transition-all duration-300 focus-within:border-amber-500/40 focus-within:shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]">
              <VoiceSearchInput value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="no-scrollbar flex flex-nowrap items-center justify-start gap-3 overflow-x-auto rounded-2xl border border-white/8 bg-zinc-900/30 p-3 backdrop-blur-md sm:flex-wrap sm:justify-center">
            {categoryFilters.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={
                  selectedCategory === category
                    ? "rounded-full px-3.5 font-semibold text-[11px] uppercase tracking-[0.12em]"
                    : "rounded-full px-3.5 text-[11px] uppercase tracking-[0.12em] text-zinc-300"
                }
              >
                {category}
              </Button>
            ))}
          </div>
          </div>
        </SpotlightCard>
      </section>

      {/* Öne Çıkan Miras Kartları */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {!hasActiveDiscoveryFilter && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <NearbySites sites={sites} className="mb-0" />
            <Link
              href="/harita"
              className="group flex items-center justify-between gap-4 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-zinc-900/50 to-zinc-900/30 p-4 shadow-[0_18px_40px_rgba(245,158,11,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-amber-500/10 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
                  <MapPinned className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">Kültür atlası</p>
                  <p className="mt-1 text-sm text-zinc-300">Türkiye&apos;nin mirasını haritada keşfedin.</p>
                </div>
              </div>
              <span className="hidden shrink-0 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-transform group-hover:translate-x-1 sm:inline-flex">
                Haritada Keşfet
              </span>
            </Link>
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="luxury-heading text-2xl font-bold flex items-center gap-2">
              Öne Çıkan Eserler
              {selectedCategory !== 'Tümü' && (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                  {selectedCategory}
                </Badge>
              )}
            </h2>
            <p className="text-sm text-zinc-400">Tarihe yön vermiş popüler miras alanları</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4" aria-label="Eserler yükleniyor" role="status">
            {siteSkeletons.map((_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-[0_14px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                <div className="skeleton-shimmer h-48" />
                <div className="space-y-3 p-5">
                  <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
                  <div className="skeleton-shimmer h-6 w-5/6 rounded-lg" />
                  <div className="skeleton-shimmer h-4 w-full rounded-full" />
                  <div className="skeleton-shimmer h-4 w-4/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-base">Aramanıza veya seçtiğiniz kategoriye uygun eser bulunamadı.</p>
            <Button
              onClick={() => { setSelectedCategory('Tümü'); setSearchQuery(''); }}
              variant="link"
              className="text-amber-500 hover:text-amber-400 text-sm mt-1"
            >
              Filtreleri Sıfırla
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSites.map((site, index) => (
              <ScrollReveal key={site.id} delay={(index % 4) * 65} className="h-full">
                <SpotlightCard className="h-full rounded-2xl">
                  <Link href={`/eser/${site.id}`} className="group block h-full">
                    <Card className="h-full cursor-pointer overflow-hidden border border-zinc-800/80 bg-zinc-900/60 text-zinc-100 shadow-none backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-amber-500/40 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.15)]">
                  <div className="relative isolate h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/15 to-transparent opacity-70" />
                    <CulturalImage
                      src={(Array.isArray(site.image_urls) ? site.image_urls[0] : Array.isArray(site.image) ? site.image[0] : site.image) || undefined}
                      alt={site.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <Badge className="absolute left-3 top-3 border border-amber-400/30 bg-zinc-950/70 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-300 backdrop-blur-md">
                      {normalizeCategory(site.category)}
                    </Badge>
                    <FavoriteButton siteId={site.id} className="absolute right-3 top-3 z-10" />
                  </div>

                  <CardHeader className="p-5 pb-2">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-amber-400">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {site.city || site.location}
                      </span>
                    </div>
                    <CardTitle className="font-heading luxury-heading text-lg font-semibold transition-colors duration-300 group-hover:text-amber-200">
                      {site.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 pt-0">
                    <CardDescription className="line-clamp-2 text-sm leading-6 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
                      {site.details}
                    </CardDescription>
                  </CardContent>
                    </Card>
                  </Link>
                </SpotlightCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}