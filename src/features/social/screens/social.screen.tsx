import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { UserFavoritesPlacesCards } from '@src/features/user-favorites-places/components'
import { Box, Divider, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

import { UserFollowRequests } from '../components'

export const SocialScreen = () => {
  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5}>
          <ThemedText variant="subtitle">Social</ThemedText>
        </Box>
        <Box gap={5}>
          <UserFavoritesPlacesCards />
          <Box pr={5} pl={5}>
            <Divider />
          </Box>
          <UserFollowRequests />
        </Box>
      </Screen>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  },
  relativeContainer: {
    flex: 1
  },
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
