import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { ProfileQrModal } from '@src/features/users-profile/components'
import { Box, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { UserModel } from '@src/shared/domain/users.model'

type UserOwnProfileActionsProps = {
  user: UserModel
}

export const UserOwnProfileActions: React.FC<UserOwnProfileActionsProps> = ({ user }) => {
  const navigation = useNavigation<NativeStackNavigationProp<UserMenuStackParamList>>()
  const [qrVisible, setQrVisible] = useState(false)

  return (
    <Box flexDirection="row" gap={3} pl={5} pr={5} pb={4} flex={1} justifyContent="space-between">
      <Touchable onPress={() => navigation.navigate('UserEditProfile')} style={styles.touchable}>
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
