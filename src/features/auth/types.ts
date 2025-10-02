export type UserData = {
  username: string
  email: string
  password: string
}

export type UserAuthenticated = {
  isAuthenticated: boolean
  user: UserData
}
