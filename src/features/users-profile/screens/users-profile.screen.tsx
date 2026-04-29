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
  UsersProfileActions,
  UsersProfileFollowList,
  UsersProfileHeaderScreen,
  UsersProfileOptionsModal,
  UsersProfileTopBar
} from '../components'
import { UsersProfileService } from '../services'

type UsersProfileScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'UsersProfileScreen'>

export const UsersProfileScreen: React.FC<UsersProfileScreenScreenProps> = ({ route }) => {
  const userId = route.params?.userId
  const { data: userLoggedData } = authClient.useSession()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'followers' | 'followings'>('followers')
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false)
  const isUserLoggedProfile = userLoggedData?.user.id === userId

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
          <UsersProfileTopBar userData={userData} onOpenOptions={() => setIsOptionsModalVisible(true)} />
          <UsersProfileHeaderScreen
            userData={userData}
            onOpenFollowers={() => {
              setModalType('followers')
              setIsModalVisible(true)
            }}
            onOpenFollowings={() => {
              setModalType('followings')
              setIsModalVisible(true)
            }}
          />
          <UsersProfileActions />
          <UserReviewsGrid userId={userId} />
        </Screen>
      </ScrollView>

      <UsersProfileFollowList
        userId={userData.id}
        type={modalType}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        isUserLoggedProfile={isUserLoggedProfile}
      />

      {!isUserLoggedProfile && (
        <UsersProfileOptionsModal
          userData={userData}
          visible={isOptionsModalVisible}
          onClose={() => setIsOptionsModalVisible(false)}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
