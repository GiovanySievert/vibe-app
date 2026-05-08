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
    <Box flexDirection="row" gap={2}>
      <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
        <PlacesHeaderFavoriteButton place={place} />
      </Box>
      <Box style={styles.iconContainer} alignItems="center" justifyContent="center">
        <ThemedIcon name="Share" color="background" size={18} />
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary
  }
})
