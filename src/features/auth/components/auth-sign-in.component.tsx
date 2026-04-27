import React, { useState } from 'react'
import { Dimensions, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useSetAtom } from 'jotai'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { validationMapErrors } from '@src/shared/utils'

import { signInSchema, UserSignInRequestDTO } from '../domain'
import { authStateAtom } from '../state'
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
  const setAuthState = useSetAtom(authStateAtom)
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()

  const animatedValue = useSharedValue(0)

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
    if (error?.status === 403) {
      goToStep(SIGN_IN_STEPS.VERIFY)
      return
    }

    setFormError({
      login: '',
      password: 'email ou senha inválidos'
    })
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
        setAuthState({
          isAuthenticated: true,
          user: data.user
        })
      }
    } catch (error) {
      console.error('todo -- add loger', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Animated.View style={[{ flexDirection: 'row', overflow: 'hidden' }, animatedStyle]}>
      <Box mt={20} p={6} style={{ width: screenWidth }}>
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
          />
          <Input
            label="senha"
            value={form.password}
            onChange={({ nativeEvent }) => handleChangeInputValue('password', nativeEvent.text)}
            errorMessage={formError.password}
            secureTextEntry
          />

          <Box mt={2} alignItems="flex-end">
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen', { typedEmail: form.login })}>
              <ThemedText size="sm" color="textSecondary" textDecorationLine="underline">
                esqueci a senha
              </ThemedText>
            </TouchableOpacity>
          </Box>
          <Box gap={3}>
            <Button onPress={() => submitForm()} loading={loading}>
              <ThemedText color="background" size="lg" weight="semibold">
                entrar
              </ThemedText>
            </Button>

            <Button variant="outline" onPress={() => submitForm()} loading={loading}>
              <ThemedText color="textPrimary" size="lg" weight="semibold">
                entrar com apple
              </ThemedText>
            </Button>
          </Box>
        </Box>
        <TouchableOpacity onPress={() => goToSignUp()}>
          <Box mt={6} justifyContent="center" flexDirection="row" alignItems="center">
            <ThemedText color="textSecondary">primeira vez? </ThemedText>
            <ThemedText weight="semibold" textDecorationLine="underline">
              criar conta
            </ThemedText>
          </Box>
        </TouchableOpacity>

        <Box justifyContent="center" flexDirection="row" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            ao continuar voce aceita
          </ThemedText>
        </Box>

        <Box justifyContent="center" flexDirection="row" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            os{' '}
          </ThemedText>

          <TouchableOpacity onPress={() => navigation.navigate('TermsScreen')}>
            <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
              termos
            </ThemedText>
          </TouchableOpacity>

          <ThemedText variant="mono" color="textSecondary">
            {' '}
            e a{' '}
          </ThemedText>

          <TouchableOpacity onPress={() => navigation.navigate('PrivacyScreen')}>
            <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
              privacidade
            </ThemedText>
          </TouchableOpacity>
        </Box>
      </Box>

      <Box p={6} style={{ width: screenWidth }}>
        <AuthVerifyEmail emailToBeVerified={form.login} />
      </Box>
    </Animated.View>
  )
}
