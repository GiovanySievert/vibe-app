import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useAtomValue } from 'jotai'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { authStateAtom } from '@src/features/auth/state'
import { Box, Divider, ThemedIcon, ThemedText, Touchable } from '@src/shared/components'
import { useLogout } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'

import { UserMenuContactModal } from './user-menu-contact-modal.component'

export const UserMenuOptions = () => {
  const navigation = useNavigation<NavigationProp<UserMenuStackParamList>>()
  const [isContactModalVisible, setIsContactModalVisible] = useState(false)
  const authState = useAtomValue(authStateAtom)
  const { t } = useAppTranslation()

  const { logout } = useLogout()

  return (
    <>
      <ThemedText size="xs" weight="semibold" variant="secondary" style={styles.sectionLabel}>
        {t('userMenu.options.accountSection')}
      </ThemedText>
      <Box gap={4}>
        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('UserEditProfile')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.editProfileTitle')}</ThemedText>
            <ThemedText size="sm" variant="secondary">
              {t('userMenu.options.editProfileSubtitle')}
            </ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('ChangeUsernameScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.usernameTitle')}</ThemedText>
            <ThemedText size="sm" variant="secondary">
              @{authState.user.username}
            </ThemedText>
          </Box>
          <Box flexDirection="row" alignItems="center" gap={2}>
            <ThemedText size="sm" variant="secondary">
              {t('userMenu.options.usernameChange')}
            </ThemedText>
            <ThemedIcon name="ChevronRight" color="textPrimary" />
          </Box>
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('UserBadgesScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.badgesTitle')}</ThemedText>
            <ThemedText size="sm" variant="secondary">
              {t('userMenu.options.badgesSubtitle')}
            </ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('UserPrivacyScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.privacyTitle')}</ThemedText>
            <ThemedText size="sm" variant="secondary">
              {t('userMenu.options.privacySubtitle')}
            </ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('TermsOfUseScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.termsOfUseTitle')}</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
      </Box>

      <ThemedText size="xs" weight="semibold" variant="secondary" style={styles.sectionLabel}>
        {t('userMenu.options.appSection')}
      </ThemedText>
      <Box gap={4}>
        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('LanguageSelectionScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.language.menuItem')}</ThemedText>
            <ThemedText size="sm" variant="secondary">
              {t('userMenu.language.menuItemHint')}
            </ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('NotificationPreferencesScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.notificationsTitle')}</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => setIsContactModalVisible(true)}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.contactTitle')}</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => navigation.navigate('UserDeleteAccountScreen')}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.deleteAccountTitle')}</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
        <Divider />

        <Touchable style={styles.actionContainer} onPress={() => logout()}>
          <Box>
            <ThemedText weight="medium">{t('userMenu.options.logoutTitle')}</ThemedText>
          </Box>
          <ThemedIcon name="ChevronRight" color="textPrimary" />
        </Touchable>
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
