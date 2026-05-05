export type UserModel = {
  id: string
  name: string
  username: string
  image: string | null
  bio: string | null
}

export type GetUsersById = {
  data: UserModel
}

export type GetUserByUsername = {
  id: string
  username: string
  image: string | null
}

export type UserSuggestion = {
  id: string
  username: string
  image: string | null
  mutualCount: number
}

export type TrendingUser = {
  id: string
  username: string
  image: string | null
  reviewsCount: number
}
