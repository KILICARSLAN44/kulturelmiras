'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, MapPin, X } from 'lucide-react'
import { turkeyProvinceShapes } from './turkey-map-shapes'

type HeritageSite = {
  id: string
  title: string
  city?: string | null
  location?: string | null
  details?: string | null
  period?: string | null
}

type TurkeyMapProps = {
  sites: HeritageSite[]
}

type TooltipState = {
  province: string
  count: number
  x: number
  y: number
} | null

const normalizeProvinceKey = (value: string | null | undefined) =>
  (value ?? '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/â/g, 'a')
    .replace(/ê/g, 'e')
    .replace(/û/g, 'u')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const provinceNameLookup = new Map(
  turkeyProvinceShapes.map((province) => [normalizeProvinceKey(province.city), province.city]),
)

function getProvinceNameFromSite(site: HeritageSite) {
  const candidates = [site.city, site.location]

  for (const candidate of candidates) {
    const raw = (candidate ?? '').split(',')[0].trim()
    if (!raw) continue

    const key = normalizeProvinceKey(raw)
    const matchedName = provinceNameLookup.get(key)
    if (matchedName) return matchedName

    const directMatch = turkeyProvinceShapes.find(
      (province) => normalizeProvinceKey(province.city) === key,
    )
    if (directMatch) return directMatch.city
  }

  return null
}

export function TurkeyMap({ sites }: TurkeyMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState>(null)
  const mapRef = useRef<HTMLDivElement | null>(null)

  const provinceGroups = useMemo(() => {
    const groups = new Map<string, HeritageSite[]>()

    for (const site of sites) {
      const provinceName = getProvinceNameFromSite(site)
      if (!provinceName) continue

      const key = normalizeProvinceKey(provinceName)
      const current = groups.get(key) ?? []
      current.push(site)
      groups.set(key, current)
    }

    return groups
  }, [sites])

  const provinceStats = useMemo(
    () =>
      turkeyProvinceShapes.map((province) => {
        const key = normalizeProvinceKey(province.city)
        return {
          ...province,
          count: provinceGroups.get(key)?.length ?? 0,
        }
      }),
    [provinceGroups],
  )

  const selectedProvinceSites = selectedProvince
    ? provinceGroups.get(normalizeProvinceKey(selectedProvince)) ?? []
    : []

  const activeProvince = hoveredProvince ?? selectedProvince

  const handleTooltipMove = (
    event: React.MouseEvent<SVGPathElement>,
    provinceName: string,
    count: number,
  ) => {
    const bounds = mapRef.current?.getBoundingClientRect()
    if (!bounds) return

    const cursorX = event.clientX - bounds.left
    const cursorY = event.clientY - bounds.top
    const tooltipWidth = 160
    const left = cursorX > bounds.width - tooltipWidth ? cursorX - tooltipWidth - 14 : cursorX + 14

    setTooltip({
      province: provinceName,
      count,
      x: left,
      y: cursorY + 14,
    })
  }

  const handleProvinceClick = (provinceName: string) => {
    setSelectedProvince((current) => (current === provinceName ? null : provinceName))
    setHoveredProvince(provinceName)
  }

  return (
    <section id="harita" className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-500">
          Türkiye kültür atlası
        </p>
        <h2 className="mt-2 text-3xl font-bold text-zinc-100">Mirası harita üzerinden keşfedin</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Haritada altın olarak vurgulanan illerdeki eserleri görüp, il seçerek ilgili kayıtları listeleyin.
        </p>
      </div>

      <div className="grid gap-6 rounded-[28px] border border-white/10 bg-zinc-950/40 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-5">
        <div ref={mapRef} className="relative overflow-visible rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_35%),_linear-gradient(180deg,_rgba(12,13,16,0.96),_rgba(9,9,11,0.96))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),_0_0_0_1px_rgba(255,255,255,0.02)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%,rgba(251,191,36,0.03))]" />
          <svg
            viewBox="0 0 1007 443"
            className="relative z-10 block h-auto w-full"
            role="img"
            aria-label="Türkiye illeri haritası"
          >
            {provinceStats.map(({ city, d, count }) => {
              const hasHeritage = count > 0
              const isSelected = selectedProvince === city
              const isActive = activeProvince === city

              return (
                <path
                  key={city}
                  d={d}
                  className={[
                    'cursor-pointer outline-none focus:outline-none',
                    isSelected || isActive
                      ? 'fill-amber-400 stroke-amber-200'
                      : hasHeritage
                        ? 'fill-amber-500/90 stroke-zinc-950 hover:fill-amber-400'
                        : 'fill-zinc-800 stroke-zinc-950 hover:fill-zinc-700',
                  ].join(' ')}
                  strokeWidth={isSelected || isActive ? 1.5 : 1}
                  onMouseEnter={(event) => handleTooltipMove(event, city, count)}
                  onMouseMove={(event) => handleTooltipMove(event, city, count)}
                  onMouseLeave={() => setTooltip(null)}
                  onFocus={() => setHoveredProvince(city)}
                  onBlur={() => setHoveredProvince(null)}
                  onClick={() => handleProvinceClick(city)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${city}: ${count} eser`}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleProvinceClick(city)
                    }
                  }}
                />
              )
            })}
          </svg>

          {tooltip && (
            <div
              className="pointer-events-none absolute z-50 rounded-2xl border border-amber-400/30 bg-zinc-950/90 px-3 py-2 shadow-[0_18px_32px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(251,191,36,0.08)] backdrop-blur-md"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translateZ(0)',
                boxShadow: '0 0 0 1px rgba(251, 191, 36, 0.12), 0 18px 32px rgba(0,0,0,0.45)',
              }}
            >
              <p className="text-sm font-semibold text-amber-300">{tooltip.province}</p>
              <p className="mt-1 text-xs text-zinc-300">{tooltip.count} eser kaydı</p>
            </div>
          )}
        </div>

        <aside className="rounded-[24px] border border-white/10 bg-zinc-950/30 p-4 shadow-inner backdrop-blur-xl">
          {selectedProvince ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Seçili il
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-amber-300">{selectedProvince}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProvince(null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-amber-300/40 hover:text-amber-200"
                  aria-label="Seçimi kaldır"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {selectedProvinceSites.length > 0 ? (
                  selectedProvinceSites.map((site) => (
                    <Link
                      key={site.id}
                      href={`/eser/${site.id}`}
                      className="group block rounded-2xl border border-white/8 bg-zinc-950/40 p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-zinc-900/80"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-100 group-hover:text-amber-300">
                            {site.title}
                          </p>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-zinc-400">
                            <MapPin className="h-3 w-3 text-amber-400" />
                            <span>{site.city ?? site.location ?? 'Türkiye'}</span>
                          </div>
                        </div>
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-500/10 text-amber-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400">Bu ilde kayıtlı eser bulunamadı.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-950/30 px-6 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10 text-amber-300">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="text-base font-semibold text-zinc-200">Bir ili seçin</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Haritadan bir il üzerine gelip tıklayın; o ildeki eserler burada listelenecek.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
