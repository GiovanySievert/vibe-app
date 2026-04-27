import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

export const AuthTermsScreen = () => {
  const navigation = useNavigation()

  return (
    <Screen gradient>
      <Box pl={6} pr={6} pt={2} pb={6} flexDirection="row" alignItems="center">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
        </TouchableOpacity>
      </Box>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <ThemedText variant="title" size="2xl" color="textPrimary">
          termos de Uso
        </ThemedText>

        <ThemedText variant="primary" color="textSecondary">
          vamos vender seus dados
        </ThemedText>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  goBackButton: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: theme.colors.textTertiary,
    padding: 6
  }
})
