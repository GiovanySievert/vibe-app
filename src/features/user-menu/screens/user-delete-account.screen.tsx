import { ScrollView } from 'react-native'

import { Box, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'

import { DeleteAccount } from '../components'

export const UserDeleteAccountScreen = () => {
  return (
    <Screen gradient>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Box pl={5} pr={5} pt={4} pb={2} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box flex={1}>
            <ThemedText variant="title">deletar conta</ThemedText>
            <ThemedText variant="mono" color="textSecondary">
              ação · permanente
            </ThemedText>
          </Box>
        </Box>

        <Box pl={5} pr={5} pt={6} pb={6}>
          <DeleteAccount />
        </Box>
      </ScrollView>
    </Screen>
  )
}
