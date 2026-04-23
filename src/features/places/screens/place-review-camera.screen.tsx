import React, { useEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import * as ImagePicker from 'expo-image-picker'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'

type Props = NativeStackScreenProps<ModalNavigatorParamsList, 'PlaceReviewCameraScreen'>

export const PlaceReviewCameraScreen: React.FC<Props> = ({ route, navigation }) => {
  const { placeId } = route.params

  useEffect(() => {
    launchCamera()
  }, [])

  const launchCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync()

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        quality: 0.8
      })

      if (!result.canceled && result.assets[0]) {
        navigation.replace('PlaceReviewPostScreen', {
          placeId,
          photoUri: result.assets[0].uri
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Box flex={1} bg="background" justifyContent="center" alignItems="center">
      <Button variant="ghost" onPress={() => navigation.goBack()}>
        <ThemedIcon name="X" size={24} color="textPrimary" />
        <ThemedText size="md">Cancelar</ThemedText>
      </Button>
    </Box>
  )
}
