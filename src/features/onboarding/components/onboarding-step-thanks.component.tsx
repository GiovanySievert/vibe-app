import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type OnboardingStepThanksProps = {
  onFinish: () => void
}

export const OnboardingStepThanks: React.FC<OnboardingStepThanksProps> = ({ onFinish }) => {
  const { t } = useAppTranslation()

  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6} alignItems="center" pt={4}>
        <Box style={styles.iconWrapper} alignItems="center" justifyContent="center">
          <ThemedIcon name="Heart" size={36} color="primary" />
        </Box>

        <Box gap={4} alignItems="center">
          <ThemedText size="xl" weight="bold" style={styles.textCenter}>
            {t('onboarding.thanks.title')}
          </ThemedText>

          <ThemedText color="textSecondary" style={styles.textCenter}>
            {t('onboarding.thanks.description1')}
          </ThemedText>

          <ThemedText color="textSecondary" style={styles.textCenter}>
            {t('onboarding.thanks.description2')}
          </ThemedText>
        </Box>

        <Box style={styles.signatureBox} gap={1} alignItems="center">
          <ThemedIcon name="Code" size={16} color="primary" />
          <ThemedText size="sm" color="textSecondary" style={styles.textCenter}>
            {t('onboarding.thanks.signature')}
          </ThemedText>
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onFinish}>
          <ThemedText color="background" weight="semibold">
            {t('onboarding.thanks.continueBtn')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.backgroundSecondary
  },
  textCenter: {
    textAlign: 'center'
  },
  signatureBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border
  }
})
