import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'

import { UserMenuHeader, UserMenuOptions } from '../components'

export const UserMenuScreen = () => {
  const [authState] = useAtom(authStateAtom)

  return (
    <Screen>
      <Box flex={1} bg="background" gap={6} p={6}>
        <UserMenuHeader />
        <UserMenuOptions />
        <ThemedText>1.0.1</ThemedText>
      </Box>
    </Screen>
  )
}
