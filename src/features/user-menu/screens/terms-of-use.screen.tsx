import { ScrollView, StyleSheet } from 'react-native'

import { Box, GoBackButton, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

export const TermsOfUseScreen = () => {
  const { t } = useAppTranslation()

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">{t('userMenu.termsOfUse.title')}</ThemedText>
            <ThemedText variant="mono">{t('userMenu.termsOfUse.subtitle')}</ThemedText>
          </Box>
        </Box>

        <Box pl={6} pr={6} pb={6} gap={6}>
          <ThemedText>{t('userMenu.termsOfUse.body')}</ThemedText>
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
