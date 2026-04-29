import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'

import { Box, Button, Input, SwipeableModal, ThemedText } from '@src/shared/components'
import { RadioButton } from '@src/shared/components/radio-button/radio-button.component'
import { UserModel } from '@src/shared/domain/users.model'

import { ReportService } from '../services'
import { ReportReason } from '../types'

type UsersProfileReportModalProps = {
  userData: UserModel
  visible: boolean
  onClose: () => void
}

const REPORT_REASON_OPTIONS = [
  { label: 'spam', value: ReportReason.SPAM },
  { label: 'conteúdo inapropriado', value: ReportReason.INAPPROPRIATE_CONTENT },
  { label: 'assédio', value: ReportReason.HARASSMENT },
  { label: 'conta falsa', value: ReportReason.FAKE_ACCOUNT },
  { label: 'outro', value: ReportReason.OTHER }
]

export const UsersProfileReportModal: React.FC<UsersProfileReportModalProps> = ({ userData, visible, onClose }) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [description, setDescription] = useState('')

  const reportMutation = useMutation({
    mutationFn: () =>
      ReportService.report(userData.id, {
        reason: selectedReason!,
        description: description.trim() || undefined
      }),
    onSuccess: () => {
      setSelectedReason(null)
      setDescription('')
      onClose()
    }
  })

  const handleClose = () => {
    setSelectedReason(null)
    setDescription('')
    onClose()
  }

  return (
    <SwipeableModal visible={visible} height={700} onClose={handleClose}>
      <Box pt={2} pb={6} pl={6} pr={6}>
        <Box mb={4}>
          <ThemedText size="lg" weight="semibold">
            denunciar usuário @{userData.username}
          </ThemedText>
        </Box>

        <Box mb={4}>
          <RadioButton
            options={REPORT_REASON_OPTIONS}
            selectedValue={selectedReason ?? ''}
            onValueChange={(value) => setSelectedReason(value as ReportReason)}
          />
        </Box>

        <Box mb={6}>
          <Input
            value={description}
            onChangeText={setDescription}
            multiline
            multilineHeight={80}
            maxLength={300}
            autoCapitalize="sentences"
            autoCorrect
          />
        </Box>

        <Button
          disabled={!selectedReason || reportMutation.isPending}
          loading={reportMutation.isPending}
          onPress={() => reportMutation.mutate()}
        >
          <ThemedText color="background" weight="semibold">
            Confirmar denúncia
          </ThemedText>
        </Button>
      </Box>
    </SwipeableModal>
  )
}
