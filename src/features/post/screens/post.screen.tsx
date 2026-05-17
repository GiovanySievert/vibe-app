import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { useAtomValue } from 'jotai'

import { PostPreselectedPlace, PostStackParamList, TabsNavigatorParamsList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers/toast.provider'
import { usePlacesNearMe } from '@src/features/home/hooks/use-places-near-me.hook'
import {
  PlaceReviewApiErrorBody,
  PlaceReviewErrorCode,
  placeReviewErrorMessage
} from '@src/features/places/domain/place-review-error.model'
import { PlaceReviewService } from '@src/features/places/services/place-review.service'
import { PostPhotoStep, PostPhotoType, PostPlaceStep, PostRating, PostReviewStep } from '@src/features/post/components'
import { MY_BADGE_PROGRESS_QUERY_KEY, MY_BADGES_QUERY_KEY, USER_BADGES_QUERY_KEY } from '@src/features/users-profile/services'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useUploadImage } from '@src/shared/hooks'
import { locationStateAtom } from '@src/shared/state/location.state'
import {
  getDevMockPhotoUriIfSimulator,
  isSimulatorDev,
  space,
  triggerLightHaptic,
  triggerSuccessHaptic
} from '@src/shared/utils'

type Props = NativeStackScreenProps<PostStackParamList, 'PostMain'>
type Step = 0 | 1 | 2

const STEPS = ['local', 'fotos', 'review']

