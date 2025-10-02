import { StyleSheet } from 'react-native'

import { Box, ThemedText } from '@src/shared/components'

export const UserMenuScreen = () => {
  return (
    <Box>
      <ThemedText>Usermenu</ThemedText>
    </Box>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute'
  }
})
