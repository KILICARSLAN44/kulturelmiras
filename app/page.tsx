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

type Site = {
  id: string
  title: string
  category: string
  city?: string | null
  location: string
  period: string
  era?: string | null
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
  const [selectedEra, setSelectedEra] = useState<string>('Tümü')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categoryFilters = ['Tümü', ...categories]
  const eraFilters = ['Tümü', 'Antik Çağ', 'Selçuklu', 'Osmanlı', 'Cumhuriyet Dönemi', 'Yakın Tarih']
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
    const periodValue = `${site.era ?? ''} ${site.period ?? ''}`.toLocaleLowerCase('tr-TR')
    const eraTerms: Record<string, string[]> = {
      'Antik Çağ': ['antik', 'roma', 'bizans', 'hitit', 'frig', 'lidya', 'urartu', 'helen', 'klasik'],
      Selçuklu: ['selçuk'],
      Osmanlı: ['osmanlı', 'ottoman'],
      'Cumhuriyet Dönemi': ['cumhuriyet'],
      'Yakın Tarih': ['yakın tarih', 'modern', '19.', '20.', '21.'],
    }
    const matchesEra = selectedEra === 'Tümü' || (eraTerms[selectedEra] ?? []).some((term) => periodValue.includes(term))
    const matchesSearch = site.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          site.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          periodValue.includes(searchQuery.toLocaleLowerCase('tr-TR'))
    return matchesCategory && matchesEra && matchesSearch
  })

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {isLoading && <SplashScreen onComplete={handleSplashComplete} />}
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))]" />
        
        <div className="mx-auto max-w-6xl space-y-6 rounded-[2rem] border border-white/10 bg-zinc-950/35 px-4 py-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_70px_rgba(2,6,23,0.2)] backdrop-blur-xl sm:px-8 md:py-12">
          <Badge variant="outline" className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
            🏛️ TÜRKİYE KÜLTÜREL MİRAS ARŞİVİ
          </Badge>
          
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-100 md:text-6xl">
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
            <div className="overflow-hidden rounded-2xl border border-amber-500/20 bg-zinc-900/60 px-1 shadow-[0_16px_34px_rgba(2,6,23,0.2)] backdrop-blur-md">
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
          <div className="pt-2 text-left">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">Tarihsel Dönemler</p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-amber-500/15 bg-zinc-900/30 p-2 backdrop-blur-md">
              {eraFilters.map((era) => (
                <button
                  key={era}
                  type="button"
                  onClick={() => setSelectedEra(era)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                    selectedEra === era
                      ? 'border-amber-500/60 bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
                      : 'border-zinc-700/80 bg-zinc-950/40 text-zinc-300 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-200'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Öne Çıkan Miras Kartları */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <NearbySites sites={sites} />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
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

        <Link
          href="/harita"
          className="group mb-8 flex items-center justify-between gap-5 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-zinc-900/50 to-zinc-900/30 p-5 shadow-[0_18px_40px_rgba(245,158,11,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-amber-500/10 sm:p-6"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
              <MapPinned className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">Kültür atlası</p>
              <p className="mt-1 text-sm text-zinc-300 sm:text-base">Türkiye&apos;nin mirasını harita üzerinde keşfedin.</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition-transform group-hover:translate-x-1 sm:inline-flex">
            Haritada Keşfet
          </span>
        </Link>

        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            Veriler veritabanından yükleniyor...
          </div>
        ) : filteredSites.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
            <Filter className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-base">Aramanıza veya seçtiğiniz kategoriye uygun eser bulunamadı.</p>
            <Button
              onClick={() => { setSelectedCategory('Tümü'); setSelectedEra('Tümü'); setSearchQuery(''); }}
              variant="link"
              className="text-amber-500 hover:text-amber-400 text-sm mt-1"
            >
              Filtreleri Sıfırla
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSites.map((site) => (
              <Link key={site.id} href={`/eser/${site.id}`} className="group block h-full">
                <Card className="h-full cursor-pointer overflow-hidden border border-zinc-800 bg-zinc-900/50 text-zinc-100 shadow-none backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/10">
                  <div className="relative isolate h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/15 to-transparent opacity-70" />
                    <img
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
                      <span className="text-zinc-600">•</span>
                      <span>{site.period}</span>
                    </div>
                    <CardTitle className="text-lg font-semibold text-zinc-100 transition-colors duration-300 group-hover:text-amber-300">
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
            ))}
          </div>
        )}
      </section>
    </div>
  )
}