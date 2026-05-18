import { Alert } from 'react-native'

import { Box, ThemedIcon, ThemedText, Touchable } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal/swipeable-modal.component'
import { UserModel } from '@src/shared/domain/users.model'
import { useAppTranslation } from '@src/shared/i18n'

import { useBlockMutation } from '../hooks/use-block-mutation.hook'
import { useBlockStatus } from '../hooks/use-block-status.hook'
import { BlockAction } from '../types'

type UsersProfileOptionsModalProps = {
  userData: UserModel
  visible: boolean
  onClose: () => void
  onOpenReport: () => void
}

export const UsersProfileOptionsModal: React.FC<UsersProfileOptionsModalProps> = ({
  userData,
  visible,
  onClose,
  onOpenReport
}) => {
  const { t } = useAppTranslation()
  const { data: blockData } = useBlockStatus(userData.id)
  const blockMutation = useBlockMutation(userData.id)

  const handleBlock = () => {
    const isBlocked = blockData?.isBlocked
    const username = userData.username

    Alert.alert(
      isBlocked ? t('usersProfile.block.unblockTitle', { username }) : t('usersProfile.block.blockTitle', { username }),
      isBlocked ? t('usersProfile.block.unblockMsg') : t('usersProfile.block.blockMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: isBlocked ? t('usersProfile.block.unblock') : t('usersProfile.block.block'),
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
        <Touchable onPress={handleBlock}>
          <Box flexDirection="row" alignItems="center" gap={3} pl={6} pr={6} pt={4} pb={4}>
            <ThemedIcon name={blockData?.isBlocked ? 'ShieldOff' : 'Shield'} color="textPrimary" size={20} />
            <ThemedText size="lg">
              {blockData?.isBlocked ? t('usersProfile.block.unblockUser') : t('usersProfile.block.blockUser')}
            </ThemedText>
          </Box>
        </Touchable>

        <Touchable onPress={handleReport}>
          <Box flexDirection="row" alignItems="center" gap={3} pl={6} pr={6} pt={4} pb={4}>
            <ThemedIcon name="TriangleAlert" color="textPrimary" size={20} />
            <ThemedText size="lg">{t('usersProfile.block.reportUser')}</ThemedText>
          </Box>
        </Touchable>
      </Box>
    </SwipeableModal>
  )
}
