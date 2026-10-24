import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, Landmark, MapPin, Navigation, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import { SiteGallery } from '@/components/site-gallery'
import { getSectionTitle, normalizeCategory } from '@/lib/categories'

const physicalLocationCategories = new Set([
  'Mimari ve Tarihi Yapılar',
  'Arkeolojik Alan ve Antik Şehirler',
  'Doğal ve Kültürel Peyzajlar',
])

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: site } = await supabase
    .from('eserler')
    .select('*')
    .eq('id', id)
    .eq('is_approved', true)
    .single()

  if (!site) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 text-center text-zinc-100">
        <Landmark className="mb-5 h-8 w-8 text-amber-500" />
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Miras arşivi</p>
        <h1 className="mb-2 text-2xl font-semibold">Eser bulunamadı</h1>
        <p className="mb-6 max-w-sm text-sm leading-6 text-zinc-400">Aradığınız eser arşivde yer almıyor veya bağlantı artık geçerli değil.</p>
        <Link href="/">
          <Button className="bg-amber-500 font-medium text-zinc-950 hover:bg-amber-400">Ana sayfaya dön</Button>
        </Link>
      </main>
    )
  }

  const highlightsList = (Array.isArray(site.highlights) ? site.highlights : [site.highlights])
    .flatMap((item: unknown) => {
      if (typeof item !== 'string') {
        return item == null ? [] : [JSON.stringify(item)]
      }

      return item
        .split(/\r?\n/)
        .map((highlight) => highlight.trim())
        .filter(Boolean)
    })
  const location = typeof site.location === 'string' ? site.location.trim() : ''
  const mapQuery = encodeURIComponent(`${site.title ?? ''}, ${location}`)
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
  const imageUrls = (Array.isArray(site.image_urls) ? site.image_urls : Array.isArray(site.image) ? site.image : site.image ? [site.image] : [])
    .filter((imageUrl: unknown): imageUrl is string => typeof imageUrl === 'string' && imageUrl.trim().length > 0)
  const category = normalizeCategory(site.category)
  const sectionTitle = getSectionTitle(category)
  const hasLocation = location.length > 0
  const hasPhysicalLocation = physicalLocationCategories.has(category)

  return (
    <div className="min-h-screen bg-zinc-950 font-[family-name:var(--font-geist-sans)] text-zinc-100 selection:bg-amber-500/30 selection:text-amber-200">
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-200 transition-colors hover:text-amber-400">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Miras arşivi</span>
            <span className="sm:hidden">Geri</span>
          </Link>
          <div className="flex items-center gap-2 text-amber-400">
            <Landmark className="h-5 w-5" />
            <span className="text-sm font-bold tracking-[0.12em]">MİRAS</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <section className="pb-8 pt-8 sm:pb-10 sm:pt-12">
          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="transition-colors hover:text-zinc-200">Arşiv</Link>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-400">{category}</span>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-300">
                {category}
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">{site.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
                {hasLocation && <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-500" />{location}</span>}
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-500" />{site.period}</span>
              </div>
            </div>
            {hasLocation && <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
            >
              <Navigation className="h-4 w-4" /> Haritada görüntüle <ArrowUpRight className="h-3.5 w-3.5" />
            </a>}
          </div>
        </section>

        <SiteGallery title={site.title} imageUrls={imageUrls} />

        <nav aria-label="Sayfa bölümleri" className="mt-6 flex gap-5 overflow-x-auto border-b border-zinc-800 text-sm">
          <a href="#tarihce" className="shrink-0 border-b-2 border-amber-500 pb-3 font-medium text-amber-300">Tarihçe</a>
          <a href="#ozellikler" className="shrink-0 border-b-2 border-transparent pb-3 text-zinc-400 transition-colors hover:text-zinc-100">{sectionTitle}</a>
          {hasLocation && <a href="#ziyaret" className="shrink-0 border-b-2 border-transparent pb-3 text-zinc-400 transition-colors hover:text-zinc-100">Ziyaret / Konum</a>}
        </nav>

        <div className="grid grid-cols-1 gap-10 py-9 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-14">
          <article className="min-w-0">
            <section id="tarihce" className="scroll-mt-24 border-b border-zinc-800 pb-9">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-xs font-semibold tabular-nums text-amber-500">01</span>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-100 sm:text-2xl">
                  <BookOpen className="h-5 w-5 text-amber-500" /> Tarihçe
                </h2>
              </div>
              <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-zinc-300">{site.details}</p>
            </section>

            <section id="ozellikler" className="scroll-mt-24 border-b border-zinc-800 py-9">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-xs font-semibold tabular-nums text-amber-500">02</span>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-100 sm:text-2xl">
                  <Sparkles className="h-5 w-5 text-amber-500" /> {sectionTitle}
                </h2>
              </div>
              <div className="pl-4 sm:pl-6 lg:pl-8">
                {highlightsList.length > 0 ? (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {highlightsList.map((item: string, index: number) => (
                      <li key={`${index}-${item}`} className="flex items-start gap-3 border-l border-amber-500/50 bg-zinc-900/60 px-4 py-3.5 text-sm leading-6 text-zinc-300">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-7 text-zinc-500">Bu eser için ayrıca kaydedilmiş özellik bilgisi bulunmuyor.</p>
                )}
              </div>
            </section>

            {hasLocation && <section id="ziyaret" className="scroll-mt-24 py-9">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-xs font-semibold tabular-nums text-amber-500">03</span>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-100 sm:text-2xl">
                  <MapPin className="h-5 w-5 text-amber-500" /> Ziyaret / Konum
                </h2>
              </div>
              {hasPhysicalLocation ? (
                <Card className="overflow-hidden rounded-md border-zinc-800 bg-zinc-900/60">
                  <div className="relative flex min-h-44 items-center justify-center overflow-hidden bg-[linear-gradient(rgba(161,161,170,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.08)_1px,transparent_1px)] bg-[size:28px_28px]">
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.12),transparent_65%)]" />
                    <div className="relative flex flex-col items-center gap-2 text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-950/40">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <span className="max-w-sm px-4 text-sm font-medium text-zinc-200">{location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-zinc-500">Eserin kayıtlı konumu</p>
                      <p className="mt-1 text-sm text-zinc-200">{location}</p>
                    </div>
                    <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300">
                      Harita uygulamasında aç <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </Card>
              ) : (
                <Card className="border-zinc-800 bg-zinc-900/60 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-300">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">Coğrafi Yayılım / Köken</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{location}</p>
                    </div>
                  </div>
                </Card>
              )}
            </section>}
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden rounded-md border-zinc-800 bg-zinc-900/70">
              <div className="border-b border-zinc-800 bg-zinc-900 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400">Koleksiyon kaydı</p>
                <h2 className="mt-1.5 text-lg font-semibold text-zinc-100">Eser kimliği</h2>
              </div>
              <dl className="divide-y divide-zinc-800/80 px-5">
                <div className="py-4">
                  <dt className="text-xs text-zinc-500">Eser adı</dt>
                  <dd className="mt-1 break-words text-sm font-medium text-zinc-100">{site.title}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs text-zinc-500">Kategori</dt>
                  <dd className="mt-1 text-sm text-zinc-200">{category}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs text-zinc-500">Dönem</dt>
                  <dd className="mt-1 text-sm text-zinc-200">{site.period}</dd>
                </div>
                {hasLocation && <div className="py-4">
                  <dt className="text-xs text-zinc-500">Konum</dt>
                  <dd className="mt-1 text-sm leading-6 text-zinc-200">{location}</dd>
                </div>}
                {site.contributor_name && (
                  <div className="py-4">
                    <dt className="text-xs text-zinc-500">Katkıda Bulunan</dt>
                    <dd className="mt-1 text-sm text-zinc-200">{site.contributor_name}</dd>
                  </div>
                )}
                <div className="py-4">
                  <dt className="inline-flex items-center gap-1.5 text-xs text-zinc-500"><Landmark className="h-3.5 w-3.5" /> Arşiv numarası</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-zinc-400">{site.id}</dd>
                </div>
              </dl>
              {hasLocation && <div className="border-t border-zinc-800 p-5">
                <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400">
                  <MapPin className="h-4 w-4" /> Konumu keşfet
                </a>
              </div>}
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}