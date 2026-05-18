import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import { Box, Button, GoBackButton, Input, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useUploadImage } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'

import { EditableAvatar } from '../components'
import { UserProfileService } from '../service'

export const UserEditProfile = () => {
  const [authState, setAuthState] = useAtom(authStateAtom)
  const queryClient = useQueryClient()
  const { t } = useAppTranslation()

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
      queryClient.invalidateQueries({
        queryKey: ['fetchUserById', authState.user.id]
      })
    }
  })

  const hasChanges =
    name.trim() !== authState.user.name || bio.trim() !== (authState.user.bio ?? '') || avatarUri !== null

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">{t('userMenu.editProfile.title')}</ThemedText>
            <ThemedText variant="mono">{t('userMenu.editProfile.subtitle')}</ThemedText>
          </Box>
        </Box>

        <Box gap={6} pl={6} pr={6} pb={6}>
          <Box justifyContent="center" alignItems="center">
            <EditableAvatar currentUri={authState.user.image} onAvatarChange={setAvatarUri} />
          </Box>
          <Input label={t('userMenu.editProfile.usernameLabel')} value={authState.user.username ?? ''} disabled />
          <Input
            label={t('userMenu.editProfile.nameLabel')}
            value={name}
            onChangeText={setName}
            maxLength={100}
            autoCapitalize="words"
          />
          <Input
            label={t('userMenu.editProfile.bioLabel')}
            value={bio}
            onChangeText={setBio}
            placeholder={t('userMenu.editProfile.bioPlaceholder')}
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
              {t('common.save')}
            </ThemedText>
          </Button>
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
