import { CommonActions, NavigationProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import {
  AuthenticatedStackParamList,
  PostStackParamList,
  TabsNavigatorParamsList
} from '@src/app/navigation/types'

type Destination = 'feed' | 'badges'

type ScreenNavigation = NativeStackScreenProps<PostStackParamList, 'PostReviewSuccess'>['navigation']

type Params = {
  navigation: ScreenNavigation
}

export const useSuccessNavigation = ({ navigation }: Params) => {
  const tabsNavigation = navigation.getParent<NavigationProp<TabsNavigatorParamsList>>()
  const authenticatedNavigation = tabsNavigation?.getParent<NavigationProp<AuthenticatedStackParamList>>()

  const resetToTabs = (destination: Destination) => {
    if (!authenticatedNavigation) {
      navigation.replace('PostMain')
      return
    }

    const tabIndex = destination === 'badges' ? 4 : 1
    const userMenuState =
      destination === 'badges'
        ? { index: 1, routes: [{ name: 'UserProfileMain' }, { name: 'UserBadgesScreen' }] }
        : { index: 0, routes: [{ name: 'UserProfileMain' }] }

    authenticatedNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Tabs',
            state: {
              index: tabIndex,
              routes: [
                { name: 'HomeScreen' },
                { name: 'FeedScreen' },
                { name: 'PostScreen', state: { routes: [{ name: 'PostMain' }] } },
                { name: 'SocialScreen' },
                { name: 'UserMenuScreen', state: userMenuState }
              ]
            }
          }
        ]
      })
    )
  }

  return {
    closeToFeed: () => resetToTabs('feed'),
    openBadges: () => resetToTabs('badges')
  }
}
