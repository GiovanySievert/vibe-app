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
        name: '',
        email: ''
      }
    })

    configureAxiosInterceptors(null)
  }

  return { logout }
}
