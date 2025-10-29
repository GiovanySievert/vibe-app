import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'

export const PlacesFlutuantButton = () => {
  return (
    <Box style={styles.absoluteContainer}>
      <Button>
        <ThemedText weight="medium" size="lg">
          Mandar foto do local
        </ThemedText>
      </Button>
    </Box>
  )
}

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  }
})
