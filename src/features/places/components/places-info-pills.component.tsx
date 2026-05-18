import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { useAppTranslation } from '@src/shared/i18n'

type PlacesInfoPillsProps = {
  place: PlacesByIdResponse
}

const PLACEHOLDER_TAGS = ['uglyWoman', 'forro', 'electronicMusic', 'danceFloor'] as const

export const PlacesInfoPills: React.FC<PlacesInfoPillsProps> = ({ place: _place }) => {
  const { t } = useAppTranslation()

  return (
    <Box mt={5} mb={1}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {PLACEHOLDER_TAGS.map((tag) => (
          <Box key={tag} style={styles.pill}>
            <ThemedText size="xs" color="textSecondary">
              {t(`places.tags.${tag}`)}
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
