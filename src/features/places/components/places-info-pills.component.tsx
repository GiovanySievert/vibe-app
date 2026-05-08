import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'

type PlacesInfoPillsProps = {
  place: PlacesByIdResponse
}

const PLACEHOLDER_TAGS = ['Mulher feia', 'Forro', 'Música Eletrônica', 'Pista']

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const PlacesInfoPills: React.FC<PlacesInfoPillsProps> = ({ place: _place }) => {
  return (
    <Box mt={5} mb={1}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PLACEHOLDER_TAGS.map((tag) => (
          <Box key={tag} style={styles.pill}>
            <ThemedText size="xs" color="textSecondary">
              {tag}
            </ThemedText>
          </Box>
        ))}
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 24,
    gap: 8,
    flexDirection: 'row'
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: theme.colors.border
  }
})