export function PostScreen({ navigation, route }: Props) {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const tabsNavigation = navigation.getParent<NavigationProp<TabsNavigatorParamsList>>()
  const userLocation = useAtomValue(locationStateAtom)
  const { places, isFetching } = usePlacesNearMe()
  const { upload, uploading } = useUploadImage()
  const preselectedPlace = route.params?.preselectedPlace ?? null

  const [activeStep, setActiveStep] = useState<Step>(preselectedPlace ? 1 : 0)
  const [selectedPlace, setSelectedPlace] = useState<PostPreselectedPlace | null>(preselectedPlace)
  const [rating, setRating] = useState<PostRating | null>(null)
  const [comment, setComment] = useState('')
  const [placePhotoUri, setPlacePhotoUri] = useState<string | null>(null)
  const [selfieUri, setSelfieUri] = useState<string | null>(null)
  const [selfieFriendsOnly, setSelfieFriendsOnly] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    if (!preselectedPlace) return

    setSelectedPlace(preselectedPlace)
    setActiveStep(1)
  }, [preselectedPlace])

  const closeFlow = () => {
    tabsNavigation?.navigate('HomeScreen')
  }

  const goBack = () => {
    if (activeStep === 0) {
      closeFlow()
      return
    }

    setActiveStep((activeStep - 1) as Step)
  }

  const launchCamera = async (type: PostPhotoType) => {
    if (type === 'place') {
      const mock = getDevMockPhotoUriIfSimulator()
      if (mock) {
        triggerLightHaptic()
        setPlacePhotoUri(mock)
        return
      }
    } else if (isSimulatorDev()) {
      const mock = getDevMockPhotoUriIfSimulator()
      if (mock) {
        triggerLightHaptic()
        setSelfieUri(mock)
        return
      }
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync()
    if (!permission.granted) {
      showToast('ative a câmera para adicionar a foto.', 'error')
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.8,
        ...(type === 'selfie' && { cameraType: ImagePicker.CameraType.front })
      })

      if (!result.canceled && result.assets[0]) {
        triggerLightHaptic()
        if (type === 'place') {
          setPlacePhotoUri(result.assets[0].uri)
        } else {
          setSelfieUri(result.assets[0].uri)
        }
      }
    } catch {
      showToast('não foi possível abrir a câmera.', 'error')
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedPlace || !rating) throw new Error('invalid review')
      if (!placePhotoUri) {
        throw Object.assign(new Error('Foto do local obrigatória'), {
          response: { data: { code: PlaceReviewErrorCode.PHOTO_REQUIRED } }
        })
      }
      if (!userLocation) {
        throw Object.assign(new Error('Localização indisponível'), {
          response: { data: { code: PlaceReviewErrorCode.OUT_OF_RANGE } }
        })
      }

      const [placeImageUrl, selfieUrl] = await Promise.all([
        upload(placePhotoUri, 'reviews'),
        selfieUri ? upload(selfieUri, 'reviews') : Promise.resolve(undefined)
      ])

      return PlaceReviewService.create({
        placeId: selectedPlace.id,
        placeName: selectedPlace.name,
        rating,
        placeImageUrl,
        userLat: userLocation.latitude,
        userLng: userLocation.longitude,
        placeLat: selectedPlace.location.lat,
        placeLng: selectedPlace.location.lon,
        selfieUrl,
        selfieFriendsOnly: selfieUri ? selfieFriendsOnly : false,
        comment: comment.trim() || undefined
      })
    },
    onSuccess: (response) => {
      if (!selectedPlace) return

      queryClient.invalidateQueries({ queryKey: MY_BADGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: MY_BADGE_PROGRESS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: USER_BADGES_QUERY_KEY })
      triggerSuccessHaptic()
      showToast('review publicada.')
      navigation.replace('PostReviewSuccess', {
        placeId: selectedPlace.id,
        placeName: selectedPlace.name,
        streakUpdate: response.data.streakUpdate ?? null
      })
    },
    onError: (error: { response?: { data?: PlaceReviewApiErrorBody } }) => {
      const code = error.response?.data?.code
      showToast(placeReviewErrorMessage(code), 'error')
      if (code === PlaceReviewErrorCode.RATE_LIMITED) {
        closeFlow()
      }
    }
  })

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedPlace) {
        showToast('escolha um local para continuar.', 'error')
        return
      }

      setActiveStep(1)
      return
    }

    if (activeStep === 1) {
      setSubmitAttempted(true)
      if (!placePhotoUri) {
        showToast('a foto do local é obrigatória', 'error')
        return
      }

      setActiveStep(2)
    }
  }

  const handleSubmit = () => {
    setSubmitAttempted(true)
    if (!selectedPlace) {
      showToast('escolha um local para publicar.', 'error')
      setActiveStep(0)
      return
    }
    if (!placePhotoUri) {
      showToast('a foto do local é obrigatória', 'error')
      setActiveStep(1)
      return
    }
    if (!rating) {
      showToast('marque se o lugar está vazio ou lotado.', 'error')
      return
    }
    if (!userLocation) {
      showToast(placeReviewErrorMessage(PlaceReviewErrorCode.OUT_OF_RANGE), 'error')
      return
    }

    mutate()
  }

  const renderProgress = () => (
    <Box flexDirection="row" alignItems="center" gap={2}>
      {STEPS.map((step, index) => (
        <View key={step} style={[styles.progressSegment, index <= activeStep && styles.progressSegmentActive]} />
      ))}
    </Box>
  )

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Box flex={1} bg="background">
          <Box pl={5} pr={5} pt={5} pb={4} flexDirection="row" alignItems="center" justifyContent="space-between">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={activeStep === 0 ? 'fechar' : 'voltar'}
              onPress={goBack}
              style={styles.headerButton}
            >
              <ThemedIcon name={activeStep === 0 ? 'X' : 'ArrowLeft'} size={20} color="textPrimary" />
            </Pressable>
            {renderProgress()}
            <ThemedText variant="mono" color="textSecondary" letterSpacing="normal">
              {activeStep + 1}/3
            </ThemedText>
          </Box>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {activeStep === 0 ? (
              <PostPlaceStep
                places={places}
                isFetching={isFetching}
                selectedPlace={selectedPlace}
                onSelectPlace={setSelectedPlace}
              />
            ) : null}
            {activeStep === 1 ? (
              <PostPhotoStep
                placePhotoUri={placePhotoUri}
                selfieUri={selfieUri}
                selfieFriendsOnly={selfieFriendsOnly}
                submitAttempted={submitAttempted}
                onPhotoPress={launchCamera}
                onSelfieFriendsOnlyChange={setSelfieFriendsOnly}
              />
            ) : null}
            {activeStep === 2 ? (
              <PostReviewStep
                selectedPlace={selectedPlace}
                rating={rating}
                comment={comment}
                placePhotoUri={placePhotoUri}
                selfieUri={selfieUri}
                submitting={isPending || uploading}
                onChangePlace={() => setActiveStep(0)}
                onChangeRating={setRating}
                onChangeComment={setComment}
                onSubmit={handleSubmit}
              />
            ) : null}
          </ScrollView>

          {activeStep < 2 ? (
            <Box pl={5} pr={5} pt={3} pb={5} bg="background">
              <Button onPress={handleNext} disabled={activeStep === 0 ? !selectedPlace : !placePhotoUri}>
                <ThemedText weight="bold" color="background" letterSpacing="normal">
                  continuar
                </ThemedText>
              </Button>
            </Box>
          ) : null}
        </Box>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  headerButton: {
    width: space(10),
    height: space(10),
    borderRadius: space(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  progressSegment: {
    width: space(8),
    height: space(1),
    borderRadius: space(1),
    backgroundColor: theme.colors.border
  },
  progressSegmentActive: {
    backgroundColor: theme.colors.primary
  },
  contentContainer: {
    paddingBottom: space(6)
  }
})
