import React, { useMemo } from 'react'
import { StyleSheet } from 'react-native'

import { Box, Card, Divider, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { useAppTranslation } from '@src/shared/i18n'
import { formatTime, getCurrentStatus, groupConsecutiveDays } from '@src/shared/utils'

import { PlacesAddress } from './places-address.component'

type PlacesOpeningHoursProps = {
  place: PlacesByIdResponse
}

export const PlacesOpeningHours: React.FC<PlacesOpeningHoursProps> = ({ place }) => {
  const { t } = useAppTranslation()

  const weekdayLabels = t('places.openingHours.weekdaysShort', { returnObjects: true }) as Record<string, string>

  const grouped = useMemo(() => groupConsecutiveDays(place.openingHours, weekdayLabels), [place.openingHours, weekdayLabels])
  const status = useMemo(() => getCurrentStatus(place.openingHours), [place.openingHours])

  if (!place.openingHours?.length) return null

  const statusText = status.isOpen
    ? t('places.openingHours.openNow')
    : t('places.openingHours.closed')

  const statusDetail = status.isOpen && status.closesAt
    ? t('places.openingHours.closesAt', { time: formatTime(status.closesAt) })
    : !status.isOpen && status.opensAt && status.nextOpenWeekday !== undefined
      ? t('places.openingHours.opensAt', {
          day: weekdayLabels[String(status.nextOpenWeekday)],
          time: formatTime(status.opensAt)
        })
      : null

  return (
    <Box pl={6} pr={6} mt={5}>
      <Card p={5} gap={4}>
        <Box flexDirection="row" alignItems="center" gap={2}>
          <Box style={[styles.bullet, status.isOpen ? styles.bulletOpen : styles.bulletClosed]} />
          <ThemedText variant="mono" weight="bold" color={status.isOpen ? 'primary' : 'textSecondary'}>
            {statusText}
          </ThemedText>
          {statusDetail ? (
            <ThemedText variant="mono" color="textSecondary">
              {`· ${statusDetail}`}
            </ThemedText>
          ) : null}
        </Box>

        <Box gap={2}>
          <ThemedText variant="mono" size="xs" textTransform="uppercase" color="textSecondary">
            {t('places.openingHours.label')}
          </ThemedText>
          <Box gap={1}>
            {grouped.map((row) => (
              <Box key={row.label} flexDirection="row" justifyContent="space-between" alignItems="center">
                <ThemedText variant="mono" color="textSecondary">
                  {row.label}
                </ThemedText>
                <ThemedText variant="mono" color="textPrimary">
                  {row.isClosed ? t('places.openingHours.closedAllDay') : `${formatTime(row.opensAt)} - ${formatTime(row.closesAt)}`}
                </ThemedText>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider />

        <PlacesAddress place={place} variant="embedded" />
      </Card>
    </Box>
  )
}

const styles = StyleSheet.create({
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  bulletOpen: {
    backgroundColor: theme.colors.primary
  },
  bulletClosed: {
    backgroundColor: theme.colors.textTerciary
  }
})
