import React from 'react'
import { StyleSheet } from 'react-native'

import { Box } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'

import { PlacesHeaderFavoriteButton } from './places-header-favorite-button.component'

type PlacesActionsProps = {
  place: PlacesByIdResponse
}

export const PlacesActions: React.FC<PlacesActionsProps> = ({ place }) => {
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Box flexDirection="row" justifyContent="space-between" p={3}>
        <Box flexDirection="row" gap={6}>
          <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
            <PlacesHeaderFavoriteButton place={place} />
          </Box>
          <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
            <ThemedIcon name="Share" color="textPrimary" />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    height: 56,
    width: 56,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: theme.colors.primary
  }
})
