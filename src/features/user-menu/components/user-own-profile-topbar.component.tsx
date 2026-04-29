import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { Box, ThemedIcon, ThemedText } from '@src/shared/components'

type UserOwnProfileTopBarProps = {
  username: string
}

export const UserOwnProfileTopBar: React.FC<UserOwnProfileTopBarProps> = ({ username }) => {
  const navigation = useNavigation<NativeStackNavigationProp<UserMenuStackParamList>>()

  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between" pl={5} pr={5}>
      <ThemedText variant="mono" size="lg" color="textPrimary">
        @{username}
      </ThemedText>
      <TouchableOpacity onPress={() => navigation.navigate('UserMenuMain')}>
        <ThemedIcon name="EllipsisVertical" color="textPrimary" size={22} />
      </TouchableOpacity>
    </Box>
  )
}
