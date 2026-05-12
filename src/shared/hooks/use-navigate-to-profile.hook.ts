import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'

export const useNavigateToProfile = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const { data: session } = authClient.useSession()

  return (userId: string) => {
    if (session?.user.id !== userId) {
      navigation.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId } })
      return
    }

    const parent = navigation.getParent<NativeStackNavigationProp<AuthenticatedStackParamList>>()
    if (parent && parent.canGoBack()) {
      parent.popTo('Tabs', { screen: 'UserMenuScreen', params: { screen: 'UserProfileMain' } })
    } else {
      navigation.navigate('Tabs', { screen: 'UserMenuScreen', params: { screen: 'UserProfileMain' } })
    }
  }
}
