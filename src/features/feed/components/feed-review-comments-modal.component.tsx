import React from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

import { SwipeableModal } from '@src/shared/components'

import { FeedReviewCommentsContent } from './feed-review-comments-content.component'

type Props = {
  reviewId: string
  visible: boolean
  onClose: () => void
}

export const FeedReviewCommentsModal: React.FC<Props> = ({ reviewId, visible, onClose }) => {
  return (
    <SwipeableModal visible={visible} onClose={onClose} height={620}>
      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FeedReviewCommentsContent reviewId={reviewId} visible={visible} />
      </KeyboardAvoidingView>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1
  }
})
