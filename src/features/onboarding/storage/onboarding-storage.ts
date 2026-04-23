import * as SecureStore from 'expo-secure-store'

const ONBOARDING_COMPLETE_KEY = 'onboarding_complete'

export async function getOnboardingComplete(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(ONBOARDING_COMPLETE_KEY)
  return value === 'true'
}

export async function setOnboardingComplete(): Promise<void> {
  await SecureStore.setItemAsync(ONBOARDING_COMPLETE_KEY, 'true')
}
