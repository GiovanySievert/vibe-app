import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

import { Box, SwipeableModal, ThemedText } from '@src/shared/components'

import { FeedReviewCommentCreate } from './feed-review-comment-create.component'
import { FeedReviewCommentList } from './feed-review-comment-list.component'

type Props = {
  reviewId: string
  visible: boolean
  onClose: () => void
}

export const FeedReviewCommentsModal: React.FC<Props> = ({ reviewId, visible, onClose }) => {
  const [total, setTotal] = useState(0)

  return (
    <SwipeableModal visible={visible} onClose={onClose} height={620}>
      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          <FeedReviewCommentList reviewId={reviewId} visible={visible} onTotalChange={setTotal} />
        </Box>
      </KeyboardAvoidingView>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1
  }
})
