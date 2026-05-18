import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin'

import { authClient } from '@src/services/api/auth-client'
import { i18n } from '@src/shared/i18n'

import { mapUserData } from '../domain'
import { AuthMessageKey, GoogleSignInMessageKey, isBannedAuthError } from './auth-messages'
import { useAuthSession } from './use-auth-session.hook'

type GoogleSignInResult = {
  success: boolean
  cancelled?: boolean
  errorMessage?: string
}

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID

export const useGoogleSignIn = () => {
  const { persistAuthSession } = useAuthSession()
  const [loading, setLoading] = useState(false)

  const isConfigured = Platform.OS === 'android' && Boolean(webClientId)

  useEffect(() => {
    if (!isConfigured) return
    GoogleSignin.configure({
      webClientId: webClientId!,
      offlineAccess: false
    })
  }, [isConfigured])

  const signIn = useCallback(async (): Promise<GoogleSignInResult> => {
    if (!isConfigured)
      return {
        success: false,
        errorMessage: i18n.t(GoogleSignInMessageKey.notConfigured)
      }

    setLoading(true)
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      })
      const response = await GoogleSignin.signIn()

      if (response.type === 'cancelled') {
        return { success: false, cancelled: true }
      }

      const idToken = response.data?.idToken
      if (!idToken) {
        return {
          success: false,
          errorMessage: i18n.t(GoogleSignInMessageKey.missingIdToken)
        }
      }

      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        idToken: { token: idToken }
      })

      if (error || !data) {
        return {
          success: false,
          errorMessage: isBannedAuthError(error)
            ? i18n.t(AuthMessageKey.banned)
            : (error?.message ?? i18n.t(GoogleSignInMessageKey.authFailed))
        }
      }

      const token = (data as { token?: string }).token
      const user = (data as { user?: Parameters<typeof mapUserData>[0] }).user

      if (token && user) {
        await persistAuthSession({ token, user })
      }

      return { success: true }
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) return { success: false, cancelled: true }
        if (error.code === statusCodes.IN_PROGRESS) {
          return {
            success: false,
            errorMessage: i18n.t(GoogleSignInMessageKey.signInInProgress)
          }
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          return {
            success: false,
            errorMessage: i18n.t(GoogleSignInMessageKey.playServicesUnavailable)
          }
        }
      }
      return {
        success: false,
        errorMessage: i18n.t(GoogleSignInMessageKey.authFailed)
      }
    } finally {
      setLoading(false)
    }
  }, [isConfigured, persistAuthSession])

  return { isAvailable: isConfigured, loading, signIn }
}
