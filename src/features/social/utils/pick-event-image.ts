import * as ImagePicker from 'expo-image-picker'

export const pickEventImageFromLibrary = async (): Promise<string | null> => {
  await ImagePicker.requestMediaLibraryPermissionsAsync()

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8
  })

  if (result.canceled || !result.assets[0]) {
    return null
  }

  return result.assets[0].uri
}
