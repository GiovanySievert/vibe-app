export type UserData = {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined
}

export type UserSession = {
  id: string
  createdAt: Date | null
  updatedAt: Date | null
  userId: string
  expiresAt: Date | null
  token: string
  ipAddress?: string | null | undefined
  userAgent?: string | null | undefined
}

export type UserAuthenticated = {
  isAuthenticated: boolean
  user: UserData
  session?: UserSession
}
