import { ScrollView, StyleSheet } from 'react-native'

import { Box, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

export const TermsOfUseScreen = () => {
  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">termos de uso</ThemedText>
            <ThemedText variant="mono">o combinado · regras</ThemedText>
          </Box>
        </Box>

        <Box pl={6} pr={6} pb={6} gap={6}>
          <ThemedText>Vamos vender seus dados.</ThemedText>
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
