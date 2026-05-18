import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { useAppTranslation } from '@src/shared/i18n'

type PlacesCardInfoProps = {
  place: PlacesByIdResponse
}

type StatRow = {
  label: string
  detail: string
  value: string
}

export const PlacesCardInfo: React.FC<PlacesCardInfoProps> = ({ place }) => {
  const { t } = useAppTranslation()
  const rows: StatRow[] = [
    { label: t('places.stats.friendsNow'), detail: '—', value: '—' },
    {
      label: t('places.stats.vibeChecksToday'),
      detail: t('places.stats.latestRecent'),
      value: '—'
    },
    {
      label: t('places.stats.price'),
      detail: '',
      value: place.priceRange ?? '—'
    }
  ]

  return (
    <Box pl={6} pr={6} mt={7}>
      {rows.map((row, i) => (
        <Box key={i} style={styles.row} flexDirection="row" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1} gap={1}>
            <ThemedText>{row.label}</ThemedText>
            {row.detail ? <ThemedText>{row.detail}</ThemedText> : null}
          </Box>
          <ThemedText>{row.value}</ThemedText>
        </Box>
      ))}
    </Box>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border
  }
})
