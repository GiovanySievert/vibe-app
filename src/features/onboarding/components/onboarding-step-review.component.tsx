import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type OnboardingStepReviewProps = {
  onNext: () => void
}

export const OnboardingStepReview: React.FC<OnboardingStepReviewProps> = ({ onNext }) => {
  const { t } = useAppTranslation()
  const reviewSteps = [
    {
      icon: 'Camera' as const,
      title: t('onboarding.review.step1Title'),
      description: t('onboarding.review.step1Desc')
    },
    {
      icon: 'MessageSquare' as const,
      title: t('onboarding.review.step2Title'),
      description: t('onboarding.review.step2Desc')
    },
    {
      icon: 'Globe' as const,
      title: t('onboarding.review.step3Title'),
      description: t('onboarding.review.step3Desc')
    }
  ]

  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6}>
        <Box gap={2}>
          <ThemedText size="xl" weight="bold">
            {t('onboarding.review.title')}
          </ThemedText>
          <ThemedText color="textSecondary">{t('onboarding.review.description')}</ThemedText>
        </Box>

        <Box gap={5}>
          {reviewSteps.map((reviewStep, stepIndex) => (
            <Box key={reviewStep.title} flexDirection="row" gap={4} alignItems="flex-start">
              <Box style={styles.stepNumber} alignItems="center" justifyContent="center">
                <ThemedText weight="bold" color="primary">
                  {stepIndex + 1}
                </ThemedText>
              </Box>
              <Box style={styles.iconWrapper} alignItems="center" justifyContent="center">
                <ThemedIcon name={reviewStep.icon} size={20} color="primary" />
              </Box>
              <Box flex={1} gap={1}>
                <ThemedText weight="semibold">{reviewStep.title}</ThemedText>
                <ThemedText color="textSecondary" size="sm">
                  {reviewStep.description}
                </ThemedText>
              </Box>
            </Box>
          ))}
        </Box>

        <Box style={styles.exampleBox} gap={2}>
          <Box flexDirection="row" alignItems="center" gap={2}>
            <ThemedIcon name="Info" size={14} color="primary" />
            <ThemedText size="xs" color="primary" weight="semibold">
              {t('onboarding.review.tipLabel')}
            </ThemedText>
          </Box>
          <ThemedText size="sm" color="textSecondary">
            {t('onboarding.review.tipText')}
          </ThemedText>
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onNext}>
          <ThemedText color="background" weight="semibold">
            {t('onboarding.review.confirmBtn')}
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
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    flexShrink: 0
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryGlow,
    flexShrink: 0
  },
  exampleBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border
  }
})
