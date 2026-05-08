import { Alert, TouchableOpacity } from 'react-native'

import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal/swipeable-modal.component'
import { UserModel } from '@src/shared/domain/users.model'

import { useBlockMutation } from '../hooks/use-block-mutation.hook'
import { useBlockStatus } from '../hooks/use-block-status.hook'
import { BlockAction } from '../types'

type UsersProfileOptionsModalProps = {
  userData: UserModel
  visible: boolean
  onClose: () => void
  onOpenReport: () => void
}

export const UsersProfileOptionsModal: React.FC<UsersProfileOptionsModalProps> = ({ userData, visible, onClose, onOpenReport }) => {
  const { data: blockData } = useBlockStatus(userData.id)
  const blockMutation = useBlockMutation(userData.id)

  const handleBlock = () => {
    const isBlocked = blockData?.isBlocked
    const username = userData.username

    Alert.alert(
      isBlocked ? `Desbloquear @${username}?` : `Bloquear @${username}?`,
      isBlocked
        ? 'Ele poderá voltar a ver seu perfil e seus posts.'
        : 'Ele não poderá ver seu perfil nem seus posts.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: isBlocked ? 'Desbloquear' : 'Bloquear',
          style: isBlocked ? 'default' : 'destructive',
          onPress: () => {
            blockMutation.mutate(isBlocked ? BlockAction.UNBLOCK : BlockAction.BLOCK)
            onClose()
          }
        }
      ]
    )
  }

  const handleReport = () => {
    onClose()
    onOpenReport()
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
