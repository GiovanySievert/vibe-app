import React, { useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { Box } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'

import { AuthSignIn, AuthSignUp } from '../components'

enum AUTH_STEPS {
  SIGN_IN = 0,
  SIGN_UP = 1
}

const screenWidth = Dimensions.get('window').width

export const AuthScreen = () => {
  const [currentStep, setCurrentStep] = useState<AUTH_STEPS>(AUTH_STEPS.SIGN_IN)
  const animatedValue = useSharedValue(0)

  const goToStep = (step: AUTH_STEPS) => {
    animatedValue.value = withTiming(step, { duration: 300 })
    setCurrentStep(step)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value * -screenWidth }]
  }))

  return (
    <Screen gradient>
      <ScrollView>
        <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
          <Box style={{ width: screenWidth }}>
            {currentStep === AUTH_STEPS.SIGN_IN && <AuthSignIn goToSignUp={() => goToStep(AUTH_STEPS.SIGN_UP)} />}
          </Box>

          <Box style={{ width: screenWidth }}>
            {currentStep === AUTH_STEPS.SIGN_UP && <AuthSignUp onBack={() => goToStep(AUTH_STEPS.SIGN_IN)} />}
          </Box>
        </Animated.View>
      </ScrollView>
    </Screen>
  )
}
