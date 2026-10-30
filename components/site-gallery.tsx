'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { CulturalImage } from '@/components/cultural-image'

type SiteGalleryProps = {
  title: string
  imageUrls: string[]
}

export function SiteGallery({ title, imageUrls }: SiteGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [heroImage, ...galleryImages] = imageUrls
  const visibleGalleryImages = galleryImages.slice(0, 3)
  const hiddenImageCount = Math.max(imageUrls.length - 4, 0)
  const selectedImage = selectedIndex === null ? null : imageUrls[selectedIndex]

  function showPreviousImage() {
    setSelectedIndex((currentIndex) => currentIndex === null ? null : (currentIndex - 1 + imageUrls.length) % imageUrls.length)
  }

  function showNextImage() {
    setSelectedIndex((currentIndex) => currentIndex === null ? null : (currentIndex + 1) % imageUrls.length)
  }

  if (!heroImage) {
    return (
      <section aria-label={`${title} görsel galerisi`} className="h-72 overflow-hidden rounded-lg border border-zinc-800">
        <CulturalImage src={null} alt={`${title} için görsel bulunamadı`} fallbackClassName="h-full" />
      </section>
    )
  }

  return (
    <>
      <section aria-label={`${title} görsel galerisi`} className="space-y-4">
        <button
          type="button"
          onClick={() => setSelectedIndex(0)}
          className="group relative block aspect-[16/9] w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 text-left"
        >
          <CulturalImage src={heroImage} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
          <span className="absolute bottom-4 left-4 rounded-sm border border-white/20 bg-black/50 px-2.5 py-1 text-xs text-zinc-200 backdrop-blur-sm">Ana fotoğraf</span>
          <span className="absolute bottom-4 right-4 rounded-sm border border-white/20 bg-black/50 px-2.5 py-1 text-xs text-zinc-200 backdrop-blur-sm">
            01 / {imageUrls.length.toString().padStart(2, '0')}
          </span>
        </button>

        {galleryImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {visibleGalleryImages.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index + 1)}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
              >
                <CulturalImage src={imageUrl} alt={`${title} - galeri görseli ${index + 1}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {index === 2 && hiddenImageCount > 0 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-semibold text-white backdrop-blur-[1px]">
                    +{hiddenImageCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedImage && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} görseli`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            aria-label="Görseli kapat"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-zinc-900/80 p-2 text-zinc-300 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Önceki görsel"
            onClick={(event) => {
              event.stopPropagation()
              showPreviousImage()
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900/80 p-3 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white sm:left-8"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={selectedImage}
            alt={title}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            aria-label="Sonraki görsel"
            onClick={(event) => {
              event.stopPropagation()
              showNextImage()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900/80 p-3 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white sm:right-8"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300">
            {selectedIndex + 1} / {imageUrls.length}
          </span>
        </div>
      )}
    </>
  )
}
