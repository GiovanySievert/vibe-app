import React from 'react'
import { StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Touchable } from '@src/shared/components'
import { Box } from '@src/shared/components/box'
import { LoadingPage } from '@src/shared/components/loading-page'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { ReviewCard } from '../components'
import { FeedService } from '../services'

type Props = NativeStackScreenProps<AuthenticatedStackParamList, 'SharedReviewScreen'>

export const SharedReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { reviewId } = route.params
  const { data: session } = authClient.useSession()

  const { data: review, isLoading, isError } = useQuery({
    queryKey: ['review', reviewId],
    queryFn: () => FeedService.getById(reviewId).then((r) => r.data),
    enabled: !!session?.user.id,
    retry: false
  })

  return (
    <Box style={styles.container}>
      <Box style={styles.header} pl={5} pr={5} pb={4} flexDirection="row" alignItems="center" justifyContent="space-between">
        <ThemedText weight="semibold" size="lg">review</ThemedText>
        <Touchable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ThemedIcon name="X" size={20} color="textSecondary" />
        </Touchable>
      </Box>

      {isLoading ? (
        <Box flex={1} justifyContent="center" alignItems="center">
          <LoadingPage />
        </Box>
      ) : isError || !review ? (
        <Box flex={1} justifyContent="center" alignItems="center" ml={5} mr={5} gap={4}>
          <ThemedText weight="semibold" size="lg">Não foi possível abrir esta review.</ThemedText>
          <ThemedText color="textSecondary" style={styles.centerText}>
            Verifique se o link ainda é válido e tente novamente.
          </ThemedText>
        </Box>
      ) : (
        <ReviewCard review={review} currentUserId={session?.user.id ?? ''} />
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 16
  },
  header: {
    paddingTop: 16
  },
  iconButton: {
    padding: 8
  },
  centerText: {
    textAlign: 'center'
  }
})
