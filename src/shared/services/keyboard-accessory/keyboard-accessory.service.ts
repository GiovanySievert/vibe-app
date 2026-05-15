import { requireOptionalNativeModule } from 'expo-modules-core'

type VibesKeyboardAccessoryModule = {
  setEnabled: (enabled: boolean) => void | Promise<void>
}

const nativeModule = requireOptionalNativeModule<VibesKeyboardAccessoryModule>('VibesKeyboardAccessory')

export const KeyboardAccessoryService = {
  setEnabled(enabled: boolean) {
    nativeModule?.setEnabled(enabled)
  }
}
