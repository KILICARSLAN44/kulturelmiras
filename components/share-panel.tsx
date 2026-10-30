'use client'

import QRCode from 'qrcode'
import { Check, Copy, QrCode, Share2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type SharePanelProps = {
  title: string
}

export function SharePanel({ title }: SharePanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    QRCode.toDataURL(window.location.href, {
      width: 220,
      margin: 2,
      color: { dark: '#fbbf24', light: '#18181b' },
    })
      .then(setQrCode)
      .catch((error) => console.error('QR kodu oluşturulurken hata oluştu:', error))
  }, [isOpen])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Bağlantı kopyalanırken hata oluştu:', error)
    }
  }

  const shareUrl = typeof window === 'undefined' ? '' : window.location.href
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(`${title} - Kültürel Miras Arşivi`)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-amber-500/60 hover:text-amber-300"
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        Paylaş
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title">
          <div className="w-full max-w-md rounded-3xl border border-amber-500/20 bg-zinc-900/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">Eseri paylaş</p>
                <h2 id="share-dialog-title" className="mt-1 text-xl font-semibold text-zinc-100">Bağlantıyı arkadaşlarınla paylaş</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Paylaşım penceresini kapat" className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-5 flex justify-center rounded-2xl border border-amber-500/20 bg-zinc-950/70 p-4">
              {qrCode ? <img src={qrCode} alt={`${title} eseri için QR kodu`} className="h-52 w-52 rounded-lg" /> : <QrCode className="h-52 w-52 animate-pulse p-12 text-amber-400" aria-label="QR kodu hazırlanıyor" />}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 py-3 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/20">WhatsApp</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl border border-zinc-600 bg-zinc-800/60 px-2 py-3 text-xs font-semibold text-zinc-200 transition-colors hover:border-zinc-400">X&apos;te paylaş</a>
              <button type="button" onClick={copyLink} className="inline-flex items-center justify-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-2 py-3 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20">
                {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
