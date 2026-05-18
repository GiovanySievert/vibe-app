import { ScrollView, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Box, ThemedText, Touchable } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

export const AuthPrivacyScreen = () => {
  const navigation = useNavigation()

  return (
    <Screen gradient>
      <Box pl={6} pr={6} pt={2} pb={6} flexDirection="row" alignItems="center">
        <Touchable onPress={() => navigation.goBack()} style={styles.goBackButton}>
          <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
        </Touchable>
      </Box>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}>
        <ThemedText variant="title" size="2xl" color="textPrimary">
          privacidade
        </ThemedText>
        <ThemedText variant="primary" color="textSecondary">
          vamos vernder seus dados
        </ThemedText>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  goBackButton: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: theme.colors.textSecondary,
    padding: 6
  }
})
