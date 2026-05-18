import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { Box, Button, Input, SwipeableModal, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'

import { ContactService } from '../service'

type UserMenuContactModalProps = {
  visible: boolean
  onClose: () => void
}

export const UserMenuContactModal: React.FC<UserMenuContactModalProps> = ({ visible, onClose }) => {
  const [message, setMessage] = useState('')
  const { t } = useAppTranslation()

  const contactMutation = useMutation({
    mutationFn: () => ContactService.send({ message: message.trim() }),
    onSuccess: () => {
      setMessage('')
      onClose()
    }
  })

  const handleClose = () => {
    setMessage('')
    onClose()
  }

  return (
    <SwipeableModal visible={visible} height={700} onClose={handleClose}>
      <Box pt={2} pb={6} pl={6} pr={6}>
        <Box mb={2}>
          <ThemedText size="lg" weight="semibold">
            {t('userMenu.contact.title')}
          </ThemedText>
        </Box>

        <Box mb={4}>
          <ThemedText size="sm" color="textSecondary">
            {t('userMenu.contact.description')}
          </ThemedText>
        </Box>

        <Box mb={6}>
          <Input
            value={message}
            onChangeText={setMessage}
            multiline
            multilineHeight={140}
            maxLength={1000}
            autoCapitalize="sentences"
            autoCorrect
            autoFocus
          />
        </Box>

        <Button loading={contactMutation.isPending} onPress={() => contactMutation.mutate()}>
          <ThemedText color="background" size="lg" weight="semibold">
            {t('userMenu.contact.sendButton')}
          </ThemedText>
        </Button>
      </Box>
    </SwipeableModal>
  )
}
