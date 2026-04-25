import React from 'react'
import { StyleSheet } from 'react-native'

import { AnimatedBox, Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { getPasswordStrength } from '@src/shared/utils'

import { SignUpEmailForm } from '../domain'

type AuthEmailStepProps = {
  form: SignUpEmailForm
  formError: SignUpEmailForm
  onChangeForm: (key: keyof SignUpEmailForm, value: string) => void
  onContinue: () => void
  isLoading?: boolean
}

export const AuthEmailStep: React.FC<AuthEmailStepProps> = ({
  form,
  formError,
  onChangeForm,
  onContinue,
  isLoading
}) => {
  const strength = getPasswordStrength(form.password)

  return (
    <Box gap={6}>
      <Box gap={1} mb={6}>
        <ThemedText variant="title">criar conta</ThemedText>
        <ThemedText variant="secondary">precisa só do básico pra começar.</ThemedText>
      </Box>

      <Box gap={6}>
        <Box gap={2}>
          <Input
            label="email"
            value={form.email}
            onChange={({ nativeEvent }) => onChangeForm('email', nativeEvent.text)}
            errorMessage={formError.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AnimatedBox isVisible={form.email.length > 10}>
            <ThemedText variant="mono" size="sm" color="textSecondary">
              iremos validar seu email, confirme se está correto.
            </ThemedText>
          </AnimatedBox>
        </Box>

        <Box gap={3}>
          <Input
            label="senha"
            value={form.password}
            onChange={({ nativeEvent }) => onChangeForm('password', nativeEvent.text)}
            errorMessage={formError.password}
            secureTextEntry
          />

          <ThemedText variant="mono" size="sm" color="textSecondary">
            mínimo 8 caracteres · uma letra maiscula e um número
          </ThemedText>
          <Box flexDirection="row" gap={1}>
            {[0, 1, 2, 3].map((i) => (
              <Box key={i} flex={1} style={[styles.strengthBar, i < strength && styles.strengthBarActive]} />
            ))}
          </Box>
        </Box>
      </Box>

      <Box mt={4} gap={4}>
        <Button loading={isLoading} onPress={onContinue}>
          <ThemedText color="background" size="lg" weight="semibold">
            continuar
          </ThemedText>
        </Button>

        <Box justifyContent="center" flexDirection="row" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            ao continuar você aceita os{' '}
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
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  strengthBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border
  },
  strengthBarActive: {
    backgroundColor: theme.colors.primary
  }
})
