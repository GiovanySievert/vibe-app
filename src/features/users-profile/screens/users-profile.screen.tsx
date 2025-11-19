import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

import { UsersProfileFollowActions, UsersProfileHeaderScreen } from '../components'
import { UsersProfileService } from '../services'

type UsersProfileScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'UsersProfileScreen'>

export const UsersProfileScreen: React.FC<UsersProfileScreenScreenProps> = ({ route }) => {
  const userId = route.params?.userId

  const fetchUser = async () => {
    const response = await UsersProfileService.fetchUserById(userId)
    return response.data
  }

  const { data: userData, isLoading } = useQuery<UserModel, Error>({
    queryKey: ['fetchUserById'],
    queryFn: fetchUser,
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

  if (!userData) {
    return
  }

  return (
    <Box flex={1} bg="background">
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <UsersProfileHeaderScreen userData={userData} />
          <UsersProfileFollowActions userData={userData} />
        </Screen>
      </ScrollView>
    </Box>
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
