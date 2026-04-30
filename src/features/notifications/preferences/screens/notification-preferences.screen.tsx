import React from 'react'
import { ScrollView, StyleSheet, Switch } from 'react-native'

import { Box, Card, Divider, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

import { NotificationType } from '../../inbox/services/notification-inbox.service'
import {
  useNotificationPreferences,
  useUpdateNotificationPreference
} from '../hooks/use-notification-preferences.hook'

const TYPE_LABELS: Record<NotificationType, { title: string; description: string }> = {
  event_invitation: {
    title: 'Convites para eventos',
    description: 'Quando alguem te convida pra um evento.'
  },
  follow_request_created: {
    title: 'Solicitacoes de seguir',
    description: 'Quando alguem pede pra te seguir.'
  }
}

export const NotificationPreferencesScreen = () => {
  const { data, isLoading } = useNotificationPreferences()
  const update = useUpdateNotificationPreference()

  return (
    <Screen>
      <ScrollView>
        <Box pl={5} pr={5} pt={5} pb={5}>
          <ThemedText variant="title">Notificacoes</ThemedText>
          <ThemedText variant="mono" color="textSecondary">
            controle como cada tipo te alcanca
          </ThemedText>
        </Box>

        <Box pl={5} pr={5}>
          <Card pt={4} pb={4} pl={4} pr={4}>
            {isLoading ? (
              <ThemedText color="textSecondary">Carregando...</ThemedText>
            ) : (
              data?.map((pref, idx) => {
                const meta = TYPE_LABELS[pref.type]
                return (
                  <React.Fragment key={pref.type}>
                    <Box flexDirection="row" alignItems="center" gap={3} pt={3} pb={3}>
                      <Box flex={1}>
                        <ThemedText weight="semibold">{meta.title}</ThemedText>
                        <ThemedText size="sm" color="textSecondary">
                          {meta.description}
                        </ThemedText>
                      </Box>
                      <Box alignItems="flex-end">
                        <ThemedText size="xs" color="textSecondary">
                          push
                        </ThemedText>
                        <Switch
                          value={pref.pushEnabled}
                          onValueChange={(value) =>
                            update.mutate({ type: pref.type, pushEnabled: value })
                          }
                          trackColor={{
                            true: theme.colors.primary,
                            false: theme.colors.border
                          }}
                        />
                      </Box>
                    </Box>
                    {idx !== (data?.length ?? 0) - 1 && <Divider />}
                  </React.Fragment>
                )
              })
            )}
          </Card>

          <Box pt={4}>
            <ThemedText size="xs" color="textSecondary" style={styles.footer}>
              Notificacoes in-app aparecem sempre no inbox.
            </ThemedText>
          </Box>
        </Box>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  footer: {
    textAlign: 'center'
  }
})
