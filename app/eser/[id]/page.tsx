import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, Image as ImageIcon, Landmark, MapPin, Navigation, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: site } = await supabase
    .from('eserler')
    .select('*')
    .eq('id', id)
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

  const highlightsList = Array.isArray(site.highlights)
    ? site.highlights.map((item: unknown) => typeof item === 'string' ? item : JSON.stringify(item))
    : []
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.location ?? '')}`

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
            <span className="text-zinc-400">{site.category}</span>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-4xl">
              <Badge variant="outline" className="mb-4 border-amber-500/30 bg-amber-500/10 text-amber-300">
                {site.category}
              </Badge>
              <h1 className="text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">{site.title}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-500" />{site.location}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4 text-amber-500" />{site.period}</span>
              </div>
            </div>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
            >
              <Navigation className="h-4 w-4" /> Haritada görüntüle <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        <section aria-label={`${site.title} görsel galerisi`} className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
          {site.image ? (
            <img src={site.image} alt={site.title} className="h-[42vh] min-h-72 w-full object-cover sm:h-[58vh]" />
          ) : (
            <div className="flex h-[42vh] min-h-72 w-full items-center justify-center bg-zinc-900 sm:h-[58vh]">
              <ImageIcon className="h-12 w-12 text-zinc-700" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-5 sm:left-6 sm:right-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">Arşiv görseli</p>
              <p className="mt-1 text-sm text-zinc-100">{site.title}</p>
            </div>
            <span className="rounded-sm border border-white/20 bg-black/40 px-2.5 py-1 text-xs text-zinc-200 backdrop-blur-sm">01 / 01</span>
          </div>
        </section>

        <nav aria-label="Sayfa bölümleri" className="mt-6 flex gap-5 overflow-x-auto border-b border-zinc-800 text-sm">
          <a href="#tarihce" className="shrink-0 border-b-2 border-amber-500 pb-3 font-medium text-amber-300">Tarihçe</a>
          <a href="#ozellikler" className="shrink-0 border-b-2 border-transparent pb-3 text-zinc-400 transition-colors hover:text-zinc-100">Mimari / Özellikler</a>
          <a href="#ziyaret" className="shrink-0 border-b-2 border-transparent pb-3 text-zinc-400 transition-colors hover:text-zinc-100">Ziyaret / Konum</a>
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
                  <Sparkles className="h-5 w-5 text-amber-500" /> Mimari / Özellikler
                </h2>
              </div>
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
                <p className="text-sm leading-7 text-zinc-500">Bu eser için ayrıca kaydedilmiş mimari veya özellik bilgisi bulunmuyor.</p>
              )}
            </section>

            <section id="ziyaret" className="scroll-mt-24 py-9">
              <div className="mb-5 flex items-center gap-3">
                <span className="text-xs font-semibold tabular-nums text-amber-500">03</span>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-100 sm:text-2xl">
                  <MapPin className="h-5 w-5 text-amber-500" /> Ziyaret / Konum
                </h2>
              </div>
              <Card className="overflow-hidden rounded-md border-zinc-800 bg-zinc-900/60">
                <div className="relative flex min-h-44 items-center justify-center overflow-hidden bg-[linear-gradient(rgba(161,161,170,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(161,161,170,0.08)_1px,transparent_1px)] bg-[size:28px_28px]">
                  <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.12),transparent_65%)]" />
                  <div className="relative flex flex-col items-center gap-2 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-950/40">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="max-w-sm px-4 text-sm font-medium text-zinc-200">{site.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 border-t border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">Eserin kayıtlı konumu</p>
                    <p className="mt-1 text-sm text-zinc-200">{site.location}</p>
                  </div>
                  <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300">
                    Harita uygulamasında aç <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            </section>
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
                  <dd className="mt-1 text-sm text-zinc-200">{site.category}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs text-zinc-500">Dönem</dt>
                  <dd className="mt-1 text-sm text-zinc-200">{site.period}</dd>
                </div>
                <div className="py-4">
                  <dt className="text-xs text-zinc-500">Konum</dt>
                  <dd className="mt-1 text-sm leading-6 text-zinc-200">{site.location}</dd>
                </div>
                <div className="py-4">
                  <dt className="inline-flex items-center gap-1.5 text-xs text-zinc-500"><Landmark className="h-3.5 w-3.5" /> Arşiv numarası</dt>
                  <dd className="mt-1 break-all font-mono text-xs text-zinc-400">{site.id}</dd>
                </div>
              </dl>
              <div className="border-t border-zinc-800 p-5">
                <a href={mapUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400">
                  <MapPin className="h-4 w-4" /> Konumu keşfet
                </a>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}