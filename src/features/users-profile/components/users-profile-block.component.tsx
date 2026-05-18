import { useEffect } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'
import { useAppTranslation } from '@src/shared/i18n'

import { getBlockStatusQueryKey, useBlockStatus } from '../hooks/use-block-status.hook'
import { BlockService } from '../services'
import { BlockAction, GetBlockStatusResponse } from '../types'

type UsersProfileBlockProps = {
  userData: UserModel
  onBlockChange?: (isBlocked: boolean) => void
}

export const UsersProfileBlock: React.FC<UsersProfileBlockProps> = ({ userData, onBlockChange }) => {
  const { t } = useAppTranslation()
  const { data: userLoggedData } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = getBlockStatusQueryKey(userLoggedData?.user.id, userData.id)

  const { data: blockData, isLoading } = useBlockStatus(userData.id)

  useEffect(() => {
    if (blockData !== undefined) {
      onBlockChange?.(blockData.isBlocked)
    }
  }, [blockData, onBlockChange])

  const blockMutation = useMutation({
    mutationFn: (action: BlockAction) => {
      if (action === BlockAction.BLOCK) return BlockService.block(userData.id)
      return BlockService.unblock(userData.id)
    },
    onMutate: async (action) => {
      await queryClient.cancelQueries({ queryKey })

      const previousData = queryClient.getQueryData<GetBlockStatusResponse>(queryKey)

      const isBlocked = action === BlockAction.BLOCK
      onBlockChange?.(isBlocked)

      queryClient.setQueryData<GetBlockStatusResponse>(queryKey, { isBlocked })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
        onBlockChange?.(context.previousData.isBlocked)
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
    return blockData?.isBlocked ? t('usersProfile.block.unblock') : t('usersProfile.block.block')
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
