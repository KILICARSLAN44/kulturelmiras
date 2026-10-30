'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

type Site = {
  id: string
  title: string
  category: string
  location: string
  details: string
  highlights: string[]
  images: string[]
}

type ModerationAction = (formData: FormData) => void | Promise<void>

type SitePreviewProps = {
  site: Site
  pending: boolean
  approveAction: ModerationAction
  deleteAction: ModerationAction
}

export function SitePreview({ site, pending, approveAction, deleteAction }: SitePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-sky-400 hover:text-sky-300"
      >
        Görüntüle / İncele
      </button>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`preview-title-${site.id}`}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 sm:p-8"
          onClick={() => setIsOpen(false)}
        >
          <section
            className="mx-auto max-w-4xl rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-zinc-800 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">Eser önizlemesi</p>
                <h2 id={`preview-title-${site.id}`} className="mt-1 text-2xl font-semibold text-zinc-100">{site.title}</h2>
              </div>
              <button type="button" aria-label="Önizlemeyi kapat" onClick={() => setIsOpen(false)} className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-7 px-5 py-6 sm:px-7">
              {site.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {site.images.map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt={`${site.title} görsel ${index + 1}`} className="aspect-[4/3] w-full rounded-md border border-zinc-800 object-cover" />
                  ))}
                </div>
              )}
              <dl className="grid gap-4 sm:grid-cols-3">
                <div><dt className="text-xs text-zinc-500">Kategori</dt><dd className="mt-1 text-sm text-zinc-200">{site.category}</dd></div>
                <div><dt className="text-xs text-zinc-500">Konum</dt><dd className="mt-1 text-sm text-zinc-200">{site.location}</dd></div>
              </dl>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Açıklama</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-zinc-300">{site.details || 'Açıklama eklenmemiş.'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Özellikler</h3>
                {site.highlights.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-300">
                    {site.highlights.map((highlight, index) => <li key={`${index}-${highlight}`}>{highlight}</li>)}
                  </ul>
                ) : <p className="mt-2 text-sm text-zinc-500">Özellik maddesi eklenmemiş.</p>}
              </div>
              <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-800 pt-5">
                {pending && (
                  <form action={approveAction}>
                    <input type="hidden" name="id" value={site.id} />
                    <input type="hidden" name="is_approved" value="true" />
                    <button type="submit" className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400">Onayla</button>
                  </form>
                )}
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={site.id} />
                  <button type="submit" className="rounded-md bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/25">Reddet / Sil</button>
                </form>
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800">Kapat</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
