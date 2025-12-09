import React from 'react'

import { Button, ThemedText } from '@src/shared/components'

interface BlockedUserActionsProps {
  userId: string
  onUnblock: (userId: string) => void
}

export const BlockedUserActions = ({ userId, onUnblock }: BlockedUserActionsProps) => {
  return (
    <Button onPress={() => onUnblock(userId)} type="secondary" variant="outline" flex={1}>
      <ThemedText variant="primary" weight="medium" size="lg">
        Desbloquear
      </ThemedText>
    </Button>
  )
}
