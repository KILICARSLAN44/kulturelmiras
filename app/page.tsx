'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, MapPin, Sparkles, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { categories, normalizeCategory } from '@/lib/categories'
import { SiteHeader } from '@/components/site-header'

type Site = {
  id: string
  title: string
  category: string
  location: string
  period: string
  details: string
  image?: string | string[] | null
  image_urls?: string[] | null
}

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categoryFilters = ['Tümü', ...categories]

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-28 md:pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-400 px-4 py-1 rounded-full text-xs tracking-wide uppercase font-semibold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Canlı Supabase Veritabanı
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Tarihi ve Kültürel Mirasımızı <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Geleceğe Taşıyoruz
            </span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-normal">
            Asırlık medeniyetlerin izlerini, mimari eserlerini ve sözlü kültür mirasını dijital dünyada keşfedin ve koruyun.
          </p>

          {/* Dinamik Arama Çubuğu */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Eser, antik kent veya bölge ara..."
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl py-4 pl-12 pr-10 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm shadow-xl"
              />
            </div>
          </div>

          {/* Kategori Filtre Butonları */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categoryFilters.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs py-1.5 h-auto rounded-lg transition-all"
                    : "border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs py-1.5 h-auto rounded-lg transition-all"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Miras Kartları */}
      <section className="max-w-7xl mx-auto px-6 py-8">
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

        {loading ? (
          <div className="text-center py-16 text-zinc-500 text-sm">
            Veriler veritabanından yükleniyor...
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
            {filteredSites.map((site) => (
              <Link key={site.id} href={`/eser/${site.id}`}>
                <Card className="bg-zinc-900/60 border-zinc-800/80 overflow-hidden hover:border-amber-500/40 transition-all group duration-300 flex flex-col justify-between cursor-pointer h-full">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={(Array.isArray(site.image_urls) ? site.image_urls[0] : Array.isArray(site.image) ? site.image[0] : site.image) || undefined}
                        alt={site.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-amber-400 border-zinc-800 text-xs">
                        {normalizeCategory(site.category)}
                      </Badge>
                    </div>
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{site.location}</span>
                        <span className="mx-1">•</span>
                        <span>{site.period}</span>
                      </div>
                      <CardTitle className="text-lg font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {site.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 pt-0">
                      <CardDescription className="text-zinc-400 text-sm line-clamp-2">
                        {site.details}
                      </CardDescription>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}