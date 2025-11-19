import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Avatar, Box, Button, Card, Input, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

export const UserEditProfile = () => {
  const [authState] = useAtom(authStateAtom)
  const [form, setForm] = useState({
    username: authState.user.username,
    email: authState.user.email,
    name: authState.user.name,
    image: authState.user.image
  })

  return (
    <Screen>
      <Box flex={1} bg="background" gap={6} p={6}>
        <ThemedText variant="primary" weight="semibold" size="lg">
          Editar Perfil
        </ThemedText>
        <Box justifyContent="center" alignItems="center">
          <Box style={styles.avatarContainer}>
            <Avatar />
            <Box style={styles.editIcon}>
              <ThemedIcon name="Pen" size={16} color="textPrimary" />
            </Box>
          </Box>
        </Box>
        <Card gap={6}>
          <Input label="Username" value={form.username} disabled />
          <Input label="Nome" value={form.name} />
          <Input label="E-mail" value={form.email} />

          <Button>
            <ThemedText variant="primary" weight="semibold" size="lg">
              Salvar
            </ThemedText>
          </Button>
        </Card>
      </Box>
    </Screen>
  )
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 6
  }
})
