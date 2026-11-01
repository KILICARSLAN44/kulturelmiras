import type { SupabaseClient } from '@supabase/supabase-js'

export type UserRole = 'super_admin' | 'editor' | 'user'

export const ADMIN_ROLES: readonly UserRole[] = ['super_admin', 'editor']

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role)
}

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserRole> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Kullanıcı rolü alınırken hata oluştu:', error)
    throw new Error('Kullanıcı rolü doğrulanamadı.')
  }

  if (data?.role === 'super_admin' || data?.role === 'editor') {
    return data.role
  }

  return 'user'
}
