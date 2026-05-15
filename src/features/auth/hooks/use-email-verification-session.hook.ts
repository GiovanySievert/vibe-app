import { useCallback } from 'react'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'

import { AuthSessionPayload, useAuthSession } from './use-auth-session.hook'

type ResolveEmailVerificationSessionInput = {
  email: string
  password?: string
  session: AuthSessionPayload | null
}

export const useEmailVerificationSession = () => {
  const { showToast } = useToast()
  const { persistAuthSession } = useAuthSession()

  const signInAfterEmailVerification = useCallback(
    async (email: string, password?: string): Promise<AuthSessionPayload | null> => {
      if (!password) {
        showToast('email confirmado. entre novamente para continuar.')
        return null
      }

      const { data, error } = await authClient.signIn.email({
        email,
        password
      })

      if (error || !data?.token) {
        showToast('email confirmado. entre novamente para continuar.')
        return null
      }

      return {
        token: data.token,
        user: data.user
      }
    },
    [showToast]
  )

  const resolveEmailVerificationSession = useCallback(
    async ({ email, password, session }: ResolveEmailVerificationSessionInput) => {
      const authSession = session ?? (await signInAfterEmailVerification(email, password))

      if (authSession) {
        await persistAuthSession(authSession)
      }
    },
    [persistAuthSession, signInAfterEmailVerification]
  )

  return {
    resolveEmailVerificationSession
  }
}
