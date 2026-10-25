import { ImageResponse } from 'next/og'

export const alt = 'Kültürel Miras Arşivi'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A0A',
          color: '#EAB308',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '34px',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: '190px',
              height: '150px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '112px',
                borderRadius: '6px',
                backgroundColor: '#EAB308',
                position: 'absolute',
                left: '24px',
                top: '19px',
              }}
            />
            <div
              style={{
                width: '88px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: '#EAB308',
                position: 'absolute',
                left: '31px',
                top: '47px',
                transform: 'rotate(-38deg)',
                transformOrigin: 'left center',
              }}
            />
            <div
              style={{
                width: '88px',
                height: '12px',
                borderRadius: '6px',
                backgroundColor: '#EAB308',
                position: 'absolute',
                left: '31px',
                top: '98px',
                transform: 'rotate(38deg)',
                transformOrigin: 'left center',
              }}
            />
            <div
              style={{
                width: '86px',
                height: '86px',
                borderRadius: '50%',
                backgroundColor: '#EAB308',
                position: 'absolute',
                left: '91px',
                top: '32px',
              }}
            />
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: '#0A0A0A',
                position: 'absolute',
                left: '108px',
                top: '23px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '116px',
                top: '-4px',
                color: '#EAB308',
                fontFamily: 'Arial, sans-serif',
                fontSize: '56px',
                lineHeight: '1',
              }}
            >
              ★
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: '#EAB308',
              fontFamily: 'Arial, sans-serif',
              fontSize: '42px',
              fontWeight: 700,
              letterSpacing: '4px',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            KÜLTÜREL MİRAS ARŞİVİ
          </div>
        </div>
      </div>
    ),
    size,
  )
}
