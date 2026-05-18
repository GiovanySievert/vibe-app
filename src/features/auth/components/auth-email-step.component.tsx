import React, { useEffect, useRef } from 'react'
import { TextInput } from 'react-native'

import { AnimatedBox, Box, Button, Input, PasswordInput, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'

import { SignUpEmailForm } from '../domain'

type AuthEmailStepProps = {
  form: SignUpEmailForm
  formError: SignUpEmailForm
  onChangeForm: (key: keyof SignUpEmailForm, value: string) => void
  onContinue: () => void
  isLoading?: boolean
  isActive: boolean
}

export const AuthEmailStep: React.FC<AuthEmailStepProps> = ({
  form,
  formError,
  onChangeForm,
  onContinue,
  isLoading,
  isActive
}) => {
  const emailInputRef = useRef<TextInput>(null)
  const { t } = useAppTranslation()

  useEffect(() => {
    if (!isActive) return

    const timeoutId = setTimeout(() => {
      emailInputRef.current?.focus()
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [isActive])

  return (
    <Box gap={6}>
      <Box gap={1} mb={6}>
        <ThemedText variant="title">{t('auth.signUp.title')}</ThemedText>
        <ThemedText variant="secondary">{t('auth.signUp.subtitle')}</ThemedText>
      </Box>

      <Box gap={6}>
        <Box gap={2}>
          <Input
            ref={emailInputRef}
            label={t('auth.signUp.emailLabel')}
            value={form.email}
            onChange={({ nativeEvent }) => onChangeForm('email', nativeEvent.text)}
            errorMessage={formError.email}
            keyboardType="email-address"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <AnimatedBox isVisible={form.email.length > 10}>
            <ThemedText variant="mono" size="sm" color="textSecondary">
              {t('auth.signUp.emailHint')}
            </ThemedText>
          </AnimatedBox>
        </Box>

        <PasswordInput
          value={form.password}
          onChange={(value) => onChangeForm('password', value)}
          errorMessage={formError.password}
          keyboardType="default"
          autoComplete="off"
          textContentType="none"
        />
      </Box>

      <Box mt={4} gap={4}>
        <Button loading={isLoading} onPress={onContinue}>
          <ThemedText color="background" size="lg" weight="semibold">
            {t('common.continue')}
          </ThemedText>
        </Button>

        <Box justifyContent="center" flexDirection="row" alignItems="center" flexWrap="wrap">
          <ThemedText variant="mono" color="textSecondary">
            {t('auth.signUp.termsPrefix')}
          </ThemedText>
          <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
            {t('auth.signUp.termsLink')}
          </ThemedText>
          <ThemedText variant="mono" color="textSecondary">
            {t('auth.signUp.termsConnector')}
          </ThemedText>
          <ThemedText variant="mono" weight="semibold" textDecorationLine="underline">
            {t('auth.signUp.privacyLink')}
          </ThemedText>
        </Box>
      </Box>
    </Box>
  )
}
