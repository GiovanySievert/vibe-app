import React, { useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useMutation } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { theme } from '@src/shared/constants/theme'

import { PlaceReviewService } from '../services/place-review.service'

type Props = NativeStackScreenProps<ModalNavigatorParamsList, 'PlaceReviewPostScreen'>

type Rating = 'crowded' | 'dead'

export const PlaceReviewPostScreen: React.FC<Props> = ({ route, navigation }) => {
  const { placeId, photoUri } = route.params
  const [rating, setRating] = useState<Rating | null>(null)
  const [comment, setComment] = useState('')

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      PlaceReviewService.create({
        placeId,
        rating: rating!,
        imageUrl: photoUri,
        comment: comment.trim() || undefined
      }),
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

        <Image source={{ uri: photoUri }} style={styles.image} resizeMode="cover" />

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
            label="Descrição (opcional)"
            multiline
            multilineHeight={100}
            maxLength={300}
            value={comment}
            onChangeText={setComment}
            placeholder="Conta mais sobre o local..."
          />

          <Button onPress={() => mutate()} loading={isPending} disabled={!rating}>
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
  image: {
    width: '100%',
    height: 280,
    borderRadius: 0
  }
})
