import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useSetAtom } from 'jotai'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { validationMapErrors } from '@src/shared/utils'

import { signInSchema, UserSignInRequestDTO } from '../domain'
import { authStateAtom } from '../state'
import { AuthVerifyEmail } from './auth-verify-email.component'

type AuthSignInProps = {
  goToSignUp: () => void
}

export const AuthSignIn: React.FC<AuthSignInProps> = ({ goToSignUp }) => {
  const setAuthState = useSetAtom(authStateAtom)
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()

  const [mode, setMode] = useState<'form' | 'verify'>('form')
  const [form, setForm] = useState<UserSignInRequestDTO>({
    login: '',
    password: ''
  })

  const [formError, setFormError] = useState<UserSignInRequestDTO>({
    login: '',
    password: ''
  })
  const [loading, setLoading] = useState<boolean>(false)

  const handleChangeInputValue = (key: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const validateSignInSchema = (): boolean => {
    const values = {
      login: form.login,
      password: form.password
    }

    const result = signInSchema.safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      return false
    }

    return true
  }

  const handleErrorsInSignIn = (error: any) => {
    if (error?.status === 403) {
      setMode('verify')
      return
    }

    if (error?.status === 401) {
      setFormError({
        login: '',
        password: 'Senha incorreta'
      })
      return
    }

    if (error?.status === 400) {
      setFormError({
        login: 'Email incorreto ou não existente',
        password: 'Senha incorreta ou não existente'
      })
      return
    }
  }

  const submitForm = async () => {
    setLoading(true)
    try {
      if (!validateSignInSchema()) {
        return
      }
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

  if (mode === 'verify') {
    return (
      <Box flex={1}>
        <Box pb={4} flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={() => setMode('form')} style={styles.goBackButton}>
            <ThemedIcon name="ArrowLeft" color="textPrimary" size={18} />
          </TouchableOpacity>
        </Box>
        <AuthVerifyEmail emailToBeVerified={form.login} />
      </Box>
    )
  }

  return (
    <>
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
        <Box justifyContent="center" flexDirection="row" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            ao continuar voce aceita
          </ThemedText>
        </Box>

        <Box justifyContent="center" flexDirection="row" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            os{' '}
          </ThemedText>

          <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
            termos
          </ThemedText>
          <ThemedText variant="mono" color="textSecondary">
            {' '}
            e a{' '}
          </ThemedText>
          <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
            privacidade
          </ThemedText>
        </Box>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  goBackButton: {
    borderWidth: 1,
    borderRadius: 999,
    borderColor: theme.colors.textTertiary,
    padding: 6
  }
})
