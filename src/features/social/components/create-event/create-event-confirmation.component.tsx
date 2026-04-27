import React from 'react'
import { ScrollView } from 'react-native'

import { Avatar, Box, Button, Divider, ThemedText } from '@src/shared/components'
import { formatEventDateTime } from '@src/shared/utils'

import { CreateEventPayload } from '../../domain/event.model'

type CreateEventConfirmationProps = {
  payload: CreateEventPayload
  onSave: () => void
  onBack: () => void
}

export const CreateEventConfirmation: React.FC<CreateEventConfirmationProps> = ({ payload, onSave, onBack }) => {
  return (
    <Box style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Box gap={4} pb={4}>
          <Box gap={1}>
            <ThemedText size="sm" color="textSecondary" weight="semibold">
              Nome do evento
            </ThemedText>
            <ThemedText weight="semibold">{payload.name}</ThemedText>
          </Box>

          <Divider />

          <Box gap={1}>
            <ThemedText size="sm" color="textSecondary" weight="semibold">
              Data e hora
            </ThemedText>
            <ThemedText>{formatEventDateTime(payload.date, payload.time)}</ThemedText>
          </Box>

          {payload.description.trim().length > 0 && (
            <>
              <Divider />
              <Box gap={1}>
                <ThemedText size="sm" color="textSecondary" weight="semibold">
                  Descrição
                </ThemedText>
                <ThemedText>{payload.description}</ThemedText>
              </Box>
            </>
          )}

          <Divider />

          <Box gap={2}>
            <ThemedText size="sm" color="textSecondary" weight="semibold">
              Participantes ({payload.participants.length})
            </ThemedText>
            {payload.participants.length === 0 ? (
              <ThemedText color="textSecondary" size="sm">
                Nenhum participante selecionado
              </ThemedText>
            ) : (
              <Box gap={3}>
                {payload.participants.map((user) => (
                  <Box key={user.id} flexDirection="row" alignItems="center" gap={3}>
                    <Avatar size="sm" uri={user.image} />
                    <ThemedText>{user.username}</ThemedText>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </ScrollView>

      <Box gap={3} pt={4}>
        <Button onPress={onSave}>
          <ThemedText color="background" weight="semibold">
            Salvar evento
          </ThemedText>
        </Button>
        <Button variant="ghost" onPress={onBack}>
          <ThemedText color="primary" weight="semibold">
            Voltar
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}
