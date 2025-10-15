import React from 'react'
import { StyleSheet } from 'react-native'

import { Avatar, Box, Card, CardLinear, Divider, Pill, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'

export const PlacesDetailsScreen = () => {
  return (
    <Screen>
      <Box flexDirection="row" justifyContent="space-between" p={3}>
        <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
          <ThemedIcon name="ArrowLeft" color="textSecondary" />
        </Box>
        <Box flexDirection="row" gap={3}>
          <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
            <ThemedIcon name="Heart" color="textSecondary" />
          </Box>
          <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
            <ThemedIcon name="Share" color="textSecondary" />
          </Box>
        </Box>
      </Box>
      <Divider />

      <Box style={styles.imageHeaderContainer} justifyContent="center" alignItems="center" mt={10} mb={2}>
        <Avatar
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkB5zkX3mrbLiQ_WjvF-rWwWQJEJ3wK3oB-Q&s'
          }}
          size="xl"
        />
      </Box>

      <Box m={4} gap={3}>
        <Box alignItems="center" mt={1}>
          <ThemedText variant="title">Gato Preto</ThemedText>
          <ThemedText variant="subtitle" weight="light">
            Bar
          </ThemedText>
        </Box>

        <Box flexDirection="row" gap={2} mb={4}>
          <ThemedIcon name="Star" color="warning" />
          <ThemedText>4.6</ThemedText>
          <ThemedText>(127 avaliações)</ThemedText>
        </Box>

        <CardLinear title="Sobre">
          <ThemedText variant="secondary">
            Uma das baladas mais badaladas da cidade, com mulher feia, cerveja quente e musica ruim. sofisticado.
          </ThemedText>
        </CardLinear>

        <Box mb={4} mt={4} flexDirection="row" justifyContent="space-around">
          <Pill label="Forro" />
          <Pill label="Música Eletrônica" />
          <Pill label="Pista" />
        </Box>

        <Box flexDirection="row" justifyContent="space-between" mb={4} gap={3}>
          <Card alignItems="center">
            <ThemedText>Movimento</ThemedText>
            <ThemedText>Lotado</ThemedText>
          </Card>
          <Card alignItems="center">
            <ThemedText>Pico</ThemedText>
            <ThemedText>1h - 3h</ThemedText>
          </Card>

          <Card alignItems="center">
            <ThemedText>Movimento</ThemedText>
            <ThemedText>Lotado</ThemedText>
          </Card>
        </Box>

        <Card gap={2} mb={2} flexDirection="row" alignItems="center" mb={4}>
          <ThemedIcon name="MapPin" color="primary" />
          <Box>
            <ThemedText>Rua Augusta, 1234 - Consolação, São Paulo</ThemedText>
            <ThemedText>0.5km de você</ThemedText>
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
  },
  iconContainer: {
    height: 32,
    width: 32,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#333'
  }
})
