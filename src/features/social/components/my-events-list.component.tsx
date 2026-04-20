import React, { useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'

import { useQuery } from '@tanstack/react-query'

import { Avatar, Box, Card, Divider, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { formatEventDateTime } from '@src/shared/utils'

import { EventResponse, EventService } from '../services/event.service'
import { EventDetailModal } from './event-detail-modal.component'

const MyEventItem = ({
  item,
  index,
  total,
  onPress
}: {
  item: EventResponse
  index: number
  total: number
  onPress: () => void
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Box>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={3}>
        <Box flex={1} gap={1}>
          <ThemedText weight="semibold">{item.name}</ThemedText>
          <ThemedText size="sm" color="textSecondary">{formatEventDateTime(item.date, item.time)}</ThemedText>
        </Box>

        <Box style={styles.badge} alignItems="center" justifyContent="center">
          <ThemedText size="xs" color="primary" weight="semibold">
            {item.participants.length} participante{item.participants.length !== 1 ? 's' : ''}
          </ThemedText>
        </Box>
      </Box>

      {item.participants.length > 0 && (
        <Box mt={3} flexDirection="row" alignItems="center" gap={2}>
          <Box flexDirection="row">
            {item.participants.slice(0, 3).map((participant, participantIndex) => (
              <Box
                key={participant.id}
                style={[styles.avatarWrapper, { marginLeft: participantIndex > 0 ? -8 : 0 }]}
              >
                <Avatar size="sm" uri={participant.avatar} />
              </Box>
            ))}
          </Box>

          {item.participants.length > 3 && (
            <ThemedText size="xs" color="textSecondary">
              +{item.participants.length - 3} pessoa{item.participants.length - 3 !== 1 ? 's' : ''}
            </ThemedText>
          )}
        </Box>
      )}

      {index !== total - 1 && (
        <Box mt={4} mb={4}>
          <Divider />
        </Box>
      )}
    </Box>
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

  return (
    <>
      <Box mr={5} ml={5} gap={3}>
        <ThemedText>Meus eventos</ThemedText>
        <Card pr={5} pl={5} pt={5} pb={5}>
          <FlatList
            data={myEvents}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <MyEventItem
                item={item}
                index={index}
                total={myEvents.length}
                onPress={() => setSelectedEvent(item)}
              />
            )}
          />
        </Card>
      </Box>

      <EventDetailModal
        event={selectedEvent}
        visible={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryGlow,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.backgroundTertiary,
    borderRadius: 999
  }
})
