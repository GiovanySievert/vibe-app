import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { UsersProfileFollowList, UsersProfileHeaderScreen } from '@src/features/users-profile/components'
import { UsersProfileService } from '@src/features/users-profile/services'
import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

export const UserOwnProfileScreen = () => {
  const [authState] = useAtom(authStateAtom)
  const userId = authState.user.id
  const navigation = useNavigation<NativeStackNavigationProp<UserMenuStackParamList>>()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalType, setModalType] = useState<'followers' | 'followings'>('followers')

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
    return null
  }

  return (
    <>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <Box flexDirection="row" justifyContent="flex-end" pt={2} pr={2}>
            <TouchableOpacity onPress={() => navigation.navigate('UserMenuMain')}>
              <ThemedIcon name="EllipsisVertical" color="textPrimary" size={22} />
            </TouchableOpacity>
          </Box>
          <UsersProfileHeaderScreen
            userData={userData}
            onOpenFollowers={handleOpenFollowers}
            onOpenFollowings={handleOpenFollowings}
          />
        </Screen>
      </ScrollView>

      <UsersProfileFollowList
        userId={userData.id}
        type={modalType}
        visible={isModalVisible}
        onClose={handleCloseModal}
        isUserLoggedProfile
      />
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
