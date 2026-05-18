import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import * as ImagePicker from 'expo-image-picker'

import { Avatar, Box, ThemedIcon, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

type EditableAvatarProps = {
  currentUri?: string | null
  onAvatarChange: (localUri: string | null) => void
}

export const EditableAvatar = ({ currentUri, onAvatarChange }: EditableAvatarProps) => {
  const [localUri, setLocalUri] = useState<string | null>(null)

  const pickAvatar = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync()
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    })
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri
      setLocalUri(uri)
      onAvatarChange(uri)
    }
  }

  return (
    <Touchable onPress={pickAvatar} style={styles.container}>
      <Avatar uri={localUri ?? currentUri} size="lg" />
      <Box style={styles.editIcon}>
        <ThemedIcon name="Pen" size={16} color="textPrimary" />
      </Box>
    </Touchable>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 6
  }
})
