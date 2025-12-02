import { useQuery } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

import { FollowService } from '../services'

type UsersProfileFollowActionsProps = {
  userData: UserModel
}

export const UsersProfileFollowActions: React.FC<UsersProfileFollowActionsProps> = ({ userData }) => {
  const { data: userLoggedData } = authClient.useSession()

  const fetchUser = async () => {
    const response = await FollowService.checkIfUserFollows(userData.id)
    return response.data
  }

  const { data: checkIfUserFollowsData, isLoading } = useQuery<boolean, Error>({
    queryKey: ['fetchUserById', userLoggedData?.user.id, userData.id],
    queryFn: fetchUser,
    retry: false,
    staleTime: 60 * 5
  })

  const handlePressToUnfollowOrUnfollow = async () => {
    if (!checkIfUserFollowsData) {
      await FollowService.requestFollow(userData.id)
      return
    } else {
      await FollowService.unfollow(userData.id)
    }
  }

  if (!isLoading) {
    return
  }

  return (
    <Box pr={5} pl={5} mt={3}>
      <Button loading={isLoading} onPress={() => handlePressToUnfollowOrUnfollow()}>
        <ThemedText weight="semibold" size="lg">
          {!checkIfUserFollowsData ? 'Seguir' : 'Seguindo'}
        </ThemedText>
      </Button>
    </Box>
  )
}
