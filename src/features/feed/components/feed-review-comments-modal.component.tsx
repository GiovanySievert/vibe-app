import React from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native'

import { SwipeableModal } from '@src/shared/components'
import { PlatformOS } from '@src/shared/constants/platform'

import { FeedReviewCommentsContent } from './feed-review-comments-content.component'

type Props = {
  reviewId: string
  visible: boolean
  commentsCount: number
  currentUserId: string
  reviewOwnerId: string
  onClose: () => void
}

export const FeedReviewCommentsModal: React.FC<Props> = ({ reviewId, visible, commentsCount, currentUserId, reviewOwnerId, onClose }) => {
  return (
    <SwipeableModal visible={visible} onClose={onClose} height={620}>
      <KeyboardAvoidingView style={styles.keyboardWrap} behavior={Platform.OS === PlatformOS.IOS ? 'padding' : undefined}>
        <FeedReviewCommentsContent reviewId={reviewId} visible={visible} commentsCount={commentsCount} currentUserId={currentUserId} reviewOwnerId={reviewOwnerId} />
      </KeyboardAvoidingView>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1
  }
})
