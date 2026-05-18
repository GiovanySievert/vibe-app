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
import { useAppTranslation } from '@src/shared/i18n'
import { validationMapErrors } from '@src/shared/utils'

import { buildSignInSchema, UserSignInRequestDTO } from '../domain'
import {
  AppleSignInMessageKey,
  AuthMessageKey,
  GoogleSignInMessageKey,
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
  const { t } = useAppTranslation()

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
    const result = buildSignInSchema().safeParse({
      login: form.login,
      password: form.password
    })
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
        password: t(AuthMessageKey.banned)
      })
      showToast(t(AuthMessageKey.banned), 'error')
      return
    }

    if (error?.status === 403) {
      goToStep(SIGN_IN_STEPS.VERIFY)
      return
    }

    setFormError({
      login: '',
      password: t('auth.errors.invalidCredentials')
    })
  }

  const handleAppleSignIn = async () => {
    const result = await signInWithApple()
    if (result.success || result.cancelled) return
    showToast(result.errorMessage ?? t(AppleSignInMessageKey.authFailed), 'error')
  }

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle()
    if (result.success || result.cancelled) return
    showToast(result.errorMessage ?? t(GoogleSignInMessageKey.authFailed), 'error')
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
      showToast(t('auth.errors.generic'), 'error')
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
              {t('auth.signIn.subtitle')}
            </ThemedText>
          </Box>
          <Box gap={6}>
            <Input
              label={t('auth.signIn.emailLabel')}
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
              label={t('auth.signIn.passwordLabel')}
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
                onPress={() =>
                  navigation.navigate('ForgotPasswordScreen', {
                    typedEmail: form.login
                  })
                }
                accessibilityRole="link"
                accessibilityLabel={t('auth.signIn.forgotPasswordLink')}
              >
                <ThemedText size="sm" color="textSecondary" textDecorationLine="underline">
                  {t('auth.signIn.forgotPasswordText')}
                </ThemedText>
              </Touchable>
            </Box>
            <Box gap={3}>
              <Button onPress={() => submitForm()} loading={loading}>
                <ThemedText color="background" size="lg" weight="semibold">
                  {t('auth.signIn.submitButton')}
                </ThemedText>
              </Button>

              {isAppleAvailable && (
                <Button variant="outline" onPress={handleAppleSignIn} loading={appleLoading}>
                  <ThemedText color="textPrimary" size="lg" weight="semibold">
                    {t('auth.signIn.appleButton')}
                  </ThemedText>
                </Button>
              )}

              {isGoogleAvailable && (
                <Button variant="outline" onPress={handleGoogleSignIn} loading={googleLoading}>
                  <ThemedText color="textPrimary" size="lg" weight="semibold">
                    {t('auth.signIn.googleButton')}
                  </ThemedText>
                </Button>
              )}
            </Box>
          </Box>
          <Touchable
            onPress={() => goToSignUp()}
            accessibilityRole="link"
            accessibilityLabel={t('auth.signIn.signUpLinkA11y')}
            accessibilityHint={t('auth.signIn.signUpLinkHint')}
          >
            <Box mt={6} justifyContent="center" flexDirection="row" alignItems="center">
              <ThemedText color="textSecondary">{t('auth.signIn.noAccount')}</ThemedText>
              <ThemedText weight="semibold" textDecorationLine="underline">
                {t('auth.signIn.signUpLink')}
              </ThemedText>
            </Box>
          </Touchable>

          <Box justifyContent="center" flexDirection="row" alignItems="center">
            <ThemedText variant="mono" color="textSecondary">
              {t('auth.signIn.termsPrefix')}
            </ThemedText>
          </Box>

          <Box justifyContent="center" flexDirection="row" alignItems="center">
            <ThemedText variant="mono" color="textSecondary">
              {t('auth.signIn.termsConnector')}
            </ThemedText>

            <Touchable
              onPress={() => navigation.navigate('TermsScreen')}
              accessibilityRole="link"
              accessibilityLabel={t('auth.terms.linkA11y')}
            >
              <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
                {t('auth.terms.linkText')}
              </ThemedText>
            </Touchable>

            <ThemedText variant="mono" color="textSecondary">
              {t('auth.signIn.termsAndConnector')}
            </ThemedText>

            <Touchable
              onPress={() => navigation.navigate('PrivacyScreen')}
              accessibilityRole="link"
              accessibilityLabel={t('auth.privacy.linkA11y')}
            >
              <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
                {t('auth.privacy.linkText')}
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
              accessibilityLabel={t('auth.signIn.backButtonA11y')}
              accessibilityHint={t('auth.signIn.backButtonHint')}
            >
              <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
            </Touchable>
            <ThemedText variant="title">{t('auth.signIn.verifyEmailTitle')}</ThemedText>
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
