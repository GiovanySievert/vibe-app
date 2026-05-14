import React from 'react'
import { StyleSheet } from 'react-native'
import QRCode from 'react-native-qrcode-svg'

import { Box, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal/swipeable-modal.component'
import { theme } from '@src/shared/constants/theme'

type ProfileQrModalProps = {
  visible: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    username: string
    image?: string | null
  }
}

export const ProfileQrModal: React.FC<ProfileQrModalProps> = ({ visible, onClose, user }) => {
  const profileUrl = `vibes://social/profile/${user.id}`
  const imageUri = user.image && user.image.length > 0 ? user.image : null

  return (
    <SwipeableModal visible={visible} onClose={onClose}>
      <Box p={6} alignItems="center" gap={10}>
        <Box style={styles.qrWrapper} p={4} mt={6}>
          <QRCode
            value={profileUrl}
            size={240}
            ecl="H"
            color={theme.colors.background}
            backgroundColor={theme.colors.textPrimary}
            logo={imageUri ? { uri: imageUri } : undefined}
            logoSize={80}
            logoMargin={4}
            logoBackgroundColor={theme.colors.textPrimary}
            logoBorderRadius={40}
            quietZone={8}
          />
        </Box>

        <Box alignItems="center" gap={1}>
          <ThemedText variant="mono" size="lg" letterSpacing="wider" color="textSecondary">
            @{user.username}
          </ThemedText>
        </Box>
      </Box>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  qrWrapper: {
    backgroundColor: theme.colors.textPrimary,
    borderRadius: 20
  }
})
