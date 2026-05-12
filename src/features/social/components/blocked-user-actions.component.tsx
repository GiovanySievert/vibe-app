import React from 'react'
import { Alert } from 'react-native'

import { Button, ThemedText } from '@src/shared/components'

interface BlockedUserActionsProps {
  userId: string
  username: string
  onUnblock: (userId: string) => void
}

export const BlockedUserActions = ({ userId, username, onUnblock }: BlockedUserActionsProps) => {
  const handlePress = () => {
    Alert.alert(`Desbloquear @${username}?`, 'Ele poderá voltar a ver seu perfil e seus posts.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Desbloquear', style: 'default', onPress: () => onUnblock(userId) }
    ])
  }

  return (
    <Button size="sm" variant="outline" type="secondary" onPress={handlePress}>
      <ThemedText color="textPrimary" weight="bold" size="xs">
        desbloquear
      </ThemedText>
    </Button>
  )
}
