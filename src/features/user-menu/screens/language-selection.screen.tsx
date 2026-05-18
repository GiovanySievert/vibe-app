import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { useAtomValue } from 'jotai'

import { Box, Divider, GoBackButton, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { currentLanguageAtom, SupportedLanguage, supportedLanguages, useAppTranslation } from '@src/shared/i18n'

export const LanguageSelectionScreen = () => {
  const { t, setLanguage } = useAppTranslation()
  const currentLanguage = useAtomValue(currentLanguageAtom)

  const handleSelect = (code: SupportedLanguage) => {
    if (code === currentLanguage) return
    setLanguage(code)
  }

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">{t('userMenu.language.title')}</ThemedText>
            <ThemedText variant="mono">{t('userMenu.language.subtitle')}</ThemedText>
          </Box>
        </Box>

        <Box gap={4} pl={5} pr={5} pb={6}>
          {supportedLanguages.map((language, index) => {
            const isSelected = language.code === currentLanguage
            return (
              <React.Fragment key={language.code}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={language.nativeLabel}
                  style={styles.row}
                  onPress={() => handleSelect(language.code)}
                >
                  <Box flexDirection="row" alignItems="center" gap={3}>
                    <ThemedText weight="medium">{language.nativeLabel}</ThemedText>
                  </Box>
                  {isSelected && <ThemedIcon name="Check" color="primary" />}
                </TouchableOpacity>
                {index < supportedLanguages.length - 1 && <Divider />}
              </React.Fragment>
            )
          })}
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
