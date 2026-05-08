import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authClient } from '@src/services/api/auth-client'

import { BlockService } from '../services'
import { BlockAction, GetBlockStatusResponse } from '../types'
import { getBlockStatusQueryKey } from './use-block-status.hook'

export const useBlockMutation = (targetUserId: string) => {
  const { data: session } = authClient.useSession()
  const queryClient = useQueryClient()

  const queryKey = getBlockStatusQueryKey(session?.user.id, targetUserId)

  return useMutation({
    mutationFn: (action: BlockAction) => {
      if (action === BlockAction.BLOCK) return BlockService.block(targetUserId)
      return BlockService.unblock(targetUserId)
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
}
