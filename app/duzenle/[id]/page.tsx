'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { categories } from '@/lib/categories'

type EditForm = {
  title: string
  category: string
  location: string
  latitude: string
  longitude: string
  period: string
  details: string
  contributor_name: string
}

function normalizeList(value: unknown): string[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value]
  return values.flatMap((item) => typeof item === 'string'
    ? item.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean)
    : [])
}

function normalizeImages(imageUrls: unknown, image: unknown): string[] {
  const values = Array.isArray(imageUrls) && imageUrls.length > 0 ? imageUrls : Array.isArray(image) ? image : image ? [image] : []
  return values.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export default function EditSitePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<EditForm>({ title: '', category: '', location: '', latitude: '', longitude: '', period: '', details: '', contributor_name: '' })
  const [imageInputs, setImageInputs] = useState<string[]>([])
  const [highlightInputs, setHighlightInputs] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('eserler').select('*').eq('id', id).single().then(({ data, error: fetchError }) => {
      if (fetchError || !data) {
        setError('Eser bulunamadı.')
      } else {
        setForm({
          title: data.title ?? '',
          category: data.category ?? '',
          location: data.location ?? '',
          latitude: data.latitude == null ? '' : String(data.latitude),
          longitude: data.longitude == null ? '' : String(data.longitude),
          period: data.period ?? '',
          details: data.details ?? '',
          contributor_name: data.contributor_name ?? '',
        })
        setImageInputs(normalizeImages(data.image_urls, data.image))
        setHighlightInputs(normalizeList(data.highlights))
      }
      setLoading(false)
    })
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const optionalNumber = (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return null
      const number = Number(trimmed)
      return Number.isFinite(number) ? number : null
    }
    const optionalText = (value: string) => value.trim() || null
    const { error: updateError } = await supabase.from('eserler').update({
      ...form,
      location: optionalText(form.location),
      latitude: optionalNumber(form.latitude),
      longitude: optionalNumber(form.longitude),
      image: imageInputs.filter(Boolean),
      image_urls: imageInputs.filter(Boolean),
      highlights: highlightInputs.filter(Boolean),
    }).eq('id', id)
    if (updateError) {
      setError('Eser güncellenemedi. Veritabanı sütunlarını kontrol edip tekrar deneyin.')
      setSaving(false)
    } else {
      router.push('/admin')
    }
  }

  if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-zinc-400">Yükleniyor...</main>

  return (
    <main className="min-h-screen bg-zinc-950 px-5 py-10 text-zinc-100">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8">
        <div><p className="text-sm text-amber-400">Yönetim</p><h1 className="mt-1 text-2xl font-semibold">Eseri düzenle</h1></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['title', 'location', 'period'] as const).map((field) => (
            <input key={field} required={field !== 'location'} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} placeholder={field === 'title' ? 'Eser adı' : field === 'location' ? 'Konum (opsiyonel)' : 'Dönem'} className="h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          ))}
          <input type="number" step="any" value={form.latitude} onChange={(event) => setForm({ ...form, latitude: event.target.value })} placeholder="Enlem (opsiyonel)" className="h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          <input type="number" step="any" value={form.longitude} onChange={(event) => setForm({ ...form, longitude: event.target.value })} placeholder="Boylam (opsiyonel)" className="h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
          <select required value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="h-11 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-amber-500">
            <option value="">Kategori seçin</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </div>
        <textarea required rows={7} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} placeholder="Tarihçe ve açıklama" className="w-full rounded-md border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none focus:border-amber-500" />
        <div>
          <label htmlFor="contributor_name" className="mb-2 block text-sm text-zinc-300">Katkıda Bulunan / Ekleyen İsmi</label>
          <input id="contributor_name" value={form.contributor_name} onChange={(event) => setForm({ ...form, contributor_name: event.target.value })} className="h-11 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-amber-500" />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between"><label className="text-sm text-zinc-300">Görseller</label><button type="button" onClick={() => setImageInputs([...imageInputs, ''])} className="inline-flex items-center gap-1 text-xs text-amber-400"><Plus className="h-3.5 w-3.5" /> Görsel ekle</button></div>
          <div className="space-y-3">
            {imageInputs.map((image, index) => <div key={index} className="flex gap-2"><input type="url" value={image} onChange={(event) => setImageInputs(imageInputs.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} placeholder="https://ornek.com/gorsel.jpg" className="h-11 min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm" /><button type="button" aria-label="Görseli sil" onClick={() => setImageInputs(imageInputs.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-300"><X className="h-4 w-4" /></button></div>)}
            {imageInputs.length === 0 && <p className="text-xs text-zinc-500">Görsel eklenmedi. Eser görselsiz yayınlanabilir.</p>}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between"><label className="text-sm text-zinc-300">Özellikler / Detaylar</label><button type="button" onClick={() => setHighlightInputs([...highlightInputs, ''])} className="inline-flex items-center gap-1 text-xs text-amber-400"><Plus className="h-3.5 w-3.5" /> Madde ekle</button></div>
          <div className="space-y-3">
            {highlightInputs.map((highlight, index) => <div key={index} className="flex gap-2"><textarea rows={2} value={highlight} onChange={(event) => setHighlightInputs(highlightInputs.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); if (index === highlightInputs.length - 1) setHighlightInputs([...highlightInputs, '']) } }} className="min-w-0 flex-1 rounded-md border border-zinc-700 bg-zinc-950 p-3 text-sm" /><button type="button" aria-label="Maddeyi sil" onClick={() => setHighlightInputs(highlightInputs.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-300"><X className="h-4 w-4" /></button></div>)}
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5"><button type="button" onClick={() => router.push('/admin')} className="rounded-md px-4 py-2 text-sm text-zinc-400">İptal</button><button disabled={saving} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-60">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button></div>
      </form>
    </main>
  )
}
