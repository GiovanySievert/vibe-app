import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Switch } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useMutation } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { theme } from '@src/shared/constants/theme'
import { useUploadImage } from '@src/shared/hooks'

import { PlaceReviewService } from '../services/place-review.service'

type Props = NativeStackScreenProps<ModalNavigatorParamsList, 'PlaceReviewPostScreen'>

type Rating = 'crowded' | 'dead'

export const PlaceReviewPostScreen: React.FC<Props> = ({ route, navigation }) => {
  const { placeId, placeName } = route.params
  const [rating, setRating] = useState<Rating | null>(null)
  const [comment, setComment] = useState('')
  const [placePhotoUri, setPlacePhotoUri] = useState<string | null>(null)
  const [selfieUri, setSelfieUri] = useState<string | null>(null)
  const [selfieFriendsOnly, setSelfieFriendsOnly] = useState(false)

  const launchCamera = async (type: 'place' | 'selfie') => {
    await ImagePicker.requestCameraPermissionsAsync()
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.8,
        ...(type === 'selfie' && { cameraType: ImagePicker.CameraType.front })
      })
      if (!result.canceled && result.assets[0]) {
        if (type === 'place') {
          setPlacePhotoUri(result.assets[0].uri)
        } else {
          setSelfieUri(result.assets[0].uri)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const { upload, uploading } = useUploadImage()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const [placeImageUrl, selfieUrl] = await Promise.all([
        placePhotoUri ? upload(placePhotoUri, 'reviews') : Promise.resolve(undefined),
        selfieUri ? upload(selfieUri, 'reviews') : Promise.resolve(undefined)
      ])

      return PlaceReviewService.create({
        placeId,
        placeName,
        rating: rating!,
        placeImageUrl,
        selfieUrl,
        selfieFriendsOnly: selfieUri ? selfieFriendsOnly : false,
        comment: comment.trim() || undefined
      })
    },
    onSuccess: () => navigation.goBack()
  })

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Box flex={1} bg="background">
        <Box p={5} flexDirection="row" alignItems="center" justifyContent="space-between">
          <ThemedText weight="medium" size="lg">
            Nova review
          </ThemedText>
          <Button variant="ghost" onPress={() => navigation.goBack()}>
            <ThemedIcon name="X" size={20} color="textSecondary" />
          </Button>
        </Box>

        <Box flexDirection="row" gap={2} pl={5} pr={5} mb={4}>
          <Box flex={1}>
            <Button variant="outline" type="secondary" onPress={() => launchCamera('place')}>
              {placePhotoUri ? (
                <Image source={{ uri: placePhotoUri }} style={styles.thumbnail} resizeMode="cover" />
              ) : (
                <>
                  <ThemedIcon name="Camera" size={20} color="textSecondary" />
                  <ThemedText size="sm" color="textSecondary">
                    Foto do local
                  </ThemedText>
                </>
              )}
            </Button>
          </Box>
          <Box flex={1}>
            <Button variant="outline" type="secondary" onPress={() => launchCamera('selfie')}>
              {selfieUri ? (
                <Image source={{ uri: selfieUri }} style={styles.thumbnail} resizeMode="cover" />
              ) : (
                <>
                  <ThemedIcon name="Camera" size={20} color="textSecondary" />
                  <ThemedText size="sm" color="textSecondary">
                    Selfie
                  </ThemedText>
                </>
              )}
            </Button>
          </Box>
        </Box>

        <Box pl={5} pr={5} mb={2}>
          <Box style={styles.privacyCard}>
            <Box flex={1} pr={3}>
              <ThemedText weight="medium" size="sm">
                Selfie apenas para amigos?
              </ThemedText>
              <ThemedText size="xs" color="textSecondary" style={styles.privacyDescription}>
                Quem segue você ainda vê a selfie. Se desligado, ela aparece para todo mundo.
              </ThemedText>
            </Box>
            <Switch
              value={selfieFriendsOnly}
              onValueChange={setSelfieFriendsOnly}
              disabled={!selfieUri}
              trackColor={{
                true: theme.colors.primary,
                false: theme.colors.border
              }}
            />
          </Box>
        </Box>

        <Box p={5} gap={4}>
          <ThemedText weight="medium" size="md">
            Como estava o local?
          </ThemedText>
          <Box flexDirection="row" gap={3}>
            <Box flex={1}>
              <Button
                variant={rating === 'crowded' ? 'solid' : 'outline'}
                type={rating === 'crowded' ? 'primary' : 'secondary'}
                onPress={() => setRating('crowded')}
              >
                <ThemedText
                  weight="medium"
                  size="md"
                  style={{ color: rating === 'crowded' ? '#FFFFFF' : theme.colors.textPrimary }}
                >
                  Lotado
                </ThemedText>
              </Button>
            </Box>
            <Box flex={1}>
              <Button
                variant={rating === 'dead' ? 'solid' : 'outline'}
                type={rating === 'dead' ? 'primary' : 'secondary'}
                onPress={() => setRating('dead')}
              >
                <ThemedText
                  weight="medium"
                  size="md"
                  style={{ color: rating === 'dead' ? '#FFFFFF' : theme.colors.textPrimary }}
                >
                  Vazio
                </ThemedText>
              </Button>
            </Box>
          </Box>

          <Input
            label="descrição (opcional)"
            multiline
            multilineHeight={100}
            maxLength={300}
            value={comment}
            onChangeText={setComment}
          />

          <Button onPress={() => mutate()} loading={isPending || uploading} disabled={!rating}>
            <ThemedText weight="medium" size="lg" style={{ color: '#FFFFFF' }}>
              Postar
            </ThemedText>
          </Button>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  thumbnail: {
    width: '100%',
    height: 100,
    borderRadius: 8
  },
  privacyCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  privacyDescription: {
    marginTop: 4,
    lineHeight: 18
  }
})
