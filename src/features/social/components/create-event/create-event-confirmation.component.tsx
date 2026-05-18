import React from 'react'
import { Image, ScrollView, StyleSheet } from 'react-native'

import { Avatar, Box, Button, Divider, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { formatEventDateTime } from '@src/shared/utils'

import { CreateEventPayload } from '../../domain/event.model'

type CreateEventConfirmationProps = {
  payload: CreateEventPayload
  loading?: boolean
  onSave: () => void
  onBack: () => void
}

export const CreateEventConfirmation: React.FC<CreateEventConfirmationProps> = ({
  payload,
  loading,
  onSave,
  onBack
}) => {
  const { t } = useAppTranslation()

  return (
    <Box style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Box gap={4} pb={4}>
          {payload.imageUri && (
            <Image
              source={{ uri: payload.imageUri }}
              style={styles.coverImage}
              resizeMode="cover"
              accessible
              accessibilityLabel={t('common.eventCoverImage', {
                name: payload.name
              })}
            />
          )}

          <Box gap={1}>
            <ThemedText size="sm" color="textSecondary" weight="semibold">
              {t('social.createEvent.eventNameLabel')}
            </ThemedText>
            <ThemedText weight="semibold">{payload.name}</ThemedText>
          </Box>

          <Divider />

          <Box gap={1}>
            <ThemedText size="sm" color="textSecondary" weight="semibold">
              {t('social.createEvent.dateTimeLabel')}
            </ThemedText>
            <ThemedText>{formatEventDateTime(payload.date, payload.time)}</ThemedText>
          </Box>

          {payload.place && (
            <>
              <Divider />
              <Box gap={1}>
                <ThemedText size="sm" color="textSecondary" weight="semibold">
                  {t('social.eventDetail.placeLabel')}
                </ThemedText>
                <ThemedText>{payload.place.name}</ThemedText>
                {!![payload.place.type, payload.place.neighborhood].filter(Boolean).length && (
                  <ThemedText size="sm" color="textSecondary">
                    {[payload.place.type, payload.place.neighborhood].filter(Boolean).join(' · ')}
                  </ThemedText>
                )}
              </Box>
            </>
          )}

          {payload.description.trim().length > 0 && (
            <>
              <Divider />
              <Box gap={1}>
                <ThemedText size="sm" color="textSecondary" weight="semibold">
                  {t('social.eventDetail.descLabel')}
                </ThemedText>
                <ThemedText>{payload.description}</ThemedText>
              </Box>
            </>
          )}

          <Divider />

          <Box gap={2}>
            <ThemedText size="sm" color="textSecondary" weight="semibold">
              {t('social.createEvent.participantsLabel', {
                count: payload.participants.length
              })}
            </ThemedText>
            {payload.participants.length === 0 ? (
              <ThemedText color="textSecondary" size="sm">
                {t('social.createEvent.noParticipantsSelected')}
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
        <Button onPress={onSave} loading={loading}>
          <ThemedText color="background" weight="semibold">
            {t('social.createEvent.saveBtn')}
          </ThemedText>
        </Button>
        <Button variant="ghost" onPress={onBack}>
          <ThemedText color="primary" weight="semibold">
            {t('social.createEvent.backBtn')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 180,
    borderRadius: 16
  }
})
