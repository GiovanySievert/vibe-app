import { NavigationProp } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'

import { NotificationItem, NotificationType } from '../services/notification-inbox.service'

type Nav = NavigationProp<AuthenticatedStackParamList>

const str = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

const navigateToProfile = (userId: string, loggedUserId: string | undefined, nav: Nav) => {
  if (loggedUserId && loggedUserId === userId) {
    nav.navigate('Tabs', { screen: 'UserMenuScreen', params: { screen: 'UserProfileMain' } })
  } else {
    nav.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId } })
  }
}

const handlers: Partial<Record<NotificationType, (item: NotificationItem, nav: Nav, loggedUserId?: string) => void>> = {
  follow_request_created: (_item, nav) =>
    nav.navigate('Modals', { screen: 'FollowRequestsScreen', params: { type: 'received' } }),

  follow_request_accepted: (item, nav, loggedUserId) => {
    const userId = str(item.data?.userId)
    if (userId) navigateToProfile(userId, loggedUserId, nav)
  },

  event_invitation: (item, nav) => {
    const eventId = str(item.data?.eventId)
    if (eventId) nav.navigate('SharedEventScreen', { token: eventId })
  },

  event_comment_created: (item, nav) => {
    const eventId = str(item.data?.eventId)
    if (eventId) nav.navigate('SharedEventScreen', { token: eventId })
  }
}

export function navigateFromNotification(item: NotificationItem, navigation: Nav, loggedUserId?: string) {
  handlers[item.type]?.(item, navigation, loggedUserId)
}
