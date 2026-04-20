import { useSetAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { authClient } from '@src/services/api/auth-client'
import configureAxiosInterceptors from '@src/services/api/interceptor'

export const useLogout = () => {
  const setAuth = useSetAtom(authStateAtom)

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {}
      }
    })

    setAuth({
      isAuthenticated: false,
      user: {
        id: '',
        createdAt: new Date(0),
        updatedAt: new Date(0),
        email: '',
        emailVerified: false,
        name: '',
        image: null
      }
    })

    configureAxiosInterceptors(null)
  }

  return { logout }
}
