import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type OnboardingStepWelcomeProps = {
  onNext: () => void
}

export const OnboardingStepWelcome: React.FC<OnboardingStepWelcomeProps> = ({ onNext }) => {
  const { t } = useAppTranslation()
  const welcomeFeatures = [
    {
      icon: 'MapPin' as const,
      title: t('onboarding.welcome.feature1Title'),
      description: t('onboarding.welcome.feature1Desc')
    },
    {
      icon: 'Camera' as const,
      title: t('onboarding.welcome.feature2Title'),
      description: t('onboarding.welcome.feature2Desc')
    },
    {
      icon: 'Users' as const,
      title: t('onboarding.welcome.feature3Title'),
      description: t('onboarding.welcome.feature3Desc')
    }
  ]

  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6}>
        <Box gap={2}>
          <ThemedText size="2xl" weight="bold">
            {t('onboarding.welcome.title')}
          </ThemedText>
          <ThemedText color="textSecondary">{t('onboarding.welcome.subtitle')}</ThemedText>
        </Box>

        <Box gap={5}>
          {welcomeFeatures.map((feature) => (
            <Box key={feature.title} flexDirection="row" gap={4} alignItems="flex-start">
              <Box style={styles.iconWrapper} alignItems="center" justifyContent="center">
                <ThemedIcon name={feature.icon} size={20} color="primary" />
              </Box>
              <Box flex={1} gap={1}>
                <ThemedText weight="semibold">{feature.title}</ThemedText>
                <ThemedText color="textSecondary" size="sm">
                  {feature.description}
                </ThemedText>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onNext}>
          <ThemedText color="background" weight="semibold">
            {t('onboarding.welcome.startBtn')}
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
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryGlow,
    flexShrink: 0
  }
})
