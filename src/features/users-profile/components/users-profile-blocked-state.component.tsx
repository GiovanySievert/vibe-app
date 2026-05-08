import { Alert } from 'react-native'

import { Avatar, Box, Button, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

import { useBlockMutation } from '../hooks/use-block-mutation.hook'
import { BlockAction } from '../types'

type UsersProfileBlockedStateProps = {
  userData: UserModel
}

export const UsersProfileBlockedState: React.FC<UsersProfileBlockedStateProps> = ({ userData }) => {
  const unblockMutation = useBlockMutation(userData.id)

  const handleUnblock = () => {
    Alert.alert(`Desbloquear @${userData.username}?`, 'Ele poderá voltar a ver seu perfil e seus posts.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Desbloquear',
        style: 'default',
        onPress: () => unblockMutation.mutate(BlockAction.UNBLOCK)
      }
    ])
  }

  return (
    <Box flex={1} alignItems="center" justifyContent="center" gap={4} pt={12} pb={12}>
      <Avatar size="xl" uri={userData.image} />
      <ThemedText size="lg" weight="bold" color="textPrimary">
        @{userData.username}
      </ThemedText>
      <ThemedText size="md" color="textSecondary" weight="medium">
        Este perfil está bloqueado
      </ThemedText>
      <Box mt={2} pr={5} pl={5} style={{ width: '100%' }}>
        <Button loading={unblockMutation.isPending} onPress={handleUnblock}>
          <ThemedText weight="semibold" color="background" size="lg">
            Desbloquear
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}
