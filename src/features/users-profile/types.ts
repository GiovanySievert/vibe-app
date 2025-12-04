export type ListUserAllFollowRequestsResponse = {
  id: string
  requesterId: string
  requesterUsername: string
  requesterAvatar: string
  requestedId: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export type UserFollowStatsResponse = {
  followersCount: number
  followingCount: number
  updatedAt: string
  userId: string
}

export type ListFollowingsResponse = {
  id: string
  username: string
  avatar: string
}

export type ListFollowersResponse = {
  id: string
  username: string
  avatar: string
}

export enum FollowStatus {
  FOLLOWING = 'following',
  PENDING = 'pending',
  NONE = 'none'
}

export type GetFollowStatusResponse = {
  id: string
  status: FollowStatus
}
