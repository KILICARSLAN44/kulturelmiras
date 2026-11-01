import type { ReactNode } from 'react'
import { requireAdminAccess } from '@/lib/auth/server'

export default async function EditLayout({ children }: { children: ReactNode }) {
  await requireAdminAccess()
  return children
}
