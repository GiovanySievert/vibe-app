import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Avatar, Box, Button, Card, CardLinear, Divider, Pill, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

export const PlacesDetailsScreen = () => {
  return (
    <Box flex={1}>
      <ScrollView style={styles.scroll} overScrollMode="never">
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

            <Box mb={2} gap={2} mt={2} flexDirection="row" scrollable>
              <Pill label="Mulher feia" />
              <Pill label="Forro" />
              <Pill label="Música Eletrônica" />
              <Pill label="Pista" />
            </Box>

            <Box flexDirection="row" justifyContent="space-between" mb={4} gap={3}>
              <Card alignItems="center">
                <ThemedText size="sm" weight="semibold">
                  Movimento
                </ThemedText>
                <ThemedText>Lotado</ThemedText>
              </Card>
              <Card alignItems="center">
                <ThemedText size="sm" weight="semibold">
                  Pico
                </ThemedText>
                <ThemedText>1h - 3h</ThemedText>
              </Card>

              <Card alignItems="center">
                <ThemedText size="sm" weight="semibold">
                  Preço
                </ThemedText>
                <ThemedText>$$</ThemedText>
              </Card>
            </Box>

            <Card gap={3} mb={2} flexDirection="row" alignItems="center">
              <ThemedIcon name="MapPin" color="primary" />
              <Box>
                <ThemedText>Rua Augusta, 1234 - Consolação, São Paulo</ThemedText>
                <ThemedText size="sm">0.5km de você</ThemedText>
              </Box>
            </Card>

            <Card gap={3} mb={2} flexDirection="row" alignItems="center">
              <ThemedIcon name="Clock" color="primary" />
              <Box>
                <ThemedText>Horário</ThemedText>
                <ThemedText size="sm">das 19h até as 07h, de seg á seg</ThemedText>
              </Box>
            </Card>

            <Box mb={14}>
              <Divider />
            </Box>
          </Box>
        </Screen>
      </ScrollView>

      <Box style={styles.absoluteContainer}>
        <Button>
          <ThemedText weight="medium" size="lg">
            Mandar foto do local
          </ThemedText>
        </Button>
      </Box>
    </Box>
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
  },
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  },
  relativeContainer: {
    flex: 1
  },
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
