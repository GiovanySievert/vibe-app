import { useEffect, useState } from 'react'
import {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import {
  MILESTONES_CARD_HIDDEN_OFFSET,
  MILESTONES_REMOVE_DELAY_MS,
  MILESTONES_VISIBLE_MS,
  REVIEW_COUNT_RING_CIRCUMFERENCE
} from './constants'

type Params = {
  isLoading: boolean
  hasUnlockedBadge: boolean
  progress: number
  reviewCount: number
}

export const useSuccessAnimations = ({ isLoading, hasUnlockedBadge, progress, reviewCount }: Params) => {
  const progressWidth = useSharedValue(0)
  const badgeRingProgress = useSharedValue(0)
  const milestonesTranslateY = useSharedValue(MILESTONES_CARD_HIDDEN_OFFSET)
  const milestonesOpacity = useSharedValue(0)
  const [showMilestones, setShowMilestones] = useState(false)

  useEffect(() => {
    progressWidth.value = 0
    badgeRingProgress.value = 0
    if (isLoading) return

    progressWidth.value = withTiming((hasUnlockedBadge ? 1 : progress) * 100, {
      duration: 900,
      easing: Easing.out(Easing.cubic)
    })

    if (hasUnlockedBadge) {
      badgeRingProgress.value = withTiming(1, {
        duration: 1100,
        easing: Easing.out(Easing.cubic)
      })
    }
  }, [badgeRingProgress, hasUnlockedBadge, isLoading, progress, progressWidth])

  useEffect(() => {
    milestonesTranslateY.value = MILESTONES_CARD_HIDDEN_OFFSET
    milestonesOpacity.value = 0

    if (isLoading) {
      setShowMilestones(false)
      return
    }

    setShowMilestones(true)

    milestonesTranslateY.value = withTiming(0, {
      duration: 480,
      easing: Easing.out(Easing.cubic)
    })
    milestonesOpacity.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.cubic)
    })

    const hideTimeout = setTimeout(() => {
      milestonesTranslateY.value = withTiming(MILESTONES_CARD_HIDDEN_OFFSET, {
        duration: 460,
        easing: Easing.in(Easing.cubic)
      })
      milestonesOpacity.value = withTiming(0, {
        duration: 320,
        easing: Easing.in(Easing.cubic)
      })
    }, MILESTONES_VISIBLE_MS)

    const removeTimeout = setTimeout(() => {
      setShowMilestones(false)
    }, MILESTONES_REMOVE_DELAY_MS)

    return () => {
      clearTimeout(hideTimeout)
      clearTimeout(removeTimeout)
    }
  }, [isLoading, milestonesOpacity, milestonesTranslateY, reviewCount])

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }))

  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: REVIEW_COUNT_RING_CIRCUMFERENCE * (1 - badgeRingProgress.value)
  }))

  const milestonesStyle = useAnimatedStyle(() => ({
    opacity: milestonesOpacity.value,
    transform: [{ translateY: milestonesTranslateY.value }]
  }))

  return { progressStyle, ringProps, milestonesStyle, showMilestones }
}
