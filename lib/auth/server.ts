import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserRole, isAdminRole } from '@/lib/auth/roles'

export async function requireAdminAccess() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const role = await getUserRole(supabase, user.id)
  if (!isAdminRole(role)) redirect('/')

  return { supabase, user, role }
}

export async function requireSuperAdminAccess() {
  const access = await requireAdminAccess()

  if (access.role !== 'super_admin') redirect('/')

  return access
}
