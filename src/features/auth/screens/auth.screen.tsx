import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { Box } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'

import { AuthSignIn, AuthSignUp, AuthVerifyEmail } from '../components'

enum AUTH_STEPS {
  SIGN_IN_STEP = 'SIGN_IN_STEP',
  SIGN_UP_STEP = 'SIGN_UP_STEP',
  VERIFY_EMAIL_STEP = 'VERIFY_EMAIL_STEP'
}

export const AuthScreen = () => {
  const [emailToBeVerified, setEmailToBeVerified] = useState<string>('')

  const [currentStep, setCurrentStep] = useState<AUTH_STEPS>(AUTH_STEPS.SIGN_IN_STEP)
  const animatedValue = useSharedValue(0)
  const screenWidth = Dimensions.get('window').width

  useEffect(() => {
    let targetValue
    switch (currentStep) {
      case AUTH_STEPS.SIGN_IN_STEP:
        targetValue = 0
        break
      case AUTH_STEPS.SIGN_UP_STEP:
        targetValue = 1
        break
      case AUTH_STEPS.VERIFY_EMAIL_STEP:
        targetValue = 2
        break
    }
    animatedValue.value = targetValue
  }, [currentStep, animatedValue])

  const goToStep = (step: AUTH_STEPS) => {
    setCurrentStep(step)
  }

  const handlePressGoBackButton = () => {
    setCurrentStep(AUTH_STEPS.SIGN_IN_STEP)
  }

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = animatedValue.value * -screenWidth

    return {
      transform: [{ translateX: withTiming(translateX, { duration: 300 }) }]
    }
  })

  return (
    <Screen>
      <ScrollView>
        <Box p={currentStep === AUTH_STEPS.SIGN_IN_STEP ? 6 : 4}>
          {currentStep !== AUTH_STEPS.SIGN_IN_STEP && (
            <TouchableOpacity onPress={() => handlePressGoBackButton()}>
              <ThemedIcon name="ChevronLeft" color="primary" size={24} />
            </TouchableOpacity>
          )}
        </Box>
        <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
          <Box p={4} style={{ width: '100%' }}>
            {currentStep === AUTH_STEPS.SIGN_IN_STEP && (
              <AuthSignIn
                goToSignUp={() => goToStep(AUTH_STEPS.SIGN_UP_STEP)}
                goToVerifyEmail={() => goToStep(AUTH_STEPS.VERIFY_EMAIL_STEP)}
                setEmailToBeVerified={setEmailToBeVerified}
              />
            )}
          </Box>
          <Box p={4} style={{ width: '100%' }}>
            {currentStep === AUTH_STEPS.SIGN_UP_STEP && (
              <AuthSignUp
                goToVerifyEmailStep={() => goToStep(AUTH_STEPS.VERIFY_EMAIL_STEP)}
                setEmailToBeVerified={setEmailToBeVerified}
              />
            )}
          </Box>

          <Box style={{ width: '100%' }}>
            {currentStep === AUTH_STEPS.VERIFY_EMAIL_STEP && <AuthVerifyEmail emailToBeVerified={emailToBeVerified} />}
          </Box>
        </Animated.View>
      </ScrollView>
    </Screen>
  )
}
