import React, { useState } from 'react'

import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'

import { FeedReviewCommentCreate } from './feed-review-comment-create.component'
import { FeedReviewCommentList } from './feed-review-comment-list.component'

type Props = {
  reviewId: string
  visible: boolean
  commentsCount?: number
  currentUserId: string
  reviewOwnerId: string
}

export const FeedReviewCommentsContent: React.FC<Props> = ({ reviewId, visible, commentsCount, currentUserId, reviewOwnerId }) => {
  const [total, setTotal] = useState(0)

  return (
    <Box pl={5} pr={5} pb={5} flex={1}>
      <Box mb={4}>
        <ThemedText weight="semibold" size="lg" color="textPrimary">
          Comentários
        </ThemedText>
        <ThemedText size="sm" color="textSecondary">
          {total > 0 ? `${total} resposta${total > 1 ? 's' : ''}` : 'Seja o primeiro a responder'}
        </ThemedText>
      </Box>
      <FeedReviewCommentCreate reviewId={reviewId} />
      <FeedReviewCommentList reviewId={reviewId} visible={visible} commentsCount={commentsCount ?? -1} currentUserId={currentUserId} reviewOwnerId={reviewOwnerId} onTotalChange={setTotal} />
    </Box>
  )
}
