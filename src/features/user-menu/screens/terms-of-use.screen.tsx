import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'

export const TermsOfUseScreen = () => {
  return (
    <Screen>
      <Box flex={1} bg="background" gap={6} p={6}>
        <ThemedText>Vamos vender seus dados.</ThemedText>
      </Box>
    </Screen>
  )
}
