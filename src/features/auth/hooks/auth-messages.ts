export const AppleSignInMessageKey = {
  iosOnly: 'auth.errors.appleIosOnly',
  missingIdentityToken: 'auth.errors.appleNoToken',
  authFailed: 'auth.errors.appleAuthFailed'
} as const

export const AppleErrorCode = {
  CANCELED: 'ERR_CANCELED',
  REQUEST_CANCELED: 'ERR_REQUEST_CANCELED'
} as const

export const GoogleSignInMessageKey = {
  notConfigured: 'auth.errors.googleNotConfigured',
  missingIdToken: 'auth.errors.googleNoToken',
  authFailed: 'auth.errors.googleAuthFailed',
  signInInProgress: 'auth.errors.googleInProgress',
  playServicesUnavailable: 'auth.errors.googlePlayServices'
} as const

export const AuthMessageKey = {
  banned: 'auth.errors.accountBanned'
} as const

export const AuthErrorCode = {
  bannedUser: 'BANNED_USER',
  userBanned: 'USER_BANNED'
} as const

type AuthError = {
  code?: string
  message?: string
}

export const isBannedAuthError = (error?: AuthError | null) => {
  const message = error?.message?.toLowerCase() ?? ''
  return (
    error?.code === AuthErrorCode.bannedUser || error?.code === AuthErrorCode.userBanned || message.includes('banned')
  )
}
