import React from 'react'
import { Image, StyleSheet } from 'react-native'

import { Box, Card, Divider, Pill, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'

export const PlacesDetailsScreen = () => {
  return (
    <Screen>
      <Box style={styles.imageHeaderContainer} justifyContent="center" alignItems="center" mt={10} mb={4}>
        <Image source={{ uri: 'https://picsum.photos/seed/gatopreto/1920/1080' }} style={styles.imageHeader} />
      </Box>

      <Box m={4} gap={2}>
        <Box alignItems="center">
          <ThemedText type="title">Gato Preto</ThemedText>
          <ThemedText type="subtitle">Bar</ThemedText>
        </Box>

        <Box flexDirection="row" gap={2} mb={4}>
          <ThemedIcon name="Star" color="warning" />
          <ThemedText type="default">4.6</ThemedText>
          <ThemedText type="default">(127 avaliações)</ThemedText>
        </Box>

        <Card gap={2} mb={4}>
          <ThemedText type="bold">Sobre</ThemedText>
          <ThemedText>
            Uma das baladas mais badaladas da cidade, com DJs renomados e uma pista sensacional. Ambiente moderno e
            sofisticado.
          </ThemedText>
        </Card>

        <Box mb={4}>
          <Pill label="Música Eletrônica" />
          <Pill label="Pista" />
        </Box>

        <Box flexDirection="row" justifyContent="space-between" mb={4}>
          <Box alignItems="center">
            <ThemedText>Movimento</ThemedText>
            <ThemedText>Lotado</ThemedText>
          </Box>
          <Box alignItems="center">
            <ThemedText>Pico</ThemedText>
            <ThemedText>1h - 3h</ThemedText>
          </Box>

          <Box alignItems="center">
            <ThemedText>Movimento</ThemedText>
            <ThemedText>Lotado</ThemedText>
          </Box>
        </Box>

        <Card gap={2} mb={2} flexDirection="row" alignItems="center" mb={4}>
          <ThemedIcon name="MapPin" color="primary" />
          <Box>
            <ThemedText type="bold">Rua Augusta, 1234 - Consolação, São Paulo</ThemedText>
            <ThemedText type="sm">0.5km de você</ThemedText>
          </Box>
        </Card>

        <Divider />
      </Box>
    </Screen>
  )
}

const styles = StyleSheet.create({
  imageHeaderContainer: {
    position: 'relative'
  },
  imageHeader: {
    width: 128,
    height: 128,
    borderRadius: '50%'
  }
})
