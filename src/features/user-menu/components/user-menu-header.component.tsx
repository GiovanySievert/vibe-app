import { StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { UserData } from '@src/features/auth/domain'
import { Avatar, Box, Card, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type userMenuHeaderProps = {
  userData: UserData
}

export const UserMenuHeader: React.FC<userMenuHeaderProps> = ({ userData }) => {
  const navigation = useNavigation<NavigationProp<UserMenuStackParamList>>()
  const { t } = useAppTranslation()

  return (
    <Card bg="background" gap={4} p={4}>
      <Box flexDirection="row" alignItems="center" gap={4}>
        <Avatar />
        <Box flex={1}>
          <ThemedText variant="primary" size="lg" weight="semibold">
            {userData.name}
          </ThemedText>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="column">
              <ThemedText variant="secondary" size="sm">
                @{userData.username} ·
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                {userData.email}
              </ThemedText>
            </Box>
            <Touchable style={styles.profileButton} onPress={() => navigation.goBack()}>
              <ThemedText size="sm" weight="medium" style={styles.profileButtonText}>
                {t('userMenu.profile.viewProfile')}
              </ThemedText>
            </Touchable>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

const styles = StyleSheet.create({
  profileButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  profileButtonText: {
    color: theme.colors.primary
  }
})
