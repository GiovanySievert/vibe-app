import { TouchableOpacity } from 'react-native'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal/swipeable-modal.component'
import { UserModel } from '@src/shared/domain/users.model'

import { BlockService } from '../services'
import { BlockAction, GetBlockStatusResponse } from '../types'

type UsersProfileOptionsModalProps = {
  userData: UserModel
  visible: boolean
  onClose: () => void
}

export const UsersProfileOptionsModal: React.FC<UsersProfileOptionsModalProps> = ({ userData, visible, onClose }) => {
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = ['fetchBlockStatusById', userLoggedData?.user.id, userData.id]

  const { data: blockData } = useQuery<GetBlockStatusResponse, Error>({
    queryKey,
    queryFn: async () => (await BlockService.fetchBlockStatus(userData.id)).data,
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
      queryClient.setQueryData<GetBlockStatusResponse>(queryKey, { isBlocked: action === BlockAction.BLOCK })
      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) queryClient.setQueryData(queryKey, context.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  const handleBlock = () => {
    blockMutation.mutate(blockData?.isBlocked ? BlockAction.UNBLOCK : BlockAction.BLOCK)
    onClose()
  }

  const handleReport = () => {
    onClose()
  }

  return (
    <SwipeableModal visible={visible} height={180} onClose={onClose}>
      <Box pt={2} pb={4}>
        <TouchableOpacity onPress={handleBlock}>
          <Box flexDirection="row" alignItems="center" gap={3} pl={6} pr={6} pt={4} pb={4}>
            <ThemedIcon name={blockData?.isBlocked ? 'ShieldOff' : 'Shield'} color="textPrimary" size={20} />
            <ThemedText size="lg">{blockData?.isBlocked ? 'Desbloquear usuário' : 'Bloquear usuário'}</ThemedText>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReport}>
          <Box flexDirection="row" alignItems="center" gap={3} pl={6} pr={6} pt={4} pb={4}>
            <ThemedIcon name="TriangleAlert" color="textPrimary" size={20} />
            <ThemedText size="lg">Denunciar usuário</ThemedText>
          </Box>
        </TouchableOpacity>
      </Box>
    </SwipeableModal>
  )
}
