import * as SecureStore from 'expo-secure-store'

import { UserAuthenticated } from '../domain'

enum VIBE_APP_KEYS_STORAGE {
  TOKEN = 'vibe_app_token',
  USER = 'vibe_app_user'
}

export async function saveUserDataInStorage(user: UserAuthenticated) {
  const oldUser = await SecureStore.getItemAsync(VIBE_APP_KEYS_STORAGE.USER)

  if (oldUser) {
    await SecureStore.deleteItemAsync(VIBE_APP_KEYS_STORAGE.USER)
  }

  await SecureStore.setItemAsync(VIBE_APP_KEYS_STORAGE.USER, JSON.stringify(user))
}

export async function getUserDataFromStorage() {
  const user = await SecureStore.getItemAsync(VIBE_APP_KEYS_STORAGE.USER)
  if (!user) {
    return null
  }
  return JSON.parse(user)
}

export async function saveAuthTokenInStorage(token: string) {
  const oldToken = await SecureStore.getItemAsync(VIBE_APP_KEYS_STORAGE.TOKEN)
  if (oldToken) {
    removeAuthTokenFromStorage()
    removeUserDataFromStorage()
  }

  await SecureStore.setItemAsync(VIBE_APP_KEYS_STORAGE.TOKEN, token)
}

export async function removeAuthTokenFromStorage() {
  await SecureStore.deleteItemAsync(VIBE_APP_KEYS_STORAGE.TOKEN)
}

export async function removeUserDataFromStorage() {
  await SecureStore.deleteItemAsync(VIBE_APP_KEYS_STORAGE.USER)
}

export async function getAuthTokenFromStorage() {
  const token = await SecureStore.getItemAsync(VIBE_APP_KEYS_STORAGE.TOKEN)

  if (!token) {
    return null
  }
  return token
}
