import { Alert } from 'react-native'

import { Avatar, Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'
import { useAppTranslation } from '@src/shared/i18n'

import { useBlockMutation } from '../hooks/use-block-mutation.hook'
import { BlockAction } from '../types'

type UsersProfileBlockedStateProps = {
  userData: UserModel
}

export const UsersProfileBlockedState: React.FC<UsersProfileBlockedStateProps> = ({ userData }) => {
  const { t } = useAppTranslation()
  const unblockMutation = useBlockMutation(userData.id)

  const handleUnblock = () => {
    Alert.alert(
      t('usersProfile.block.unblockTitle', { username: userData.username }),
      t('usersProfile.block.unblockMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('usersProfile.block.unblock'),
          style: 'default',
          onPress: () => unblockMutation.mutate(BlockAction.UNBLOCK)
        }
      ]
    )
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center" gap={4} pt={12} pb={12}>
      <Avatar size="xl" uri={userData.image} />
      <ThemedText size="lg" weight="bold" color="textPrimary">
        @{userData.username}
      </ThemedText>
      <ThemedText size="md" color="textSecondary" weight="medium">
        {t('usersProfile.block.blockedTitle')}
      </ThemedText>
      <Box mt={2} pr={5} pl={5} style={{ width: '100%' }}>
        <Button loading={unblockMutation.isPending} onPress={handleUnblock}>
          <ThemedText weight="semibold" color="background" size="lg">
            {t('usersProfile.block.unblock')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}
