import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

import {
  UserReviewsGrid,
  UsersProfileBlockedState,
  UsersProfileHeaderScreen,
  UsersProfileOptionsModal,
  UsersProfileReportModal,
  UsersProfileTopBar
} from '../components'
import { useBlockStatus } from '../hooks/use-block-status.hook'
import { useFollowStatus } from '../hooks/use-follow-status.hook'
import { UsersProfileService } from '../services'
import { FollowStatus } from '../types'

type UsersProfileScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'UsersProfileScreen'>

export const UsersProfileScreen: React.FC<UsersProfileScreenScreenProps> = ({ route, navigation }) => {
  const userId = route.params?.userId
  const { data: userLoggedData } = authClient.useSession()

  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false)
  const [isReportModalVisible, setIsReportModalVisible] = useState(false)
  const isUserLoggedProfile = userLoggedData?.user.id === userId

  const { data: userData, isLoading } = useQuery<UserModel, Error>({
    queryKey: ['fetchUserById', userId],
    queryFn: async () => (await UsersProfileService.fetchUserById(userId)).data,
    retry: false,
    staleTime: 0
  })

  const { data: followStatusData, isLoading: isFollowStatusLoading } = useFollowStatus(userId, !isUserLoggedProfile)

  const { data: blockData } = useBlockStatus(userId, !isUserLoggedProfile)

  const isBlocked = !isUserLoggedProfile && (blockData?.isBlocked ?? false)
  const canViewReviews = isUserLoggedProfile || followStatusData?.status === FollowStatus.FOLLOWING

  const openFollowList = (initialTab: 'followers' | 'followings') => {
    if (!userData) return
    navigation.navigate('FollowListScreen', {
      userId: userData.id,
      username: userData.username,
      initialTab
    })
  }

  if (isLoading) {
    return (
      <Box bg="background">
        <ThemedText>CARREGANDO</ThemedText>
      </Box>
    )
  }

  if (!userData) return null

  if (isBlocked) {
    return (
      <>
        <Screen>
          <UsersProfileBlockedState userData={userData} />
        </Screen>
      </>
    )
  }

  return (
    <>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <UsersProfileTopBar userData={userData} onOpenOptions={() => setIsOptionsModalVisible(true)} />
          <UsersProfileHeaderScreen
            userData={userData}
            canViewReviews={canViewReviews}
            isReviewAccessLoading={isFollowStatusLoading}
            onOpenFollowers={() => openFollowList('followers')}
            onOpenFollowings={() => openFollowList('followings')}
          />
          <UserReviewsGrid
            userId={userId}
            canViewReviews={canViewReviews}
            isReviewAccessLoading={isFollowStatusLoading}
          />
        </Screen>
      </ScrollView>

      {!isUserLoggedProfile && (
        <>
          <UsersProfileOptionsModal
            userData={userData}
            visible={isOptionsModalVisible}
            onClose={() => setIsOptionsModalVisible(false)}
            onOpenReport={() => setIsReportModalVisible(true)}
          />
          <UsersProfileReportModal
            userData={userData}
            visible={isReportModalVisible}
            onClose={() => setIsReportModalVisible(false)}
          />
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
