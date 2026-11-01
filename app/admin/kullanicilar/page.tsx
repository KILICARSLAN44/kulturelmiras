import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { requireSuperAdminAccess } from '@/lib/auth/server'
import { SiteHeader } from '@/components/site-header'

type Profile = {
  id: string
  email: string | null
  role: 'super_admin' | 'editor' | 'user'
  created_at: string | null
}

async function updateRole(formData: FormData) {
  'use server'
  const profileId = String(formData.get('id') ?? '')
  const role = String(formData.get('role') ?? '')
  if (!profileId || !['user', 'editor', 'super_admin'].includes(role)) {
    throw new Error('Geçersiz kullanıcı rolü.')
  }

  const { supabase } = await requireSuperAdminAccess()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', profileId)
  if (error) throw new Error('Kullanıcı rolü güncellenemedi.')
  revalidatePath('/admin/kullanicilar')
}

function formatDate(value: string | null) {
  if (!value) return '-'
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(value))
}

export default async function UsersPage() {
  const { supabase } = await requireSuperAdminAccess()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Kullanıcılar yüklenirken hata oluştu:', error)
    throw new Error('Kullanıcılar yüklenemedi.')
  }

  const profiles = (data ?? []) as Profile[]

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div><p className="text-sm text-amber-400">Yönetim</p><h1 className="mt-1 text-3xl font-semibold">Kullanıcı Yönetimi</h1></div>
          <Link href="/admin" className="text-sm text-zinc-400 hover:text-zinc-100">Eserlere dön</Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr><th className="px-4 py-3">E-posta</th><th className="px-4 py-3">Rol</th><th className="px-4 py-3">Kayıt Tarihi</th><th className="px-4 py-3">İşlem</th></tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {profiles.map((profile) => (
                <tr key={profile.id} className="bg-zinc-950">
                  <td className="px-4 py-3">{profile.email ?? '-'}</td>
                  <td className="px-4 py-3 text-zinc-400">{profile.role}</td>
                  <td className="px-4 py-3 text-zinc-400">{formatDate(profile.created_at)}</td>
                  <td className="px-4 py-3">
                    <form action={updateRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={profile.id} />
                      <select name="role" defaultValue={profile.role} className="h-9 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm">
                        <option value="user">user</option>
                        <option value="editor">editor</option>
                        <option value="super_admin">super_admin</option>
                      </select>
                      <button type="submit" className="rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-amber-400">Kaydet</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
