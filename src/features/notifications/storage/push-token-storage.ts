import * as SecureStore from 'expo-secure-store'

enum PUSH_NOTIFICATION_STORAGE_KEYS {
  TOKEN = 'vibe_app_push_token',
  INSTALLATION_ID = 'vibe_app_push_installation_id'
}

export async function getStoredPushToken() {
  return await SecureStore.getItemAsync(PUSH_NOTIFICATION_STORAGE_KEYS.TOKEN)
}

export async function savePushToken(token: string) {
  await SecureStore.setItemAsync(PUSH_NOTIFICATION_STORAGE_KEYS.TOKEN, token)
}

export async function removeStoredPushToken() {
  await SecureStore.deleteItemAsync(PUSH_NOTIFICATION_STORAGE_KEYS.TOKEN)
}

export async function getPushInstallationId() {
  const storedInstallationId = await SecureStore.getItemAsync(PUSH_NOTIFICATION_STORAGE_KEYS.INSTALLATION_ID)

  if (storedInstallationId) {
    return storedInstallationId
  }

  const installationId = `push-installation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  await SecureStore.setItemAsync(PUSH_NOTIFICATION_STORAGE_KEYS.INSTALLATION_ID, installationId)

  return installationId
}
