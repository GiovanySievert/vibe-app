import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Card, ThemedText } from '@src/shared/components'
import { UserModel } from '@src/shared/domain/users.model'

type userMenuHeaderProps = {
  userData: UserModel
}

export const UserMenuHeader: React.FC<userMenuHeaderProps> = ({ userData }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  return (
    <Card bg="background" gap={4}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between">
        <Box flexDirection="row" alignItems="center" gap={4}>
          <Avatar size="sm" />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Modals', {
                screen: 'UsersProfileScreen',
                params: { userId: userData.id }
              })
            }
          >
            <ThemedText variant="primary" size="lg" weight="semibold">
              Giovany Sievert
            </ThemedText>

            <ThemedText variant="secondary" size="sm">
              Ver perfil
            </ThemedText>
          </TouchableOpacity>
        </Box>
      </Box>
    </Card>
  )
}
