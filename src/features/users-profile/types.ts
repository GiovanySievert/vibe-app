export type ListUserAllFollowRequestsResponse = {
  id: string
  userId: string
  username: string
  avatar: string | null
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
  name: string
  userId: string
  image: string | null
}

export type ListFollowersResponse = {
  id: string
  username: string
  name: string
  image: string | null
  userId: string
}

export enum BlockStatus {
  BLOCKED = 'blocked',
  NONE = 'false'
}

export enum BlockAction {
  BLOCK = 'block',
  UNBLOCK = 'unblock'
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

export type GetBlockStatusResponse = {
  isBlocked: boolean
}

export type ListBlockedUsersResponse = {
  id: string
  userId: string
  username: string
  avatar: string | null
  blockedAt: string
}

export enum ReportReason {
  SPAM = 'spam',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  HARASSMENT = 'harassment',
  FAKE_ACCOUNT = 'fake_account',
  OTHER = 'other'
}

export type CreateReportPayload = {
  reason: ReportReason
  description?: string
}

export type CreateReportResponse = {
  id: string
  reporterId: string
  reportedId: string
  reason: ReportReason
  description: string | null
  createdAt: string
}

export type WeeklyActivitySummary = {
  isoYear: number
  isoWeek: number
  reviewCount: number
  streakContributed: boolean
}

export type UserStreakResponse = {
  streak: {
    currentStreak: number
    longestStreak: number
    weeklyThreshold: number
    lastActiveWeek: number | null
    lastActiveYear: number | null
  }
  recentActivity: WeeklyActivitySummary[]
}

export type StreakUpdateResponse = {
  triggered: boolean
  previousStreak: number
  currentStreak: number
  longestStreak: number
  weeklyThreshold: number
  reviewCount: number
  isoYear: number
  isoWeek: number
}

export type FriendStreakSummary = {
  userId: string
  name: string
  username: string
  image: string | null
  currentStreak: number
}

export type FriendsStreakResponse = {
  count: number
  friends: FriendStreakSummary[]
}
