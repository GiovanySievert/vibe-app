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
