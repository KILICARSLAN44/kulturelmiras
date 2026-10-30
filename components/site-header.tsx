'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dices, Heart, Menu, Plus, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function SiteHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRandomLoading, setIsRandomLoading] = useState(false)
  const [randomError, setRandomError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setIsAuthenticated(Boolean(data.session))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session))
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Çıkış yapılırken hata oluştu:', error)
      return
    }
    setIsAuthenticated(false)
  }

  async function handleRandomSite() {
    if (isRandomLoading) return

    setIsRandomLoading(true)
    setRandomError(null)
    const { data, error } = await supabase
      .from('eserler')
      .select('id')
      .eq('is_approved', true)

    if (error) {
      console.error('Rastgele eser alınırken hata oluştu:', error)
      setRandomError('Rastgele eser yüklenemedi. Lütfen tekrar deneyin.')
      setIsRandomLoading(false)
      return
    }

    const ids = (data ?? [])
      .map((site) => site.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0)

    if (ids.length === 0) {
      setRandomError('Arşivde henüz keşfedilecek bir eser bulunmuyor.')
      setIsRandomLoading(false)
      return
    }

    const randomId = ids[Math.floor(Math.random() * ids.length)]
    setIsMenuOpen(false)
    router.push(`/eser/${encodeURIComponent(randomId)}`)
    setIsRandomLoading(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/icon.png"
            alt="Kültürel Miras Arşivi logosu"
            width={36}
            height={36}
            className="h-9 w-9 rounded-md"
            priority
          />
          <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-lg font-bold tracking-tight text-transparent sm:text-xl">
            KÜLTÜREL MİRAS
          </span>
        </Link>
        <nav className="hidden items-center gap-3 text-sm font-medium text-zinc-400 sm:flex md:gap-6">
          <Link href="/" className="whitespace-nowrap text-zinc-100 transition-colors hover:text-amber-400">Ana Sayfa</Link>
          <a href="#kesfet" className="whitespace-nowrap transition-colors hover:text-amber-400">Keşfet</a>
          <Link href="/harita" className="whitespace-nowrap transition-colors hover:text-amber-400">Harita</Link>
          <a href="#arsiv" className="whitespace-nowrap transition-colors hover:text-amber-400">Arşiv</a>
        </nav>
        <div className="hidden items-center gap-1 sm:flex md:gap-2">
          <Link href="/favorilerim" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/10 hover:text-amber-200">
            <Heart className="h-4 w-4" aria-hidden="true" />
            <span>Favorilerim</span>
          </Link>
          <button
            type="button"
            onClick={handleRandomSite}
            disabled={isRandomLoading}
            title={randomError ?? 'Rastgele bir eser keşfet'}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-amber-500/30 px-3 py-2 text-sm font-semibold text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-200 disabled:cursor-wait disabled:opacity-60"
          >
            <Dices className="h-4 w-4" aria-hidden="true" />
            <span>{isRandomLoading ? 'Eser aranıyor...' : 'Rastgele Eser'}</span>
          </button>
          <Link
            href="/ekle"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-950/20 transition-all hover:bg-amber-400 hover:shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Eser Ekle</span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/admin" className="whitespace-nowrap rounded-md px-2 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white md:px-3">Admin Paneli</Link>
              <button type="button" onClick={handleSignOut} className="whitespace-nowrap rounded-md px-2 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white md:px-3">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login" className="whitespace-nowrap rounded-md px-2 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white md:px-3">Giriş Yap</Link>
              <Link href="/login?mode=signup" className="whitespace-nowrap rounded-md bg-amber-600 px-2 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-500 md:px-3">Kayıt Ol</Link>
            </>
          )}
        </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white sm:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
      </div>
      {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-zinc-800/80 px-4 py-3 sm:hidden">
            <nav className="flex flex-col gap-1 text-sm font-medium text-zinc-300">
              <Link href="/" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 hover:text-white">Ana Sayfa</Link>
              <a href="#kesfet" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 hover:text-white">Keşfet</a>
              <Link href="/harita" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 hover:text-white">Harita</Link>
              <a href="#arsiv" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 hover:text-white">Arşiv</a>
              <div className="mt-2 flex flex-col gap-2 border-t border-zinc-800 pt-3">
                <Link href="/favorilerim" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center gap-2 rounded-md px-3 py-3 font-semibold text-amber-300 transition-colors hover:bg-amber-500/10 hover:text-amber-200">
                  <Heart className="h-4 w-4" aria-hidden="true" />
                  Favorilerim
                </Link>
                <button
                  type="button"
                  onClick={handleRandomSite}
                  disabled={isRandomLoading}
                  title={randomError ?? 'Rastgele bir eser keşfet'}
                  className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 px-3 py-3 text-left font-semibold text-amber-300 transition-colors hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-200 disabled:cursor-wait disabled:opacity-60"
                >
                  <Dices className="h-4 w-4" aria-hidden="true" />
                  {isRandomLoading ? 'Eser aranıyor...' : 'Rastgele Eser'}
                </button>
                <Link href="/ekle" onClick={() => setIsMenuOpen(false)} className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-400">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Eser Ekle
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 hover:text-white">Admin Paneli</Link>
                    <button type="button" onClick={handleSignOut} className="rounded-md px-3 py-3 text-left transition-colors hover:bg-zinc-800 hover:text-white">Çıkış Yap</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-zinc-800 hover:text-white">Giriş Yap</Link>
                    <Link href="/login?mode=signup" onClick={() => setIsMenuOpen(false)} className="rounded-md bg-amber-600 px-3 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-500">Kayıt Ol</Link>
                  </>
                )}
              </div>
            </nav>
            {randomError && <p className="sr-only" role="status">{randomError}</p>}
          </div>
      )}
    </header>
  )
}
