'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Landmark, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export function SiteHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-amber-500" />
          <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-xl font-bold tracking-tight text-transparent">MİRAS</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-400 md:flex">
          <Link href="/" className="text-zinc-100 transition-colors hover:text-amber-400">Ana Sayfa</Link>
          <a href="#kesfet" className="transition-colors hover:text-amber-400">Keşfet</a>
          <a href="#harita" className="transition-colors hover:text-amber-400">Harita</a>
          <a href="#arsiv" className="transition-colors hover:text-amber-400">Arşiv</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/ekle"
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-950/20 transition-all hover:bg-amber-400 hover:shadow-amber-500/20"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Eser Ekle</span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/admin" className="rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">Admin Paneli</Link>
              <button type="button" onClick={handleSignOut} className="rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white">Giriş Yap</Link>
              <Link href="/login?mode=signup" className="rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-500">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
