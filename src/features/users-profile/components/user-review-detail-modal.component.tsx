import React from 'react'
import { Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'

import { FeedReviewCommentsContent } from '@src/features/feed/components/feed-review-comments-content.component'
import { ReviewCard } from '@src/features/feed/components/review-card.component'
import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'

const MODAL_HEIGHT = Dimensions.get('window').height * 0.9

type Props = {
  item: FeedReviewItem | null
  currentUserId: string
  onClose: () => void
}

export const UserReviewDetailModal: React.FC<Props> = ({ item, currentUserId, onClose }) => {
  return (
    <SwipeableModal visible={item !== null} height={MODAL_HEIGHT} onClose={onClose}>
      {item && (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <ReviewCard review={item} currentUserId={currentUserId} enableFavoriteAction />
          </ScrollView>
          <FeedReviewCommentsContent reviewId={item.id} visible={true} currentUserId={currentUserId} reviewOwnerId={item.userId} />
        </KeyboardAvoidingView>
      )}
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
