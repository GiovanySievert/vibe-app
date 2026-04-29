import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { UserMenuStackParamList } from '@src/app/navigation/types'
import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

export const UserOwnProfileActions: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<UserMenuStackParamList>>()

  return (
    <Box flexDirection="row" gap={3} pl={5} pr={5} pb={4} flex={1} justifyContent="space-between">
      <TouchableOpacity onPress={() => navigation.navigate('UserEditProfile')} style={styles.touchable}>
        <ThemedText weight="semibold" size="sm" color="textPrimary">
          editar perfil
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {}} style={styles.touchable}>
        <ThemedText weight="semibold" size="sm" color="textPrimary">
          compartilhar
        </ThemedText>
      </TouchableOpacity>
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
