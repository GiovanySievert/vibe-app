import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { UserOwnProfileActions, UserOwnProfileTopBar } from '@src/features/user-menu/components'
import { UserReviewsGrid, UsersProfileFollowList, UsersProfileHeaderScreen } from '@src/features/users-profile/components'
import { UsersProfileService } from '@src/features/users-profile/services'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

export const UserOwnProfileScreen = () => {
  const [authState] = useAtom(authStateAtom)
  const userId = authState.user.id

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'followers' | 'followings'>('followers')

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

  return (
    <>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <UserOwnProfileTopBar username={authState.user.username ?? ''} />
          <UsersProfileHeaderScreen
            userData={userData}
            onOpenFollowers={() => { setModalType('followers'); setIsModalVisible(true) }}
            onOpenFollowings={() => { setModalType('followings'); setIsModalVisible(true) }}
          />
          <UserOwnProfileActions />
          <UserReviewsGrid userId={userId} />
        </Screen>
      </ScrollView>

      <UsersProfileFollowList
        userId={userData.id}
        type={modalType}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        isUserLoggedProfile
      />
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
