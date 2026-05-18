import { useState } from 'react'
import { StyleSheet } from 'react-native'

import { Box, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

import { ProfileQrModal } from './profile-qr-modal'

type UsersProfileActionsProps = {
  user: UserModel
}

export const UsersProfileActions: React.FC<UsersProfileActionsProps> = ({ user }) => {
  const [qrVisible, setQrVisible] = useState(false)

  return (
    <Box flexDirection="row" gap={3} pl={5} pr={5} pb={4} flex={1} justifyContent="space-between">
      <Touchable onPress={() => {}} style={styles.touchable}>
        <ThemedText weight="semibold" size="sm" color="textPrimary">
          editar perfil
        </ThemedText>
      </Touchable>
      <Touchable onPress={() => setQrVisible(true)} style={styles.touchable}>
        <ThemedText weight="semibold" size="sm" color="textPrimary">
          compartilhar
        </ThemedText>
      </Touchable>

      <ProfileQrModal visible={qrVisible} onClose={() => setQrVisible(false)} user={user} />
    </Box>
  )
}
const styles = StyleSheet.create({
  touchable: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.textTerciary,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})
