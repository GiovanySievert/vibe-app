import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

type OnboardingStepWelcomeProps = {
  onNext: () => void
}

const WELCOME_FEATURES = [
  {
    icon: 'MapPin' as const,
    title: 'Descubra onde tá rolando',
    description: 'Veja em tempo real quais lugares estão cheios ou mortos perto de você.'
  },
  {
    icon: 'Camera' as const,
    title: 'Compartilhe o clima do lugar',
    description: 'Tire uma foto, deixe um comentário e mostre pra galera como tá o rolê.'
  },
  {
    icon: 'Users' as const,
    title: 'Feito pela comunidade',
    description: 'Cada review é de alguém que tá lá. Informação real, sem propaganda.'
  }
]

export const OnboardingStepWelcome: React.FC<OnboardingStepWelcomeProps> = ({ onNext }) => {
  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6}>
        <Box gap={2}>
          <ThemedText size="2xl" weight="bold">
            Bem-vindo ao Vibes 👋
          </ThemedText>
          <ThemedText color="textSecondary">
            O app que te ajuda a decidir onde ir antes de sair de casa.
          </ThemedText>
        </Box>

        <Box gap={5}>
          {WELCOME_FEATURES.map((feature) => (
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
            Começar
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
