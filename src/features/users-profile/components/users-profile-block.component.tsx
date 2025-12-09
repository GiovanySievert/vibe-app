import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

import { BlockService } from '../services'
import { BlockAction, GetBlockStatusResponse } from '../types'

type UsersProfileBlockProps = {
  userData: UserModel
}

export const UsersProfileBlock: React.FC<UsersProfileBlockProps> = ({ userData }) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = ['fetchBlockStatusById', userLoggedData?.user.id, userData.id]

  const fetchBlockStatus = async () => {
    const response = await BlockService.fetchBlockStatus(userData.id)

    return response.data
  }

  const { data: blockData, isLoading } = useQuery<GetBlockStatusResponse, Error>({
    queryKey,
    queryFn: fetchBlockStatus,
    retry: false,
    staleTime: 60 * 5
  })

  const blockMutation = useMutation({
    mutationFn: (action: BlockAction) => {
      if (action === BlockAction.BLOCK) return BlockService.block(userData.id)
      return BlockService.unblock(userData.id)
    },
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<GetBlockStatusResponse>(queryKey)

      const isBlocked = action === BlockAction.BLOCK

      queryClient.setQueryData<GetBlockStatusResponse>(queryKey, { isBlocked })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const handlePressToBlockOrUnBlock = () => {
    if (blockData?.isBlocked) {
      blockMutation.mutate(BlockAction.UNBLOCK)
    } else {
      blockMutation.mutate(BlockAction.BLOCK)
    }
  }

  const handleBlockText = () => {
    return blockData?.isBlocked ? 'Desbloquear' : 'Bloquear'
  }

  return (
    <Box pr={5} pl={5} mt={3}>
      <Button loading={isLoading || blockMutation.isPending} onPress={handlePressToBlockOrUnBlock}>
        <ThemedText weight="semibold" size="lg">
          {handleBlockText()}
        </ThemedText>
      </Button>
    </Box>
  )
}
