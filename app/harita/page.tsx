'use client'

import { useCallback, useEffect, useState } from 'react'
import { MapPinned } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SplashScreen } from '@/components/SplashScreen'
import { TurkeyMap } from '@/components/TurkeyMap'
import { supabase } from '@/lib/supabase/client'

type Site = {
  id: string
  title: string
  category: string
  city?: string | null
  location: string
  period: string
  details: string
  image?: string | string[] | null
  image_urls?: string[] | null
}

export default function MapPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [sites, setSites] = useState<Site[]>([])
  const handleSplashComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    async function fetchSites() {
      const { data, error } = await supabase
        .from('eserler')
        .select('*')
        .eq('is_approved', true)

      if (error) {
        console.error('Harita verileri çekilirken hata oluştu:', error)
        return
      }

      if (data) setSites(data)
    }

    fetchSites()
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      {isLoading && <SplashScreen onComplete={handleSplashComplete} />}
      <SiteHeader />

      <main className="min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-[radial-gradient(ellipse_90%_50%_at_50%_0%,rgba(245,158,11,0.08),transparent_60%)]">
        <section className="relative overflow-hidden px-4 pb-2 pt-16 sm:px-6 md:pt-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(217,119,6,0.18),transparent)]" />
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
              <MapPinned className="h-4 w-4" aria-hidden="true" />
              Türkiye kültür atlası
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100 md:text-6xl">
              Mirası <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">harita üzerinden</span> keşfedin
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
              Eser bulunan illeri görün, bir şehri seçin ve o bölgedeki kültürel miras kayıtlarını keşfedin.
            </p>
          </div>
        </section>

        <div className="w-full">
          <TurkeyMap sites={sites} />
        </div>
      </main>
    </div>
  )
}
