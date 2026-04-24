import { LinkingOptions } from '@react-navigation/native'

import * as ExpoLinking from 'expo-linking'

import {
  getInitialNotificationUrlAsync,
  subscribeToNotificationResponses
} from '@src/features/notifications/services/push-notification.service'

import { AppNavigatorRootParamsList } from './types'

export const linking: LinkingOptions<AppNavigatorRootParamsList> = {
  prefixes: [ExpoLinking.createURL('/'), 'myapp://'],
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
              SocialScreen: {
                screens: {
                  FollowRequestsScreen: 'social/follow-requests/:type'
                }
              }
            }
          },
          SharedEventScreen: 'events/share/:token'
        }
      }
    }
  }
}
