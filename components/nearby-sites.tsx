'use client'

import Link from 'next/link'
import { Compass, LocateFixed, MapPin, Navigation } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CulturalImage } from '@/components/cultural-image'

type NearbySite = {
  id: string
  title: string
  city?: string | null
  location: string
  latitude?: number | string | null
  longitude?: number | string | null
  image?: string | string[] | null
  image_urls?: string[] | null
}

type NearbySitesProps = {
  sites: NearbySite[]
  className?: string
}

type Coordinates = {
  latitude: number
  longitude: number
}

function distanceInKilometers(from: Coordinates, to: Coordinates) {
  const earthRadius = 6371
  const latitudeDelta = ((to.latitude - from.latitude) * Math.PI) / 180
  const longitudeDelta = ((to.longitude - from.longitude) * Math.PI) / 180
  const latitude1 = (from.latitude * Math.PI) / 180
  const latitude2 = (to.latitude * Math.PI) / 180
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(longitudeDelta / 2) ** 2

  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function getCoordinate(value: number | string | null | undefined) {
  const coordinate = typeof value === 'string' ? Number.parseFloat(value) : value
  return typeof coordinate === 'number' && Number.isFinite(coordinate) ? coordinate : null
}

export function NearbySites({ sites, className = '' }: NearbySitesProps) {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const nearbySites = useMemo(() => {
    if (!userLocation) return []

    return sites
      .map((site) => {
        const latitude = getCoordinate(site.latitude)
        const longitude = getCoordinate(site.longitude)
        if (latitude === null || longitude === null || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null

        return { site, distance: distanceInKilometers(userLocation, { latitude, longitude }) }
      })
      .filter((item): item is { site: NearbySite; distance: number } => item !== null)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
  }, [sites, userLocation])

  function findNearbySites() {
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMessage('Tarayıcınız konum özelliğini desteklemiyor.')
      return
    }

    setStatus('loading')
    setErrorMessage('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setStatus('ready')
      },
      (error) => {
        setStatus('error')
        setErrorMessage(error.code === error.PERMISSION_DENIED ? 'Yakındaki eserleri görmek için konum izni vermelisiniz.' : 'Konumunuz alınamadı. Lütfen tekrar deneyin.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  return (
    <section className={`rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-zinc-900/60 to-zinc-950/60 p-4 shadow-[0_18px_40px_rgba(245,158,11,0.08)] backdrop-blur-xl sm:p-5 ${className}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-500/10 text-amber-300">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-300">GPS tabanlı keşif</p>
            <h2 className="mt-1 text-xl font-bold text-zinc-100">Yakınımdaki Miraslar</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-400">Konumunu paylaş, çevrendeki eserleri mesafelerine göre keşfet.</p>
          </div>
        </div>
        <button type="button" onClick={findNearbySites} disabled={status === 'loading'} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">
          {status === 'loading' ? <LocateFixed className="h-4 w-4 animate-pulse" aria-hidden="true" /> : <Navigation className="h-4 w-4" aria-hidden="true" />}
          {status === 'loading' ? 'Konum alınıyor...' : userLocation ? 'Konumu yenile' : 'Yakınımı bul'}
        </button>
      </div>

      {status === 'error' && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">{errorMessage}</p>}
      {status === 'ready' && nearbySites.length === 0 && <p className="mt-5 text-sm text-zinc-400">Koordinatı tanımlanmış yakın eser bulunamadı.</p>}
      {nearbySites.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {nearbySites.map(({ site, distance }) => {
            const image = Array.isArray(site.image_urls) ? site.image_urls[0] : Array.isArray(site.image) ? site.image[0] : site.image
            return (
              <Link key={site.id} href={`/eser/${site.id}`} className="group flex gap-3 rounded-2xl border border-white/10 bg-zinc-950/45 p-3 transition-colors hover:border-amber-400/40">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                  <CulturalImage src={image} alt={site.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-amber-300">{site.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500"><MapPin className="h-3 w-3 text-amber-500" />{site.city || site.location}</p>
                  <p className="mt-1 text-xs font-semibold text-amber-400">{distance < 10 ? distance.toFixed(1) : Math.round(distance)} km</p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
