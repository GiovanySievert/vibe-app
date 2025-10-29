import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Divider } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'

export const PlacesScreenHeader = () => {
  return (
    <Box flex={1}>
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
    </Box>
  )
}

const styles = StyleSheet.create({
  iconContainer: {
    height: 32,
    width: 32,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#333'
  }
})
