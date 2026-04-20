export type UserModel = {
  id: string
  name: string
  username: string
  image: string | null
}

export type GetUsersById = {
  data: UserModel
}

export type GetUserByUsername = {
  id: string
  username: string
  image: string | null
}
