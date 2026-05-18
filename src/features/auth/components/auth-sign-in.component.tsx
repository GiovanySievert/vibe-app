import React, { useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers/toast.provider'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText, Touchable } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { validationMapErrors } from '@src/shared/utils'

import { signInSchema, UserSignInRequestDTO } from '../domain'
import {
  AppleSignInMessage,
  AuthMessage,
  GoogleSignInMessage,
  isBannedAuthError,
  useAppleSignIn,
  useAuthSession,
  useGoogleSignIn
} from '../hooks'
import { AuthVerifyEmail } from './auth-verify-email.component'

enum SIGN_IN_STEPS {
  FORM = 0,
  VERIFY = 1
}

const screenWidth = Dimensions.get('window').width

type AuthSignInProps = {
  goToSignUp: () => void
}

export const AuthSignIn: React.FC<AuthSignInProps> = ({ goToSignUp }) => {
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()
  const { persistAuthSession } = useAuthSession()
  const { showToast } = useToast()
  const { isAvailable: isAppleAvailable, loading: appleLoading, signIn: signInWithApple } = useAppleSignIn()
  const { isAvailable: isGoogleAvailable, loading: googleLoading, signIn: signInWithGoogle } = useGoogleSignIn()

  const animatedValue = useSharedValue(0)
  const [currentStep, setCurrentStep] = useState<SIGN_IN_STEPS>(SIGN_IN_STEPS.FORM)

  const [form, setForm] = useState<UserSignInRequestDTO>({
    login: '',
    password: ''
  })

  const [formError, setFormError] = useState<UserSignInRequestDTO>({
    login: '',
    password: ''
  })
  const [loading, setLoading] = useState<boolean>(false)

  const goToStep = (step: SIGN_IN_STEPS) => {
    animatedValue.value = withTiming(step, { duration: 300 })
    setCurrentStep(step)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value * -screenWidth }]
  }))

  const handleChangeInputValue = (key: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const validateSignInSchema = (): boolean => {
    const result = signInSchema.safeParse({ login: form.login, password: form.password })
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      return false
    }
    return true
  }

  const handleErrorsInSignIn = (error: any) => {
    if (isBannedAuthError(error)) {
      setFormError({
        login: '',
        password: AuthMessage.banned
      })
      showToast(AuthMessage.banned, 'error')
      return
    }

    if (error?.status === 403) {
      goToStep(SIGN_IN_STEPS.VERIFY)
      return
    }

    setFormError({
      login: '',
      password: 'email ou senha inválidos'
    })
  }

  const handleAppleSignIn = async () => {
    const result = await signInWithApple()
    if (result.success || result.cancelled) return
    showToast(result.errorMessage ?? AppleSignInMessage.authFailed, 'error')
  }

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle()
    if (result.success || result.cancelled) return
    showToast(result.errorMessage ?? GoogleSignInMessage.authFailed, 'error')
  }

  const submitForm = async () => {
    setLoading(true)
    try {
      if (!validateSignInSchema()) return

      const { error, data } = await authClient.signIn.email({
        email: form.login,
        password: form.password
      })

      if (error) handleErrorsInSignIn(error)

      if (data) {
        await persistAuthSession({ token: data.token, user: data.user })
      }
    } catch {
      showToast('algo deu errado, tente novamente mais tarde.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const isFormStepActive = currentStep === SIGN_IN_STEPS.FORM
  const isVerifyStepActive = currentStep === SIGN_IN_STEPS.VERIFY

  return (
    <Box flex={1} style={styles.container}>
      <Animated.View style={[styles.stepsRow, animatedStyle]}>
        <Box
          mt={20}
          p={6}
          style={styles.step}
          pointerEvents={isFormStepActive ? 'auto' : 'none'}
          accessibilityElementsHidden={!isFormStepActive}
          importantForAccessibility={isFormStepActive ? 'auto' : 'no-hide-descendants'}
        >
          <Box mb={4}>
            <ThemedText variant="title" size="4xl" color="textPrimary">
              vibes
            </ThemedText>
            <ThemedText variant="primary" color="textSecondary">
              onde seus amigos estāo agora.
            </ThemedText>
          </Box>
          <Box gap={6}>
            <Input
              label="email"
              value={form.login}
              onChange={({ nativeEvent }) => handleChangeInputValue('login', nativeEvent.text)}
              errorMessage={formError.login}
              keyboardType="email-address"
              inputMode="email"
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
            />
            <Input
              label="senha"
              value={form.password}
              onChange={({ nativeEvent }) => handleChangeInputValue('password', nativeEvent.text)}
              errorMessage={formError.password}
              secureTextEntry
              keyboardType="default"
              autoComplete="off"
              textContentType="none"
            />

            <Box mt={2} alignItems="flex-end">
              <Touchable
                onPress={() => navigation.navigate('ForgotPasswordScreen', { typedEmail: form.login })}
                accessibilityRole="link"
                accessibilityLabel="Esqueci a senha"
              >
                <ThemedText size="sm" color="textSecondary" textDecorationLine="underline">
                  esqueci a senha
                </ThemedText>
              </Touchable>
            </Box>
            <Box gap={3}>
              <Button onPress={() => submitForm()} loading={loading}>
                <ThemedText color="background" size="lg" weight="semibold">
                  entrar
                </ThemedText>
              </Button>

              {isAppleAvailable && (
                <Button variant="outline" onPress={handleAppleSignIn} loading={appleLoading}>
                  <ThemedText color="textPrimary" size="lg" weight="semibold">
                    entrar com apple
                  </ThemedText>
                </Button>
              )}

              {isGoogleAvailable && (
                <Button variant="outline" onPress={handleGoogleSignIn} loading={googleLoading}>
                  <ThemedText color="textPrimary" size="lg" weight="semibold">
                    entrar com google
                  </ThemedText>
                </Button>
              )}
            </Box>
          </Box>
          <Touchable
            onPress={() => goToSignUp()}
            accessibilityRole="link"
            accessibilityLabel="Criar conta"
            accessibilityHint="Abre o fluxo de cadastro"
          >
            <Box mt={6} justifyContent="center" flexDirection="row" alignItems="center">
              <ThemedText color="textSecondary">primeira vez? </ThemedText>
              <ThemedText weight="semibold" textDecorationLine="underline">
                criar conta
              </ThemedText>
            </Box>
          </Touchable>

          <Box justifyContent="center" flexDirection="row" alignItems="center">
            <ThemedText variant="mono" color="textSecondary">
              ao continuar voce aceita
            </ThemedText>
          </Box>

          <Box justifyContent="center" flexDirection="row" alignItems="center">
            <ThemedText variant="mono" color="textSecondary">
              os{' '}
            </ThemedText>

            <Touchable
              onPress={() => navigation.navigate('TermsScreen')}
              accessibilityRole="link"
              accessibilityLabel="Termos de uso"
            >
              <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
                termos
              </ThemedText>
            </Touchable>

            <ThemedText variant="mono" color="textSecondary">
              {' '}
              e a{' '}
            </ThemedText>

            <Touchable
              onPress={() => navigation.navigate('PrivacyScreen')}
              accessibilityRole="link"
              accessibilityLabel="Política de privacidade"
            >
              <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
                privacidade
              </ThemedText>
            </Touchable>
          </Box>
        </Box>

        <Box
          p={6}
          style={styles.step}
          pointerEvents={isVerifyStepActive ? 'auto' : 'none'}
          accessibilityElementsHidden={!isVerifyStepActive}
          importantForAccessibility={isVerifyStepActive ? 'auto' : 'no-hide-descendants'}
        >
          <Box mb={6} flexDirection="row" alignItems="center" gap={3}>
            <Touchable
              onPress={() => goToStep(SIGN_IN_STEPS.FORM)}
              style={styles.goBackButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              accessibilityHint="Volta para o formulário de login"
            >
              <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
            </Touchable>
            <ThemedText variant="title">confirme seu email</ThemedText>
          </Box>
          <AuthVerifyEmail
            emailToBeVerified={form.login}
            passwordToSignIn={form.password}
            hideTitle
            isActive={isVerifyStepActive}
          />
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
  goBackButton: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: theme.colors.textSecondary,
    padding: 6
  }
})
