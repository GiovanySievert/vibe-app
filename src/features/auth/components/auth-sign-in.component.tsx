import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useSetAtom } from 'jotai'

import { UnathenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Card } from '@src/shared/components/card/card.component'
import { Input } from '@src/shared/components/input'
import { validationMapErrors } from '@src/shared/utils'

import { signInSchema, UserSignInRequestDTO } from '../domain'
import { authStateAtom } from '../state'

type AuthSignInProps = {
  goToSignUp: () => void
  goToVerifyEmail: () => void
  setEmailToBeVerified: (email: string) => void
}

export const AuthSignIn: React.FC<AuthSignInProps> = ({ goToSignUp, goToVerifyEmail, setEmailToBeVerified }) => {
  const setAuthState = useSetAtom(authStateAtom)
  const navigation = useNavigation<NavigationProp<UnathenticatedStackParamList>>()

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
      setEmailToBeVerified(form.login)
      goToVerifyEmail()
      return
    }

    if (error?.status === 401) {
      setFormError({
        login: '',
        password: 'Senha incorreta'
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

  return (
    <>
      <Card pt={6} pb={6} pl={6} pr={6}>
        <Box gap={3} mb={4}>
          <ThemedText variant="primary">Welcome</ThemedText>
          <ThemedText variant="primary">Feel the night</ThemedText>
        </Box>
        <Box gap={6}>
          <Input
            label="E-mail"
            value={form.login}
            onChange={({ nativeEvent }) => handleChangeInputValue('login', nativeEvent.text)}
            errorMessage={formError.login}
          />
          <Input
            label="Password"
            value={form.password}
            onChange={({ nativeEvent }) => handleChangeInputValue('password', nativeEvent.text)}
            errorMessage={formError.password}
          />
          <Button onPress={() => submitForm()} loading={loading}>
            <ThemedText>SignIn</ThemedText>
          </Button>
        </Box>

        <Box mt={3}>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen', { typedEmail: form.login })}>
            <ThemedText>Forgot password?</ThemedText>
          </TouchableOpacity>
        </Box>
      </Card>

      <TouchableOpacity onPress={() => goToSignUp()}>
        <Box mt={6} justifyContent="center" alignItems="center">
          <ThemedText>don't have an account yet? Sign out</ThemedText>
        </Box>
      </TouchableOpacity>
    </>
  )
}
