import React, { useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useMutation } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { validationMapErrors } from '@src/shared/utils'

import { SignUpEmailForm, signUpEmailSchema, SignUpForm, SignUpProfileForm, signUpProfileSchema } from '../domain'
import { AuthService } from '../services'
import { AuthEmailStep } from './auth-email-step.component'
import { AuthProfileStep } from './auth-profile-step.component'
import { AuthVerifyEmail } from './auth-verify-email.component'

enum SIGN_UP_STEPS {
  PROFILE = 0,
  EMAIL = 1,
  VERIFY = 2
}

const PROGRESS_STEPS = ['perfil', 'email', 'verificação']

const screenWidth = Dimensions.get('window').width

const EMPTY_FORM: SignUpForm = { name: '', username: '', email: '', password: '' }
const EMPTY_ERRORS: SignUpForm = { name: '', username: '', email: '', password: '' }

type AuthSignUpProps = {
  onBack: () => void
}

export const AuthSignUp: React.FC<AuthSignUpProps> = ({ onBack }) => {
  const { showToast } = useToast()

  const [currentStep, setCurrentStep] = useState<SIGN_UP_STEPS>(SIGN_UP_STEPS.PROFILE)
  const [form, setForm] = useState<SignUpForm>(EMPTY_FORM)
  const [formError, setFormError] = useState<SignUpForm>(EMPTY_ERRORS)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)

  const animatedValue = useSharedValue(0)

  const goToStep = (step: SIGN_UP_STEPS) => {
    animatedValue.value = withTiming(step, { duration: 300 })
    setCurrentStep(step)
  }

  const handleBack = () => {
    if (currentStep === SIGN_UP_STEPS.VERIFY) {
      goToStep(SIGN_UP_STEPS.EMAIL)
    } else if (currentStep === SIGN_UP_STEPS.EMAIL) {
      goToStep(SIGN_UP_STEPS.PROFILE)
    } else {
      onBack()
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value * -screenWidth }]
  }))

  const handleChangeForm = (key: keyof SignUpForm, value: string) => {
    setFormError((prev) => ({ ...prev, [key]: '' }))
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleContinueProfileStep = () => {
    const result = signUpProfileSchema.safeParse({ name: form.name, username: form.username })
    if (!result.success) {
      setFormError((prev) => ({ ...prev, ...validationMapErrors(result.error, formError) }))
      return
    }
    goToStep(SIGN_UP_STEPS.EMAIL)
  }

  const handleUsernameBlur = async () => {
    if (!form.username) return
    const { data } = await AuthService.checkIfUsernameIsAvailable(form.username)
    if (!data.available) {
      setFormError((prev) => ({ ...prev, username: 'esse username não está disponível' }))
      setUsernameAvailable(false)
      return
    }
    setFormError((prev) => ({ ...prev, username: '' }))
    setUsernameAvailable(true)
  }

  const submitSignUp = async () => {
    const result = signUpEmailSchema.safeParse({ email: form.email, password: form.password })
    if (!result.success) {
      setFormError((prev) => ({ ...prev, ...validationMapErrors(result.error, formError) }))
      throw Error
    }

    const { error } = await authClient.signUp.email({
      email: form.email,
      password: form.password,
      name: form.name,
      username: form.username
    })

    if (error) {
      showToast(
        error?.status === 422 ? 'não foi possível criar a conta' : 'algo deu errado, tente novamente mais tarde'
      )
      console.log(error)
      throw Error
    }
  }

  const { mutate: submitSignUpMutation, isPending: isSignUpLoading } = useMutation({
    mutationFn: async () => submitSignUp(),
    onSuccess: () => {
      goToStep(SIGN_UP_STEPS.VERIFY)
    },
    onError: (error) => {
      console.error('todo - add logger', error)
    }
  })

  const profileForm: SignUpProfileForm = { name: form.name, username: form.username }
  const profileFormError: SignUpProfileForm = { name: formError.name, username: formError.username }
  const emailForm: SignUpEmailForm = { email: form.email, password: form.password }
  const emailFormError: SignUpEmailForm = { email: formError.email, password: formError.password }

  return (
    <Box flex={1} style={styles.container}>
      <Box pl={6} pr={6} pt={2} pb={6} flexDirection="row" alignItems="center">
        <TouchableOpacity onPress={handleBack} style={styles.goBackButton}>
          <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
        </TouchableOpacity>

        <Box flex={1} flexDirection="row" gap={2} style={{ justifyContent: 'center' }}>
          {PROGRESS_STEPS.map((_, i) => (
            <Box key={i} style={[styles.progressBar, i <= currentStep && styles.progressBarActive]} />
          ))}
        </Box>

        <ThemedText variant="mono" size="xs" color="textSecondary">
          {currentStep + 1}/{PROGRESS_STEPS.length}
        </ThemedText>
      </Box>

      <Animated.View style={[styles.stepsRow, animatedStyle]}>
        <Box p={6} style={styles.step}>
          <AuthProfileStep
            form={profileForm}
            formError={profileFormError}
            usernameAvailable={usernameAvailable}
            onChangeForm={handleChangeForm}
            onUsernameBlur={handleUsernameBlur}
            onContinue={handleContinueProfileStep}
            isLoading={false}
          />
        </Box>

        <Box p={6} style={styles.step}>
          <AuthEmailStep
            form={emailForm}
            formError={emailFormError}
            onChangeForm={handleChangeForm}
            onContinue={() => submitSignUpMutation()}
            isLoading={isSignUpLoading}
          />
        </Box>

        <Box p={6} style={styles.step}>
          <AuthVerifyEmail emailToBeVerified={form.email} />
        </Box>
      </Animated.View>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  stepsRow: {
    flexDirection: 'row'
  },
  step: {
    width: screenWidth
  },
  progressBar: {
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border
  },
  progressBarActive: {
    backgroundColor: theme.colors.primary
  },
  goBackButton: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: theme.colors.textTertiary,
    padding: 6
  }
})
