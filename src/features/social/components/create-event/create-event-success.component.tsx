import React from 'react'
import { Share, StyleSheet } from 'react-native'

import { Box, Button, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type CreateEventSuccessProps = {
  eventName: string
  eventLink: string
  onClose: () => void
}

export const CreateEventSuccess: React.FC<CreateEventSuccessProps> = ({ eventName, eventLink, onClose }) => {
  const { t } = useAppTranslation()
  const handleShare = async () => {
    await Share.share({
      message: t('social.createEvent.shareMessage', { eventName, eventLink }),
      url: eventLink
    })
  }

  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6} alignItems="center" pt={4}>
        <Box style={styles.iconWrapper} alignItems="center" justifyContent="center">
          <ThemedIcon name="PartyPopper" size={36} color="primary" />
        </Box>

        <Box gap={2} alignItems="center">
          <ThemedText size="xl" weight="bold" style={styles.textCenter}>
            {t('social.createEvent.successTitle')}
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.textCenter}>
            {t('social.createEvent.successDesc')}
          </ThemedText>
        </Box>

        <Box style={styles.linkBox} gap={3}>
          <ThemedText size="sm" color="textSecondary" weight="semibold">
            {t('social.createEvent.linkLabel')}
          </ThemedText>
          <Box flexDirection="row" alignItems="center" gap={3} style={styles.linkRow}>
            <ThemedText
              color={eventLink ? 'primary' : 'textSecondary'}
              size="sm"
              style={styles.linkText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {eventLink || t('social.createEvent.generatingLink')}
            </ThemedText>
            {eventLink ? (
              <Touchable onPress={handleShare} hitSlop={styles.copyHitSlop}>
                <ThemedIcon name="Share2" size={18} color="primary" />
              </Touchable>
            ) : null}
          </Box>
        </Box>
      </Box>

      <Box gap={3} pb={4}>
        <Button onPress={handleShare} startIconName="Share2" disabled={!eventLink}>
          <ThemedText color="background" weight="semibold">
            {t('social.createEvent.shareBtn')}
          </ThemedText>
        </Button>
        <Button variant="ghost" onPress={onClose}>
          <ThemedText color="primary" weight="semibold">
            {t('social.createEvent.closeBtn')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryGlow
  },
  textCenter: {
    textAlign: 'center'
  },
  linkBox: {
    width: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  linkRow: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    padding: 10
  },
  linkText: {
    flex: 1
  },
  copyHitSlop: {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8
  }
})
