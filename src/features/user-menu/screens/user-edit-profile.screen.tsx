import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Avatar, Box, Button, Input, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { UserProfileService } from '../service'

export const UserEditProfile = () => {
  const [authState, setAuthState] = useAtom(authStateAtom)
  const queryClient = useQueryClient()

  const [name, setName] = useState(authState.user.name)
  const [bio, setBio] = useState(authState.user.bio ?? '')

  const updateMutation = useMutation({
    mutationFn: () =>
      UserProfileService.update({
        name: name.trim(),
        bio: bio.trim() || undefined
      }),
    onSuccess: (response) => {
      setAuthState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: response.data.name,
          bio: response.data.bio
        }
      }))
      queryClient.invalidateQueries({ queryKey: ['fetchUserById', authState.user.id] })
    }
  })

  const hasChanges = name.trim() !== authState.user.name || bio.trim() !== (authState.user.bio ?? '')

  return (
    <Box flex={1} bg="background" gap={6} p={6}>
      <Box justifyContent="center" alignItems="center">
        <Box style={styles.avatarContainer}>
          <Avatar />
          <Box style={styles.editIcon}>
            <ThemedIcon name="Pen" size={16} color="textPrimary" />
          </Box>
        </Box>
      </Box>
      <Input label="username" value={authState.user.username ?? ''} disabled />
      <Input label="nome" value={name} onChangeText={setName} maxLength={100} autoCapitalize="words" />
      <Input
        label="bio"
        value={bio}
        onChangeText={setBio}
        placeholder="..."
        multiline
        multilineHeight={80}
        maxLength={300}
        autoCapitalize="sentences"
        autoCorrect
      />

      <Button
        disabled={!hasChanges || !name.trim() || updateMutation.isPending}
        loading={updateMutation.isPending}
        onPress={() => updateMutation.mutate()}
      >
        <ThemedText color="background" weight="semibold" size="lg">
          Salvar
        </ThemedText>
      </Button>
    </Box>
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
