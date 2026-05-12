import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Box, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

import { BlockedUsersList } from '../components'

export const UserPrivacyScreen = () => {
  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">privacidade</ThemedText>
            <ThemedText variant="mono">bloqueados · controles</ThemedText>
          </Box>
        </Box>

        <Box mr={5} ml={5} gap={6}>
          <BlockedUsersList limit={1} />
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
