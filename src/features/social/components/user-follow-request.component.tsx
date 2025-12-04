import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { FollowRequestsService } from '@src/features/users-profile/services'
import { ListUserAllFollowRequestsResponse } from '@src/features/users-profile/types'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Button, Divider, ThemedText } from '@src/shared/components'

export const UserFollowRequests = () => {
  const { data: userLoggedData } = authClient.useSession()
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const queryClient = useQueryClient()

  const fetchUser = async () => {
    const response = await FollowRequestsService.listUserAllFollowRequests()
    return response.data
  }

  const { data: userFollowRequestsData, isLoading } = useQuery<ListUserAllFollowRequestsResponse[], Error>({
    queryKey: ['fetchUserById', userLoggedData?.user.id],
    queryFn: fetchUser,
    retry: false,
    staleTime: 60 * 5
  })

  const acceptFollowRequest = async (requestFollowId: string) => {
    try {
      queryClient.setQueryData(['fetchUserById', userLoggedData?.user.id], (prevData: any[]) =>
        prevData.filter((req) => req.id !== requestFollowId)
      )

      await FollowRequestsService.acceptFollowRequest(requestFollowId)
    } catch {
      queryClient.invalidateQueries({
        queryKey: ['fetchUserById', userLoggedData?.user.id]
      })
    }
  }

  const rejectFollowRequest = async (requestFollowId: string) => {
    try {
      queryClient.setQueryData(['fetchUserById', userLoggedData?.user.id], (prevData: any[]) =>
        prevData.filter((req) => req.id !== requestFollowId)
      )

      await FollowRequestsService.rejectFollowRequest(requestFollowId)
    } catch {
      queryClient.invalidateQueries({
        queryKey: ['fetchUserById', userLoggedData?.user.id]
      })
    }
  }

  if (!userFollowRequestsData?.length || isLoading) {
    return
  }

  return (
    <Box mr={5} ml={5} gap={3}>
      <ThemedText>Solicitações</ThemedText>
      <Box gap={3}>
        {userFollowRequestsData.map((userFollowRequest, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Modals', {
                  screen: 'UsersProfileScreen',
                  params: { userId: userFollowRequest.requesterId }
                })
              }
              key={userFollowRequest.id}
            >
              <Box flexDirection="column" justifyContent="space-between" gap={4} mb={4}>
                <Box flexDirection="row" alignItems="center" gap={3}>
                  <Avatar ring={0} uri={userFollowRequest.requesterAvatar} size="sm" />
                  <ThemedText color="textPrimary" weight="semibold">
                    {userFollowRequest.requesterUsername}
                  </ThemedText>
                </Box>
                <Box flexDirection="row" gap={2}>
                  <Button onPress={() => acceptFollowRequest(userFollowRequest.id)} flex={1}>
                    <ThemedText variant="primary" weight="medium" size="lg">
                      Aceitar
                    </ThemedText>
                  </Button>

                  <Button onPress={() => rejectFollowRequest(userFollowRequest.id)} type="secondary" flex={1}>
                    <ThemedText variant="primary" weight="medium" size="lg">
                      Rejeitar
                    </ThemedText>
                  </Button>
                </Box>
              </Box>
              {index !== userFollowRequestsData.length - 1 && <Divider />}
            </TouchableOpacity>
          )
        })}
      </Box>
    </Box>
  )
}
