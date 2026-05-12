import { LinkingOptions } from '@react-navigation/native'

import * as ExpoLinking from 'expo-linking'

import {
  getInitialNotificationUrlAsync,
  subscribeToNotificationResponses
} from '@src/features/notifications/services/push-notification.service'

import { AppNavigatorRootParamsList } from './types'

export const linking: LinkingOptions<AppNavigatorRootParamsList> = {
  prefixes: [ExpoLinking.createURL('/'), 'vibes://'],
  async getInitialURL() {
    const url = await ExpoLinking.getInitialURL()

    if (url) {
      return url
    }

    return await getInitialNotificationUrlAsync()
  },
  subscribe(listener) {
    const linkingSubscription = ExpoLinking.addEventListener('url', ({ url }) => listener(url))
    const notificationSubscription = subscribeToNotificationResponses(listener)

    return () => {
      linkingSubscription.remove()
      notificationSubscription()
    }
  },
  config: {
    screens: {
      TabsNavigator: {
        screens: {
          Tabs: {
            screens: {
            }
          },
          SharedEventScreen: 'events/share/:token',
          SharedReviewScreen: 'reviews/share/:reviewId'
        }
      },
      Modals: {
        screens: {
          UsersProfileScreen: 'social/profile/:userId',
          FollowRequestsScreen: 'social/follow-requests/:type',
          BlockedUsersScreen: 'social/blocked'
        }
      }
    }
  }
}
