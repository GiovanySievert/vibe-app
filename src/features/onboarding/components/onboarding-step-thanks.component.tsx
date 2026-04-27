import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

type OnboardingStepThanksProps = {
  onFinish: () => void
}

export const OnboardingStepThanks: React.FC<OnboardingStepThanksProps> = ({ onFinish }) => {
  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6} alignItems="center" pt={4}>
        <Box style={styles.iconWrapper} alignItems="center" justifyContent="center">
          <ThemedIcon name="Heart" size={36} color="primary" />
        </Box>

        <Box gap={4} alignItems="center">
          <ThemedText size="xl" weight="bold" style={styles.textCenter}>
            Obrigado por baixar o Vibes
          </ThemedText>

          <ThemedText color="textSecondary" style={styles.textCenter}>
            Esse app foi feito com muito carinho por um programador solo. Cada linha de código, cada tela e cada detalhe
            foi pensado para te ajudar a encontrar o lugar certo na hora certa.
          </ThemedText>

          <ThemedText color="textSecondary" style={styles.textCenter}>
            Você não é só um usuário — é parte do que faz esse projeto existir. Espero que o Vibes te ajude a viver
            momentos incríveis.
          </ThemedText>
        </Box>

        <Box style={styles.signatureBox} gap={1} alignItems="center">
          <ThemedIcon name="Code" size={16} color="primary" />
          <ThemedText size="sm" color="textSecondary" style={styles.textCenter}>
            Feito com ❤️ por um dev solo
          </ThemedText>
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onFinish}>
          <ThemedText color="background" weight="semibold">
            Vamos lá!
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
