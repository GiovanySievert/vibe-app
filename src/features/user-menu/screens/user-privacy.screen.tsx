import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Box, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { BlockedUsersList } from '../components'

export const UserPrivacyScreen = () => {
  const { t } = useAppTranslation()

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">{t('userMenu.privacy.title')}</ThemedText>
            <ThemedText variant="mono">{t('userMenu.privacy.subtitle')}</ThemedText>
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
