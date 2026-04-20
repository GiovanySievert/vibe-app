import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

type CreateEventIntroProps = {
  onNext: () => void
}

const FEATURES = [
  {
    icon: 'CalendarPlus' as const,
    title: 'Crie seu evento',
    description: 'Configure nome, data, hora e uma descrição para o seu evento em segundos.'
  },
  {
    icon: 'Users' as const,
    title: 'Convide seus amigos',
    description: 'Busque e selecione amigos que já tem conta no app para participar.'
  },
  {
    icon: 'CircleCheck' as const,
    title: 'Confirmação de presença',
    description: 'Seus amigos recebem o convite e podem confirmar presença diretamente pelo app.'
  }
]

export const CreateEventIntro: React.FC<CreateEventIntroProps> = ({ onNext }) => {
  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6}>
        <Box gap={2}>
          <ThemedText size="xl" weight="bold">
            Eventos com quem você curte
          </ThemedText>
          <ThemedText color="textSecondary">
            O jeito mais fácil de organizar seu aniversário, um churrasco ou qualquer rolê com os amigos que estão no app.
          </ThemedText>
        </Box>

        <Box gap={5}>
          {FEATURES.map((item, i) => (
            <Box key={i} flexDirection="row" gap={4} alignItems="flex-start">
              <Box style={styles.iconWrapper}>
                <ThemedIcon name={item.icon} size={20} color="primary" />
              </Box>
              <Box flex={1} gap={1}>
                <ThemedText weight="semibold">{item.title}</ThemedText>
                <ThemedText color="textSecondary" size="sm">
                  {item.description}
                </ThemedText>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onNext}>
          <ThemedText color="background" weight="semibold">
            Criar evento
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
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
})
