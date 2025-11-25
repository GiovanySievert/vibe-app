import { Box } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'

import { DeleteAccount } from '../components'

export const UserDeleteAccountScreen = () => {
  return (
    <Screen>
      <Box flex={1} bg="background" gap={6} p={6}>
        <DeleteAccount />
      </Box>
    </Screen>
  )
}
