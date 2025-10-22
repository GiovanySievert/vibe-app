import { useState } from 'react'

import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { useLogout } from '@src/shared/hooks'

import { DeleteAccount } from '../components'

export const UserMenuScreen = () => {
  const [authState] = useAtom(authStateAtom)
  const [shouldShowDeleteAccountInput, setShouldShowDeleteAccountInput] = useState<boolean>(false)
  const { logout } = useLogout()

  return (
    <Screen>
      <Box flex={1} bg="background" gap={6} p={6}>
        <ThemedText>Usermenu: {authState.user.email}</ThemedText>
        <Button onPress={() => logout()}>
          <ThemedText>Deslogar</ThemedText>
        </Button>

        {!shouldShowDeleteAccountInput ? (
          <Button onPress={() => setShouldShowDeleteAccountInput(true)}>
            <ThemedText>Deletar conta</ThemedText>
          </Button>
        ) : (
          <DeleteAccount />
        )}
      </Box>
    </Screen>
  )
}
