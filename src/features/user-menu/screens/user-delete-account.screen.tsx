import { Box } from '@src/shared/components'

import { DeleteAccount } from '../components'

export const UserDeleteAccountScreen = () => {
  return (
    <Box flex={1} bg="background" gap={6} p={6}>
      <DeleteAccount />
    </Box>
  )
}
