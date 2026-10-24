'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setMessage('')

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })

    if (result.error) {
      setError(result.error.message)
    } else if (isSignUp && !result.data.session) {
      setMessage('Kayıt başarılı. Devam etmek için e-posta adresinizi doğrulayın.')
    } else {
      router.push('/admin')
      router.refresh()
    }
    setIsSubmitting(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-zinc-100">
      <section className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl sm:p-8">
        <Link href="/" className="text-sm text-amber-400 hover:text-amber-300">MİRAS</Link>
        <h1 className="mt-5 text-2xl font-semibold">{isSignUp ? 'Hesap oluştur' : 'Giriş yap'}</h1>
        <p className="mt-2 text-sm text-zinc-400">{isSignUp ? 'Kültürel miras arşivine katkıda bulunun.' : 'Yönetim paneline devam edin.'}</p>
        <div className="mt-6 grid grid-cols-2 rounded-md bg-zinc-950 p-1 text-sm">
          <button type="button" onClick={() => setIsSignUp(false)} className={`rounded px-3 py-2 ${!isSignUp ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Giriş Yap</button>
          <button type="button" onClick={() => setIsSignUp(true)} className={`rounded px-3 py-2 ${isSignUp ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Kayıt Ol</button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="E-posta" className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-amber-500" />
          <input type="password" required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifre (en az 6 karakter)" className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-amber-500" />
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          {message && <p role="status" className="text-sm text-amber-300">{message}</p>}
          <button disabled={isSubmitting} className="h-11 w-full rounded-md bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400 disabled:opacity-60">{isSubmitting ? 'Bekleyin...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}</button>
        </form>
      </section>
    </main>
  )
}
