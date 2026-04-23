import React from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Box, Divider, ThemedText } from '@src/shared/components'

import { EventCommentService } from '../services/event-comment.service'
import { EventCommentCreate } from './event-comment-create.component'
import { EventCommentList } from './event-comment-list.component'

type EventCommentsSectionProps = {
  eventId: string
  eventOwnerId: string
  currentUserId: string
}

export const EventCommentsSection: React.FC<EventCommentsSectionProps> = ({ eventId, eventOwnerId, currentUserId }) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['eventComments', eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await EventCommentService.list(eventId, pageParam as number)
      return res.data
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1
  })

  const comments = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <Box gap={5} mb={10}>
      <Divider />
      <ThemedText size="sm" color="textSecondary" weight="semibold">
        Recados {comments.length > 0 ? `(${data?.pages[0].total})` : ''}
      </ThemedText>

      <EventCommentCreate eventId={eventId} currentUserId={currentUserId} />

      <EventCommentList
        eventId={eventId}
        eventOwnerId={eventOwnerId}
        currentUserId={currentUserId}
        comments={comments}
        isLoading={isLoading}
        total={data?.pages[0]?.total ?? 0}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </Box>
  )
}
