import React, { useState } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

import { useQuery } from '@tanstack/react-query'

import { Avatar, Box, Card, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { formatShortEventDateTime } from '@src/shared/utils'

import { EventResponse, EventService } from '../services/event.service'
import { EventDetailModal } from './event-detail-modal.component'

const MyEventItem = ({ item, onPress }: { item: EventResponse; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Card pr={4} pl={4} pt={4} pb={4} gap={3}>
      <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap={3}>
        <Box flex={1} gap={1}>
          <ThemedText weight="bold" size="md">
            {item.name}
          </ThemedText>
          <ThemedText variant="mono" size="xs">
            {formatShortEventDateTime(item.date, item.time)}
          </ThemedText>
          {item.place && (
            <ThemedText color="textSecondary" size="sm" numberOfLines={1}>
              {item.place.name}
            </ThemedText>
          )}
        </Box>

        <Box style={styles.hostBadge}>
          <ThemedText variant="mono" size="xs" color="primary" letterSpacing="wider">
            HOST
          </ThemedText>
        </Box>
      </Box>

      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.coverImage} resizeMode="cover" />}

      {item.participants.length > 0 && (
        <Box flexDirection="row" alignItems="center" gap={2}>
          <Box flexDirection="row">
            {item.participants.slice(0, 3).map((participant, participantIndex) => (
              <Box key={participant.id} style={[styles.avatarWrapper, { marginLeft: participantIndex > 0 ? -8 : 0 }]}>
                <Avatar size="xs" uri={participant.avatar} />
              </Box>
            ))}
          </Box>
          <ThemedText variant="mono" size="xs">
            {item.participants.length} pessoa{item.participants.length !== 1 ? 's' : ''}
          </ThemedText>
        </Box>
      )}
    </Card>
  </TouchableOpacity>
)

export const MyEventsList = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(null)

  const { data: myEvents, isLoading } = useQuery({
    queryKey: ['myEvents'],
    queryFn: async () => {
      const { data } = await EventService.listMyEvents()
      return data
    }
  })

  if (!myEvents?.length || isLoading) {
    return null
  }

  const count = myEvents.length.toString().padStart(2, '0')

  return (
    <>
      <Box mr={5} ml={5} gap={3}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
            meus eventos
          </ThemedText>
          <ThemedText variant="mono" size="xs" letterSpacing="wider">
            {count}
          </ThemedText>
        </Box>

        <Box gap={3}>
          {myEvents.map((item) => (
            <MyEventItem key={item.id} item={item} onPress={() => setSelectedEvent(item)} />
          ))}
        </Box>
      </Box>

      <EventDetailModal event={selectedEvent} visible={!!selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  )
}

const styles = StyleSheet.create({
  avatarWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.backgroundSecondary,
    borderRadius: 999
  },
  hostBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  coverImage: {
    width: '100%',
    height: 140,
    borderRadius: 14
  }
})
