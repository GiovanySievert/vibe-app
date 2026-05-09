import { Image } from 'react-native'

import * as Device from 'expo-device'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockPhotoModule = require('../../../assets/dev/mock-place-photo.png')

export const isSimulatorDev = (): boolean => {
  return __DEV__ && Device.isDevice === false
}

export const getDevMockPhotoUriIfSimulator = (): string | null => {
  if (!isSimulatorDev()) return null
  const source = Image.resolveAssetSource(mockPhotoModule)
  return source?.uri ?? null
}
