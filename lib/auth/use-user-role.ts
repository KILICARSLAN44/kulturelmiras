'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { getUserRole, type UserRole } from '@/lib/auth/roles'

export function useUserRole() {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>('user')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadRole(nextUser: User | null) {
      if (!nextUser) {
        if (mounted) {
          setUser(null)
          setRole('user')
          setIsLoading(false)
        }
        return
      }

      try {
        const nextRole = await getUserRole(supabase, nextUser.id)
        if (mounted) {
          setUser(nextUser)
          setRole(nextRole)
        }
      } catch {
        if (mounted) {
          setUser(nextUser)
          setRole('user')
        }
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    supabase.auth.getUser().then(({ data }) => loadRole(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true)
      void loadRole(session?.user ?? null)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return { user, role, isAdmin: role === 'super_admin' || role === 'editor', isLoading }
}
