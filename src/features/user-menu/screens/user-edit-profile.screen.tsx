import React, { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Box, Button, Input, ThemedText } from '@src/shared/components'
import { useUploadImage } from '@src/shared/hooks'

import { EditableAvatar } from '../components'
import { UserProfileService } from '../service'

export const UserEditProfile = () => {
  const [authState, setAuthState] = useAtom(authStateAtom)
  const queryClient = useQueryClient()

  const [name, setName] = useState(authState.user.name)
  const [bio, setBio] = useState(authState.user.bio ?? '')
  const [avatarUri, setAvatarUri] = useState<string | null>(null)

  const { upload, uploading } = useUploadImage()

  const updateMutation = useMutation({
    mutationFn: async () => {
      const image = avatarUri ? await upload(avatarUri, 'avatars') : undefined
      return UserProfileService.update({
        name: name.trim(),
        bio: bio.trim() || undefined,
        image
      })
    },
    onSuccess: (response) => {
      setAuthState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: response.data.name,
          bio: response.data.bio,
          image: response.data.image
        }
      }))
      queryClient.invalidateQueries({ queryKey: ['fetchUserById', authState.user.id] })
    }
  })

  const hasChanges =
    name.trim() !== authState.user.name || bio.trim() !== (authState.user.bio ?? '') || avatarUri !== null

  return (
    <Box flex={1} bg="background" gap={6} p={6}>
      <Box justifyContent="center" alignItems="center">
        <EditableAvatar currentUri={authState.user.image} onAvatarChange={setAvatarUri} />
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
        disabled={!hasChanges || !name.trim() || updateMutation.isPending || uploading}
        loading={updateMutation.isPending || uploading}
        onPress={() => updateMutation.mutate()}
      >
        <ThemedText color="background" weight="semibold" size="lg">
          Salvar
        </ThemedText>
      </Button>
    </Box>
  )
}
