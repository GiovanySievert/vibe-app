import { NavigationProp } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'

import { NotificationItem, NotificationType } from '../services/notification-inbox.service'

type Nav = NavigationProp<AuthenticatedStackParamList>

const str = (value: unknown): string | null =>
  typeof value === 'string' ? value : null

const handlers: Partial<Record<NotificationType, (item: NotificationItem, nav: Nav) => void>> = {
  follow_request_created: (_item, nav) =>
    nav.navigate('Modals', { screen: 'FollowRequestsScreen', params: { type: 'received' } }),

  follow_request_accepted: (item, nav) => {
    const userId = str(item.data?.userId)
    if (userId) nav.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId } })
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

export function navigateFromNotification(item: NotificationItem, navigation: Nav) {
  handlers[item.type]?.(item, navigation)
}
