import React from 'react'
import { Alert } from 'react-native'

import { Button, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'

interface BlockedUserActionsProps {
  userId: string
  username: string
  onUnblock: (userId: string) => void
}

export const BlockedUserActions = ({ userId, username, onUnblock }: BlockedUserActionsProps) => {
  const { t } = useAppTranslation()

  const handlePress = () => {
    Alert.alert(t('usersProfile.block.unblockTitle', { username }), t('usersProfile.block.unblockMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('usersProfile.block.unblock'),
        style: 'default',
        onPress: () => onUnblock(userId)
      }
    ])
  }

  return (
    <Button size="sm" variant="outline" type="secondary" onPress={handlePress}>
      <ThemedText color="textPrimary" weight="bold" size="xs">
        {t('social.blockedUsers.unblock')}
      </ThemedText>
    </Button>
  )
}
