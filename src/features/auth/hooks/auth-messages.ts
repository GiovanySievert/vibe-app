export const AppleSignInMessage = {
  iosOnly: 'apple sign in disponível apenas no ios',
  missingIdentityToken: 'apple não retornou identityToken',
  authFailed: 'falha ao autenticar com apple'
} as const

export const AppleErrorCode = {
  CANCELED: 'ERR_CANCELED',
  REQUEST_CANCELED: 'ERR_REQUEST_CANCELED'
} as const

export const GoogleSignInMessage = {
  notConfigured: 'google sign in não configurado',
  missingIdToken: 'google não retornou idToken',
  authFailed: 'falha ao autenticar com google',
  signInInProgress: 'login em andamento',
  playServicesUnavailable: 'google play services indisponível'
} as const

export const AuthMessage = {
  banned: 'sua conta foi bloqueada. entre em contato com o suporte.'
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
  return error?.code === AuthErrorCode.bannedUser || error?.code === AuthErrorCode.userBanned || message.includes('banned')
}
