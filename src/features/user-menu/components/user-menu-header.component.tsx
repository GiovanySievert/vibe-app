import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { UserData } from '@src/features/auth/domain'
import { Avatar, Box, Card, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

type userMenuHeaderProps = {
  userData: UserData
}

export const UserMenuHeader: React.FC<userMenuHeaderProps> = ({ userData }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

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
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() =>
                navigation.navigate('Modals', {
                  screen: 'UsersProfileScreen',
                  params: { userId: userData.id }
                })
              }
            >
              <ThemedText size="sm" weight="medium" style={styles.profileButtonText}>
                ver perfil
              </ThemedText>
            </TouchableOpacity>
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
