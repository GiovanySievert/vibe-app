import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { Screen } from '@src/shared/components/screen'
import { validationMapErrors } from '@src/shared/utils'

import { signUpSchema } from '../schemas/sign-up.schema'
import { AuthService } from '../services'
import { UserData } from '../types'

export const SignInScreen = () => {
  const [form, setForm] = useState<UserData>({
    username: '',
    email: '',
    password: ''
  })

  const [formError, setFormError] = useState<UserData>({
    username: '',
    email: '',
    password: ''
  })

  const handleChangeInputValue = (key: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [key]: value
    }))
  }

  const submitForm = async () => {
    const values = {
      username: form.username,
      email: form.email,
      password: form.password
    }

    const result = signUpSchema.safeParse(values)
    if (!result.success) {
      setFormError(validationMapErrors(result.error, formError))
    } else {
      const data: UserData = result.data

      const response = await AuthService.signIn(data)
      return response
    }
  }
  console.log(formError, 'formError123123123123123')
  const { mutate: submitFormMutation, isPending: isLoading } = useMutation({
    mutationFn: async () => submitForm(),
    onSuccess: async () => {
      // console.log('suceesso')
    },
    onError: (error) => {
      // console.log(error)
    }
  })

  return (
    <Screen>
      <Box p={4}>
        <Box mt={3}>
          <ThemedText>SignIn</ThemedText>
        </Box>
        <Box gap={2}>
          <Input
            label="username"
            placeholder="Type here"
            value={form.username}
            onChange={({ nativeEvent }) => handleChangeInputValue('username', nativeEvent.text)}
            errorMessage={formError.username}
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
          <Button title="Signin" loading={isLoading} onPress={() => submitFormMutation()} />
        </Box>
      </Box>
    </Screen>
  )
}
