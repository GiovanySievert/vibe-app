export type ListUserAllFollowRequestsResponse = {
  id: string
  userId: string
  username: string
  avatar: string
  status: FollowRequestStatus
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
  userId: string
  avatar: string
}

export type ListFollowersResponse = {
  id: string
  username: string
  avatar: string
  userId: string
}

export enum FollowStatus {
  FOLLOWING = 'following',
  PENDING = 'pending',
  NONE = 'none'
}

export enum FollowAction {
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
  CANCEL = 'cancel'
}

export enum FollowRequestType {
  RECEIVED = 'received',
  SENT = 'sent'
}

export enum FollowRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export type GetFollowStatusResponse = {
  id: string
  status: FollowStatus
}
