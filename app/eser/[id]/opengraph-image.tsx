import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'

export const alt = 'Kültürel Miras eseri'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type OpenGraphImageProps = {
  params: Promise<{ id: string }>
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: site } = await supabase
    .from('eserler')
    .select('title, city, location, image, image_urls')
    .eq('id', id)
    .eq('is_approved', true)
    .single()

  const image = Array.isArray(site?.image_urls)
    ? site.image_urls[0]
    : Array.isArray(site?.image)
      ? site.image[0]
      : site?.image
  const city = site?.city || site?.location || 'Türkiye'
  const title = site?.title || 'Kültürel Miras Arşivi'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          color: '#f4f4f5',
          display: 'flex',
          height: '100%',
          width: '100%',
          padding: '56px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {image && (
          <img
            src={image}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.3,
            }}
          />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(9,9,11,0.98) 0%, rgba(9,9,11,0.78) 58%, rgba(9,9,11,0.45) 100%)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#fbbf24', fontSize: '24px', fontWeight: 700, letterSpacing: '3px' }}>
            <span style={{ display: 'flex', width: '12px', height: '42px', background: '#fbbf24', borderRadius: '6px' }} />
            KÜLTÜREL MİRAS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '780px', gap: '18px' }}>
            <div style={{ color: '#fbbf24', fontSize: '26px' }}>Türkiye&apos;nin dijital miras arşivi</div>
            <div style={{ fontSize: '62px', lineHeight: 1.08, fontWeight: 700 }}>{title}</div>
            <div style={{ color: '#d4d4d8', fontSize: '30px' }}>{city}</div>
          </div>
          <div style={{ color: '#a1a1aa', fontSize: '22px' }}>Tarihi keşfet, mirası geleceğe taşı.</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
