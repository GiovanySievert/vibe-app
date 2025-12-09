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
  UsersProfileBlock,
  UsersProfileFollowActions,
  UsersProfileFollowList,
  UsersProfileHeaderScreen
} from '../components'
import { UsersProfileService } from '../services'

type UsersProfileScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'UsersProfileScreen'>

export const UsersProfileScreen: React.FC<UsersProfileScreenScreenProps> = ({ route }) => {
  const userId = route.params?.userId
  const { data: userLoggedData } = authClient.useSession()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'followers' | 'followings'>('followers')
  const isUserLoggedProfile = userLoggedData?.user.id === userId

  const fetchUser = async () => {
    const response = await UsersProfileService.fetchUserById(userId)
    return response.data
  }
  const { data: userData, isLoading } = useQuery<UserModel, Error>({
    queryKey: ['fetchUserById', userId],
    queryFn: fetchUser,
    retry: false,
    staleTime: 0
  })

  const handleOpenFollowers = () => {
    setModalType('followers')
    setIsModalVisible(true)
  }

  const handleOpenFollowings = () => {
    setModalType('followings')
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  if (isLoading) {
    return (
      <Box bg="background">
        <ThemedText>CARREGANDO</ThemedText>
      </Box>
    )
  }

  if (!userData) {
    return
  }

  return (
    <>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <UsersProfileHeaderScreen
            userData={userData}
            onOpenFollowers={handleOpenFollowers}
            onOpenFollowings={handleOpenFollowings}
          />
          {!isUserLoggedProfile && <UsersProfileFollowActions userData={userData} />}
          {!isUserLoggedProfile && <UsersProfileBlock userData={userData} />}
        </Screen>
      </ScrollView>

      <UsersProfileFollowList
        userId={userData.id}
        type={modalType}
        visible={isModalVisible}
        onClose={handleCloseModal}
        isUserLoggedProfile={isUserLoggedProfile}
      />
    </>
  )
}

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  },
  relativeContainer: {
    flex: 1
  },
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
