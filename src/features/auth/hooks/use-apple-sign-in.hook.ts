import { useCallback, useState } from 'react'
import { Platform } from 'react-native'

import * as AppleAuthentication from 'expo-apple-authentication'

import { authClient } from '@src/services/api/auth-client'

import { mapUserData } from '../domain'
import { AppleErrorCode, AppleSignInMessage, AuthMessage, isBannedAuthError } from './auth-messages'
import { useAuthSession } from './use-auth-session.hook'

type AppleSignInResult = {
  success: boolean
  cancelled?: boolean
  errorMessage?: string
}

export const useAppleSignIn = () => {
  const { persistAuthSession } = useAuthSession()
  const [loading, setLoading] = useState(false)

  const isAvailable = Platform.OS === 'ios'

  const signIn = useCallback(async (): Promise<AppleSignInResult> => {
    if (!isAvailable) return { success: false, errorMessage: AppleSignInMessage.iosOnly }

    setLoading(true)
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      })

      if (!credential.identityToken) {
        return { success: false, errorMessage: AppleSignInMessage.missingIdentityToken }
      }

      const { data, error } = await authClient.signIn.social({
        provider: 'apple',
        idToken: { token: credential.identityToken }
      })

      if (error || !data) {
        return {
          success: false,
          errorMessage: isBannedAuthError(error) ? AuthMessage.banned : (error?.message ?? AppleSignInMessage.authFailed)
        }
      }

      const token = (data as { token?: string }).token
      const user = (data as { user?: Parameters<typeof mapUserData>[0] }).user

      if (token && user) {
        await persistAuthSession({ token, user })
      }

      return { success: true }
    } catch (error) {
      const code = (error as { code?: string })?.code
      if (code === AppleErrorCode.REQUEST_CANCELED || code === AppleErrorCode.CANCELED) {
        return { success: false, cancelled: true }
      }
      return { success: false, errorMessage: AppleSignInMessage.authFailed }
    } finally {
      setLoading(false)
    }
  }, [isAvailable, persistAuthSession])

  return { isAvailable, loading, signIn }
}
