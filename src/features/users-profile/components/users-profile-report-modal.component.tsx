import React, { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { useToast } from '@src/app/providers/toast.provider'
import { Box, Button, Input, SwipeableModal, ThemedText } from '@src/shared/components'
import { RadioButton } from '@src/shared/components/radio-button/radio-button.component'
import { UserModel } from '@src/shared/domain/users.model'
import { useAppTranslation } from '@src/shared/i18n'

import { ReportService } from '../services'
import { ReportReason } from '../types'

type UsersProfileReportModalProps = {
  userData: UserModel
  visible: boolean
  onClose: () => void
}

export const UsersProfileReportModal: React.FC<UsersProfileReportModalProps> = ({ userData, visible, onClose }) => {
  const { t } = useAppTranslation()
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [description, setDescription] = useState('')
  const { showToast } = useToast()

  const reset = () => {
    setSelectedReason(null)
    setDescription('')
  }

  const reportMutation = useMutation({
    mutationFn: () =>
      ReportService.report(userData.id, {
        reason: selectedReason!,
        description: description.trim() || undefined
      }),
    onSuccess: () => {
      reset()
      onClose()
      showToast(t('usersProfile.report.success'))
    },
    onError: (error) => {
      reset()
      onClose()
      if (isAxiosError(error) && error.response?.status === 409) {
        showToast(t('usersProfile.report.alreadyReported'), 'warning')
      } else {
        showToast(t('usersProfile.report.failed'), 'error')
      }
    }
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <SwipeableModal visible={visible} height={700} onClose={handleClose}>
      <Box pt={2} pb={6} pl={6} pr={6}>
        <Box mb={4}>
          <ThemedText size="lg" weight="semibold">
            {t('usersProfile.report.title', { username: userData.username })}
          </ThemedText>
        </Box>

        <Box mb={4}>
          <RadioButton
            options={[
              {
                label: t('usersProfile.report.reasons.spam'),
                value: ReportReason.SPAM
              },
              {
                label: t('usersProfile.report.reasons.inappropriate'),
                value: ReportReason.INAPPROPRIATE_CONTENT
              },
              {
                label: t('usersProfile.report.reasons.harassment'),
                value: ReportReason.HARASSMENT
              },
              {
                label: t('usersProfile.report.reasons.fake'),
                value: ReportReason.FAKE_ACCOUNT
              },
              {
                label: t('usersProfile.report.reasons.other'),
                value: ReportReason.OTHER
              }
            ]}
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
            {t('usersProfile.report.confirm')}
          </ThemedText>
        </Button>
      </Box>
    </SwipeableModal>
  )
}
