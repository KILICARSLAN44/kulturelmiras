import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SiteHeader } from '@/components/site-header'
import { SitePreview } from '@/components/site-preview'

type Site = {
  id: string
  title: string
  category: string
  location: string
  details: string
  highlights: string[]
  images: string[]
  is_approved: boolean
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

async function updateApproval(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  const isApproved = formData.get('is_approved') === 'true'
  if (!id) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('eserler').update({ is_approved: isApproved }).eq('id', id)
  if (error) throw new Error('Eserin onay durumu güncellenemedi.')
  revalidatePath('/admin')
  revalidatePath('/')
}

async function deleteSite(formData: FormData) {
  'use server'
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase.from('eserler').delete().eq('id', id)
  if (error) throw new Error('Eser silinemedi.')
  revalidatePath('/admin')
  revalidatePath('/')
}

function SiteRow({ site, pending }: { site: Site; pending: boolean }) {
  return (
    <tr className="bg-zinc-950">
      <td className="px-4 py-3 font-medium">{site.title}</td>
      <td className="px-4 py-3 text-zinc-400">{site.category}</td>
      <td className="px-4 py-3 text-zinc-400">{site.location}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {pending && (
            <form action={updateApproval}>
              <input type="hidden" name="id" value={site.id} />
              <input type="hidden" name="is_approved" value="true" />
              <button type="submit" className="text-emerald-400 hover:text-emerald-300">Onayla</button>
            </form>
          )}
          <Link href={`/duzenle/${site.id}`} className="text-amber-400 hover:text-amber-300">Düzenle</Link>
          <SitePreview site={site} pending={pending} approveAction={updateApproval} deleteAction={deleteSite} />
          <form action={deleteSite}>
            <input type="hidden" name="id" value={site.id} />
            <button type="submit" className="text-red-400 hover:text-red-300">{pending ? 'Reddet/Sil' : 'Sil'}</button>
          </form>
        </div>
      </td>
    </tr>
  )
}

function SiteTable({ sites, pending }: { sites: Site[]; pending: boolean }) {
  if (sites.length === 0) {
    return <p className="px-4 py-10 text-center text-zinc-500">{pending ? 'Onay bekleyen eser yok.' : 'Yayınlanan eser yok.'}</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-zinc-900 text-zinc-400">
          <tr><th className="px-4 py-3">Eser</th><th className="px-4 py-3">Kategori</th><th className="px-4 py-3">Konum</th><th className="px-4 py-3">İşlemler</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {sites.map((site) => <SiteRow key={site.id} site={site} pending={pending} />)}
        </tbody>
      </table>
    </div>
  )
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: sites, error } = await supabase
    .from('eserler')
    .select('*')
    .order('title')
  if (error) {
    console.error('Admin Veri Çekme Hatası:', error)
    throw new Error('Eserler yüklenemedi.')
  }

  const allSites: Site[] = (sites ?? []).map((site) => ({
    id: site.id,
    title: site.title,
    category: site.category,
    location: site.location,
    details: site.details ?? '',
    highlights: normalizeList(site.highlights),
    images: normalizeImages(site.image_urls, site.image),
    is_approved: site.is_approved,
  }))
  const pendingSites = allSites.filter((site) => !site.is_approved)
  const publishedSites = allSites.filter((site) => site.is_approved)

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div><p className="text-sm text-amber-400">Yönetim</p><h1 className="mt-1 text-3xl font-semibold">Eserler</h1></div>
          <Link href="/ekle" className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-amber-400">Eser Ekle</Link>
        </div>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-lg border border-amber-500/30">
            <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-4">
              <h2 className="font-semibold">Onay Bekleyenler <span className="ml-2 text-sm text-amber-400">({pendingSites.length})</span></h2>
            </div>
            <SiteTable sites={pendingSites} pending />
          </section>
          <section className="overflow-hidden rounded-lg border border-zinc-800">
            <div className="border-b border-zinc-800 bg-zinc-900 px-4 py-4">
              <h2 className="font-semibold">Yayınlanan Eserler <span className="ml-2 text-sm text-zinc-400">({publishedSites.length})</span></h2>
            </div>
            <SiteTable sites={publishedSites} pending={false} />
          </section>
        </div>
      </section>
    </main>
  )
}
