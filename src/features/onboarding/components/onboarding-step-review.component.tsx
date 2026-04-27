import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

type OnboardingStepReviewProps = {
  onNext: () => void
}

const REVIEW_STEPS = [
  {
    icon: 'Camera' as const,
    title: 'Foto do lugar',
    description: 'Tire uma foto mostrando como tá o ambiente — cheio, vazio, animado ou parado.'
  },
  {
    icon: 'MessageSquare' as const,
    title: 'Deixe um comentário',
    description: 'Conta como tá o clima. Uma frase já ajuda todo mundo a decidir.'
  },
  {
    icon: 'Globe' as const,
    title: 'Aparece pra todo mundo',
    description: 'Sua review fica visível na página do lugar em tempo real.'
  }
]

export const OnboardingStepReview: React.FC<OnboardingStepReviewProps> = ({ onNext }) => {
  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6}>
        <Box gap={2}>
          <ThemedText size="xl" weight="bold">
            Como é uma review?
          </ThemedText>
          <ThemedText color="textSecondary">
            Uma review de lugar é simples e rápida. Em menos de um minuto você ajuda a galera a decidir onde ir.
          </ThemedText>
        </Box>

        <Box gap={5}>
          {REVIEW_STEPS.map((reviewStep, stepIndex) => (
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
              Dica
            </ThemedText>
          </Box>
          <ThemedText size="sm" color="textSecondary">
            Abra a página de qualquer lugar no mapa e toque em "Fazer review" para começar.
          </ThemedText>
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onNext}>
          <ThemedText color="background" weight="semibold">
            Entendi!
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
