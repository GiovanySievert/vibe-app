import React, { useEffect, useState } from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { Box } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'

import { ForgotPasswordCodeStep, ForgotPasswordEmailStep } from '../components'

enum FORGET_PASSWORD_STEPS {
  TYPE_EMAIL_STEP = 'TYPE_EMAIL_STEP',
  TYPE_CODE_STEP = 'TYPE_CODE_STEP'
}

type BranchLaboratoryScreenProps = NativeStackScreenProps<UnathenticatedStackParamList, 'ForgotPasswordScreen'>

export const ForgotPasswordScreen: React.FC<BranchLaboratoryScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()

  const animatedValue = useSharedValue(0)
  const screenWidth = Dimensions.get('window').width
  const [currentStep, setCurrentStep] = useState<FORGET_PASSWORD_STEPS>(FORGET_PASSWORD_STEPS.TYPE_EMAIL_STEP)
  const [typedEmailFromEmailStep, setTypedEmailFromEmailStep] = useState<string>('')
  const typedEmailFromParams = route.params?.typedEmail

  useEffect(() => {
    let targetValue
    switch (currentStep) {
      case FORGET_PASSWORD_STEPS.TYPE_EMAIL_STEP:
        targetValue = 0
        break
      case FORGET_PASSWORD_STEPS.TYPE_CODE_STEP:
        targetValue = 1
        break
    }
    animatedValue.value = targetValue
  }, [currentStep, animatedValue])

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = animatedValue.value * -screenWidth

    return {
      transform: [{ translateX: withTiming(translateX, { duration: 300 }) }]
    }
  })

  const handlePressGoBackButton = () => {
    navigation.navigate('AuthScreen')
  }

  const goToStep = (step: FORGET_PASSWORD_STEPS) => {
    setCurrentStep(step)
  }

  return (
    <Screen>
      <TouchableOpacity onPress={() => handlePressGoBackButton()}>
        <ThemedIcon name="ChevronLeft" color="primary" size={24} />
      </TouchableOpacity>
      <Animated.View style={[{ flexDirection: 'row' }, animatedStyle]}>
        <Box p={4} style={{ width: '100%' }}>
          {currentStep === FORGET_PASSWORD_STEPS.TYPE_EMAIL_STEP && (
            <ForgotPasswordEmailStep
              typedEmail={typedEmailFromParams}
              goToCodeStep={() => goToStep(FORGET_PASSWORD_STEPS.TYPE_CODE_STEP)}
              setTypedEmailFromEmailStep={setTypedEmailFromEmailStep}
            />
          )}
        </Box>
        <Box p={4} style={{ width: '100%' }}>
          {currentStep === FORGET_PASSWORD_STEPS.TYPE_CODE_STEP && (
            <ForgotPasswordCodeStep typedEmail={typedEmailFromParams || typedEmailFromEmailStep} />
          )}
        </Box>
      </Animated.View>
    </Screen>
  )
}
