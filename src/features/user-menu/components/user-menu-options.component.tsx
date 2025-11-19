import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { Box, Card, Divider, ThemedIcon, ThemedText } from '@src/shared/components'
import { useLogout } from '@src/shared/hooks'

export const UserMenuOptions = () => {
  const navigation = useNavigation<NavigationProp<UserMenuStackParamList>>()

  const { logout } = useLogout()

  return (
    <>
      <ThemedText size="lg" weight="semibold">
        Geral
      </ThemedText>
      <Card bg="background" gap={4} mt={-3}>
        <TouchableOpacity style={styles.actionContainer} onPress={() => navigation.navigate('UserEditProfile')}>
          <Box flexDirection="row" gap={3} alignItems="center">
            <ThemedIcon name="Pen" color="textPrimary" size={16} />
            <ThemedText weight="medium">Editar perfil</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer}>
          <Box flexDirection="row" gap={3} alignItems="center">
            <ThemedIcon name="MapPin" color="textPrimary" size={16} />
            <ThemedText weight="medium">Localizaçāo</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer}>
          <Box flexDirection="row" gap={3} alignItems="center">
            <ThemedIcon name="Book" color="textPrimary" size={16} />
            <ThemedText weight="medium">Termos de uso</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.actionContainer}>
          <Box flexDirection="row" gap={3} alignItems="center">
            <ThemedIcon name="Handshake" color="textPrimary" size={16} />
            <ThemedText weight="medium">Deletar conta</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
      </Card>
      <Card bg="background" gap={4}>
        <TouchableOpacity style={styles.actionContainer} onPress={() => logout()}>
          <Box flexDirection="row" gap={3} alignItems="center">
            <ThemedIcon name="LogOut" color="textPrimary" size={16} />
            <ThemedText weight="medium">Deslogar</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
      </Card>
    </>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  }
})
