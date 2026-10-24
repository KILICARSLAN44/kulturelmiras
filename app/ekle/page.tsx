'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImagePlus, Landmark, LoaderCircle, MapPin, Plus, Sparkles, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { categories } from '@/lib/categories'

export default function AddSitePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [imageInputs, setImageInputs] = useState([''])
  const [highlightInputs, setHighlightInputs] = useState([''])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title')).trim()
    const slug = title
      .toLocaleLowerCase('tr-TR')
      .replace(/ı/g, 'i')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const imageUrls = formData.getAll('image')
      .map((value) => String(value).trim())
      .filter(Boolean)
    const highlights = formData.getAll('highlight')
      .map((value) => String(value).trim())
      .filter(Boolean)
    const newSite = {
      id: `${slug || 'eser'}-${Date.now()}`,
      title,
      category: String(formData.get('category')),
      location: String(formData.get('location') ?? '').trim(),
      period: String(formData.get('period')).trim(),
      details: String(formData.get('details')).trim(),
      contributor_name: String(formData.get('contributor_name') ?? '').trim(),
      image: imageUrls,
      highlights,
      is_approved: false,
    }

    const { error } = await supabase.from('eserler').insert(newSite)

    if (error) {
      setErrorMessage('Eser kaydedilemedi. Bilgileri kontrol edip tekrar deneyin.')
      setIsSubmitting(false)
      return
    }

    setSuccessMessage('Eseriniz incelemeye alındı, admin onayından sonra yayınlanacaktır.')
    form.reset()
    setImageInputs([''])
    setHighlightInputs([''])
    setIsSubmitting(false)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 font-[family-name:var(--font-geist-sans)] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(217,119,6,0.12),transparent)]" />

      <header className="relative z-10 border-b border-zinc-800/80 bg-zinc-950/75 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300">
            <Landmark className="h-5 w-5" />
            <span className="text-lg font-bold tracking-wide">MİRAS</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-zinc-100">
            <ArrowLeft className="h-4 w-4" />
            Ana sayfa
          </Link>
        </div>
      </header>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-10 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:py-20">
        <section className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            <Sparkles className="h-4 w-4" /> Kolektif arşiv
          </div>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl">
            Bir mirasın izini <span className="text-amber-400">geleceğe</span> bırakın.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">
            Kültürel değer taşıyan eserin bilgilerini arşive ekleyin. Her kayıt, ortak hafızamızı biraz daha görünür kılar.
          </p>
          <div className="mt-10 hidden border-l border-amber-500/40 pl-5 text-sm leading-6 text-zinc-500 lg:block">
            <p className="text-zinc-300">Kayda başlamadan önce</p>
            <p className="mt-1">Eserin adını, bulunduğu yeri ve dönemini doğrulayın. Görsel için doğrudan erişilebilir bir bağlantı kullanın.</p>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7 border-b border-zinc-800 pb-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Yeni kayıt</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-100">Eser bilgileri</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-zinc-300">Eser adı</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={120}
                placeholder="Örn. Sümela Manastırı"
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-medium text-zinc-300">Kategori</label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3.5 text-sm text-zinc-100 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                >
                  <option value="" disabled>Kategori seçin</option>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="period" className="mb-2 block text-sm font-medium text-zinc-300">Dönem</label>
                <input
                  id="period"
                  name="period"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Örn. 4. yüzyıl"
                  className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="mb-2 block text-sm font-medium text-zinc-300">Konum</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  maxLength={160}
                  placeholder="İl, ilçe veya bölge"
                  className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 pl-10 pr-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">💡 Not: Somut olmayan kültürel miraslar (efsane, mani, gelenek vb.) için konum alanını boş bırakabilirsiniz.</p>
            </div>

            <div>
              <label htmlFor="details" className="mb-2 block text-sm font-medium text-zinc-300">Tarihçe ve açıklama</label>
              <textarea
                id="details"
                name="details"
                required
                rows={5}
                maxLength={3000}
                placeholder="Eserin tarihini, özelliklerini ve kültürel önemini anlatın..."
                className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3.5 py-3 text-sm leading-6 text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label htmlFor="contributor_name" className="mb-2 block text-sm font-medium text-zinc-300">Katkıda Bulunan / Ekleyen İsmi</label>
              <input
                id="contributor_name"
                name="contributor_name"
                type="text"
                maxLength={120}
                placeholder="İsim veya kullanıcı adı"
                className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <p className="mt-2 text-xs text-zinc-500">💡 Not: Buraya yazacağınız isim veya kullanıcı adı, eser onaylandıktan sonra detay sayfasında katkıda bulunan olarak görüntülenecektir.</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-zinc-300">Görsel bağlantıları</label>
                <button
                  type="button"
                  onClick={() => setImageInputs((current) => [...current, ''])}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 transition-colors hover:text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Görsel Ekle
                </button>
              </div>
              <div className="space-y-3">
                {imageInputs.map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1">
                      <ImagePlus className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                      <input
                        id={index === 0 ? 'image' : `image-${index}`}
                        name="image"
                        type="url"
                        value={imageInputs[index]}
                        onChange={(event) => setImageInputs((current) => current.map((value, inputIndex) => inputIndex === index ? event.target.value : value))}
                        placeholder="https://ornek.com/gorsel.jpg"
                        className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 pl-10 pr-3.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                    {imageInputs.length > 1 && (
                      <button
                        type="button"
                        aria-label={`${index + 1}. görseli kaldır`}
                        onClick={() => setImageInputs((current) => current.filter((_, inputIndex) => inputIndex !== index))}
                        className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-zinc-500">İlk görsel ana fotoğraf olarak kullanılacaktır.</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-zinc-300">Mimari Özellikler / Öne Çıkan Detaylar</label>
                <button
                  type="button"
                  onClick={() => setHighlightInputs((current) => [...current, ''])}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 transition-colors hover:text-amber-300"
                >
                  <Plus className="h-3.5 w-3.5" /> Madde Ekle
                </button>
              </div>
              <div className="space-y-3">
                {highlightInputs.map((value, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <textarea
                      id={`highlight-${index}`}
                      name="highlight"
                      value={value}
                      onChange={(event) => setHighlightInputs((current) => current.map((item, inputIndex) => inputIndex === index ? event.target.value : item))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                          event.preventDefault()
                          setHighlightInputs((current) => current.length - 1 === index ? [...current, ''] : current)
                        }
                      }}
                      rows={2}
                      maxLength={500}
                      placeholder={`${index + 1}. özellik veya detay`}
                      className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 px-3.5 py-3 text-sm leading-6 text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                    {highlightInputs.length > 1 && (
                      <button
                        type="button"
                        aria-label={`${index + 1}. özelliği kaldır`}
                        onClick={() => setHighlightInputs((current) => current.filter((_, inputIndex) => inputIndex !== index))}
                        className="mt-1 rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-zinc-500">Her madde ayrı bir kart olarak gösterilecektir.</p>
            </div>

            {errorMessage && (
              <p role="alert" className="rounded-md border border-red-900/80 bg-red-950/40 px-3.5 py-3 text-sm text-red-300">
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p role="status" className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3.5 py-3 text-sm text-amber-200">
                {successMessage}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="py-2 text-center text-sm text-zinc-400 transition-colors hover:text-zinc-100">
                Vazgeç
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber-500 px-5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Kaydediliyor...' : 'Eseri arşive ekle'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}