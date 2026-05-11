import React from 'react'

import { FollowRequestType } from '@src/features/users-profile/types'
import { Box, Button, ThemedText } from '@src/shared/components'

interface FollowRequestActionsProps {
  type: FollowRequestType
  requestId: string
  onAccept: (requestId: string) => void
  onReject: (requestId: string) => void
  onCancel: (requestId: string) => void
}

export const FollowRequestActions = ({ type, requestId, onAccept, onReject, onCancel }: FollowRequestActionsProps) => {
  if (type === FollowRequestType.RECEIVED) {
    return (
      <Box flexDirection="row" gap={2}>
        <Button size="sm" onPress={() => onAccept(requestId)}>
          <ThemedText color="background" weight="bold" size="xs">
            aceitar
          </ThemedText>
        </Button>
        <Button size="sm" variant="outline" type="secondary" onPress={() => onReject(requestId)}>
          <ThemedText color="textPrimary" weight="bold" size="xs">
            ignorar
          </ThemedText>
        </Button>
      </Box>
    )
  }

  return (
    <Button size="sm" variant="outline" type="secondary" onPress={() => onCancel(requestId)}>
      <ThemedText color="textPrimary" weight="bold" size="xs">
        cancelar
      </ThemedText>
    </Button>
  )
}
