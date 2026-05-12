import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { UserOwnProfileActions, UserOwnProfileTopBar } from '@src/features/user-menu/components'
import { UserReviewsGrid, UsersProfileHeaderScreen } from '@src/features/users-profile/components'
import { UsersProfileService } from '@src/features/users-profile/services'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

export const UserOwnProfileScreen = () => {
  const [authState] = useAtom(authStateAtom)
  const userId = authState.user.id
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const { data: userData, isLoading } = useQuery<UserModel, Error>({
    queryKey: ['fetchUserById', userId],
    queryFn: async () => (await UsersProfileService.fetchUserById(userId)).data,
    retry: false,
    staleTime: 0
  })

  if (isLoading) {
    return (
      <Box bg="background">
        <ThemedText>CARREGANDO</ThemedText>
      </Box>
    )
  }

  if (!userData) return null

  const openFollowList = (initialTab: 'followers' | 'followings') => {
    navigation.navigate('Modals', {
      screen: 'FollowListScreen',
      params: { userId: userData.id, username: userData.username, initialTab }
    })
  }

  return (
    <ScrollView style={styles.scroll} overScrollMode="never">
      <Screen>
        <UserOwnProfileTopBar username={authState.user.username ?? ''} />
        <UsersProfileHeaderScreen
          userData={userData}
          canViewReviews
          onOpenFollowers={() => openFollowList('followers')}
          onOpenFollowings={() => openFollowList('followings')}
        />
        <UserOwnProfileActions />
        <UserReviewsGrid userId={userId} canViewReviews />
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
