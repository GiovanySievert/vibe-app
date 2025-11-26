import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { Card } from '@src/shared/components/card/card.component'
import { validationMapErrors } from '@src/shared/utils'

import { signUpSchema, UserSignUpRequestDTO } from '../domain'
import { AuthService } from '../services'

type AuthSignUpProps = {
  goToVerifyEmailStep: () => void
  setEmailToBeVerified: (email: string) => void
}

export const AuthSignUp: React.FC<AuthSignUpProps> = ({ goToVerifyEmailStep, setEmailToBeVerified }) => {
  const { showToast } = useToast()
  const [form, setForm] = useState<UserSignUpRequestDTO>({
    username: '',
    email: '',
    password: ''
  })

  const [formError, setFormError] = useState<UserSignUpRequestDTO>({
    username: '',
    email: '',
    password: ''
  })

  const validateIfUsernameIsAvailable = async () => {
    const { data } = await AuthService.checkIfUsernameIsAvailable(form.username)

    if (!data.available) {
      setFormError({
        username: 'Esse username não está disponivel',
        email: '',
        password: ''
      })
      return
    }

    setFormError((prev) => ({
      ...prev,
      username: ''
    }))
  }

  const handleChangeInputValue = (key: string, value: string) => {
    setFormError({
      username: '',
      email: '',
      password: ''
    })
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const validateSignUpSchema = () => {
    const values = {
      username: form.username,
      email: form.email,
      password: form.password
    }

    const result = signUpSchema.safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
      throw Error
    }
  }

  const handleErrorsInSignUp = (error: any) => {
    if (error?.status === 422) {
      showToast('Não foi possível criar a conta')
      throw Error
    }

    showToast('Algo deu errado, tente novamente mais tarde')
    throw Error
  }

  const submitForm = async () => {
    setEmailToBeVerified(form.email)
    validateSignUpSchema()

    const { error } = await authClient.signUp.email({
      email: form.email,
      password: form.password,
      name: form.username,
      username: form.username
    })

    if (error) {
      handleErrorsInSignUp(error)
    }
  }

  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async () => {
      goToVerifyEmailStep()
    },
    onError: (error) => {
      console.error('todo - add logger', error)
    }
  })

  const isSubmitAvailable = () => {
    return formError.email || formError.password || formError.username
  }

  return (
    <Card pt={6} pb={6} pl={6} pr={6}>
      <Box mt={3}>
        <ThemedText>SignUp</ThemedText>
      </Box>
      <Box gap={6}>
        <Input
          label="username"
          placeholder="Type here"
          value={form.username}
          onChange={({ nativeEvent }) => handleChangeInputValue('username', nativeEvent.text)}
          errorMessage={formError.username}
          autoFocus
          onBlur={() => validateIfUsernameIsAvailable()}
        />
        <Input
          label="E-mail"
          placeholder="Type here"
          value={form.email}
          onChange={({ nativeEvent }) => handleChangeInputValue('email', nativeEvent.text)}
          errorMessage={formError.email}
        />
        <Input
          label="Password"
          placeholder="Type here"
          value={form.password}
          onChange={({ nativeEvent }) => handleChangeInputValue('password', nativeEvent.text)}
          errorMessage={formError.password}
        />
        <Button loading={isLoading} disabled={!!isSubmitAvailable()} onPress={() => submitFormMutation()}>
          <ThemedText>SignUp</ThemedText>
        </Button>
      </Box>
    </Card>
  )
}
