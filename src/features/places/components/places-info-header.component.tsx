import React from 'react'
import { StyleSheet } from 'react-native'

import { Avatar, Box, CardLinear, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'

type PlacesInfoHeaderProps = {
  place: any
}

export const PlacesInfoHeader: React.FC<PlacesInfoHeaderProps> = ({ place }) => {
  return (
    <Box flex={1}>
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
          <ThemedText variant="title">{place.venues.name}</ThemedText>
          <ThemedText variant="subtitle" weight="light">
            {place.brands.type}
          </ThemedText>
        </Box>

        <Box flexDirection="row" gap={2} mb={4}>
          <ThemedIcon name="Star" color="warning" />
          <ThemedText>4.6</ThemedText>
          <ThemedText>(127 avaliações)</ThemedText>
        </Box>

        <CardLinear title="Sobre">
          <ThemedText variant="secondary">{place.venues.about}</ThemedText>
        </CardLinear>
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
  }
})
