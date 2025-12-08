import React from 'react'

import { FollowRequestType } from '@src/features/users-profile/types'
import { Button, ThemedText } from '@src/shared/components'

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
      <>
        <Button onPress={() => onAccept(requestId)} flex={1}>
          <ThemedText variant="primary" weight="medium" size="lg">
            Aceitar
          </ThemedText>
        </Button>

        <Button onPress={() => onReject(requestId)} type="secondary" flex={1}>
          <ThemedText variant="primary" weight="medium" size="lg">
            Rejeitar
          </ThemedText>
        </Button>
      </>
    )
  }

  return (
    <Button onPress={() => onCancel(requestId)} type="secondary" variant="outline" flex={1}>
      <ThemedText variant="primary" weight="medium" size="lg">
        Cancelar
      </ThemedText>
    </Button>
  )
}
