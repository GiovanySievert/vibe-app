import React, { useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useSetAtom } from 'jotai'

import { Box, SwipeableModal } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { setOnboardingComplete } from '../storage/onboarding-storage'
import { showOnboardingAtom } from '../state/onboarding.state'
import { OnboardingStepLocation } from './onboarding-step-location.component'
import { OnboardingStepReview } from './onboarding-step-review.component'
import { OnboardingStepThanks } from './onboarding-step-thanks.component'
import { OnboardingStepWelcome } from './onboarding-step-welcome.component'

enum ONBOARDING_STEPS {
  WELCOME = 0,
  LOCATION = 1,
  REVIEW = 2,
  THANKS = 3
}

const screenWidth = Dimensions.get('window').width
const MODAL_HEIGHT = Dimensions.get('window').height * 0.92

const TOTAL_STEPS = Object.keys(ONBOARDING_STEPS).length / 2

export const OnboardingModal: React.FC = () => {
  const setShowOnboarding = useSetAtom(showOnboardingAtom)
  const [currentStep, setCurrentStep] = useState(ONBOARDING_STEPS.WELCOME)
  const animatedValue = useSharedValue(0)

  const goToStep = (step: ONBOARDING_STEPS) => {
    animatedValue.value = withTiming(step, { duration: 300 })
    setCurrentStep(step)
  }

  const handleFinish = async () => {
    await setOnboardingComplete()
    setShowOnboarding(false)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value * -screenWidth }]
  }))

  return (
    <SwipeableModal visible isDismissible={false} height={MODAL_HEIGHT} onClose={handleFinish}>
      <Box flex={1} style={styles.container}>
        <Box flexDirection="row" justifyContent="center" gap={2} pt={2} pb={4}>
          {Array.from({ length: TOTAL_STEPS }).map((_, dotIndex) => (
            <Box
              key={dotIndex}
              style={[styles.dot, currentStep === dotIndex && styles.dotActive]}
            />
          ))}
        </Box>

        <Animated.View style={[styles.stepsRow, animatedStyle]}>
          <Box p={5} style={styles.step}>
            {currentStep === ONBOARDING_STEPS.WELCOME && (
              <OnboardingStepWelcome onNext={() => goToStep(ONBOARDING_STEPS.LOCATION)} />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === ONBOARDING_STEPS.LOCATION && (
              <OnboardingStepLocation onNext={() => goToStep(ONBOARDING_STEPS.REVIEW)} />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === ONBOARDING_STEPS.REVIEW && (
              <OnboardingStepReview onNext={() => goToStep(ONBOARDING_STEPS.THANKS)} />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === ONBOARDING_STEPS.THANKS && (
              <OnboardingStepThanks onFinish={handleFinish} />
            )}
          </Box>
        </Animated.View>
      </Box>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border
  },
  dotActive: {
    width: 20,
    backgroundColor: theme.colors.primary
  },
  stepsRow: {
    flexDirection: 'row',
    flex: 1
  },
  step: {
    width: '100%'
  }
})
