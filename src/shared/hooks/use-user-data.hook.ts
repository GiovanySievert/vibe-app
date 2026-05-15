import { useEffect } from 'react'

import { createAuthClient } from 'better-auth/react'
import { useSetAtom } from 'jotai'

import { mapUserData } from '@src/features/auth/domain'
import { authStateAtom } from '@src/features/auth/state'

const { useSession } = createAuthClient()

export const useUserData = () => {
  const setAuth = useSetAtom(authStateAtom)

  const { data: session, isPending, error, refetch } = useSession()

  useEffect(() => {
    const getUserDataAndSession = async () => {
      if (session) {
        setAuth({
          isAuthenticated: true,
          user: mapUserData(session.user),
          session: session.session
        })
      }
    }
    getUserDataAndSession()
  }, [session, setAuth])

  return { isPending, error, refetch }
}
