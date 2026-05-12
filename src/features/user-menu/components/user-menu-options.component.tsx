import { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { Box, Divider, ThemedIcon, ThemedText } from '@src/shared/components'
import { useLogout } from '@src/shared/hooks'

import { UserMenuContactModal } from './user-menu-contact-modal.component'

export const UserMenuOptions = () => {
  const navigation = useNavigation<NavigationProp<UserMenuStackParamList>>()
  const [isContactModalVisible, setIsContactModalVisible] = useState(false)

  const { logout } = useLogout()

  return (
    <>
      <ThemedText size="xs" weight="semibold" variant="secondary" style={styles.sectionLabel}>
        conta
      </ThemedText>
      <Box gap={4}>
        <TouchableOpacity style={styles.actionContainer} onPress={() => navigation.navigate('UserEditProfile')}>
          <Box>
            <ThemedText weight="medium">editar perfil</ThemedText>
            <ThemedText size="sm" variant="secondary">nome, bio, foto</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer} onPress={() => navigation.navigate('UserPrivacyScreen')}>
          <Box>
            <ThemedText weight="medium">privacidade</ThemedText>
            <ThemedText size="sm" variant="secondary">perfil público</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer} onPress={() => navigation.navigate('TermsOfUseScreen')}>
          <Box>
            <ThemedText weight="medium">termos de uso</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
      </Box>

      <ThemedText size="xs" weight="semibold" variant="secondary" style={styles.sectionLabel}>
        no app
      </ThemedText>
      <Box gap={4}>
        <TouchableOpacity
          style={styles.actionContainer}
          onPress={() => navigation.navigate('NotificationPreferencesScreen')}
        >
          <Box>
            <ThemedText weight="medium">notificações</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer} onPress={() => setIsContactModalVisible(true)}>
          <Box>
            <ThemedText weight="medium">falar com a equipe</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer} onPress={() => navigation.navigate('UserDeleteAccountScreen')}>
          <Box>
            <ThemedText weight="medium">deletar conta</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
        <Divider />

        <TouchableOpacity style={styles.actionContainer} onPress={() => logout()}>
          <Box>
            <ThemedText weight="medium">deslogar</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </TouchableOpacity>
      </Box>

      <UserMenuContactModal visible={isContactModalVisible} onClose={() => setIsContactModalVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1
  }
})
