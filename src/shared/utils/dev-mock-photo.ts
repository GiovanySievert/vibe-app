import { Asset } from 'expo-asset'
import * as Device from 'expo-device'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockPhotoModule = require('../../../assets/dev/mock-place-photo.png')

export const isSimulatorDev = (): boolean => {
  return __DEV__ && Device.isDevice === false
}

export const getDevMockPhotoUriIfSimulator = async (): Promise<string | null> => {
  if (!isSimulatorDev()) return null
  const asset = await Asset.fromModule(mockPhotoModule).downloadAsync()
  return asset.localUri
}
