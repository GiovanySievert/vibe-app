import { Platform } from 'react-native'

import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'

import {
  getPushInstallationId,
  getStoredPushToken,
  removeStoredPushToken,
  savePushToken
} from '../storage/push-token-storage'
import { NotificationDeviceService } from './notification-device.service'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
})

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX
    })
  }

  if (!Device.isDevice) {
    console.log('Push notifications require a physical device')
    return null
  }

  const currentStoredToken = await getStoredPushToken()
  const { status: existingStatus } = await Notifications.getPermissionsAsync()

  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const permission = await Notifications.requestPermissionsAsync()
    finalStatus = permission.status
  }

  if (finalStatus !== 'granted') {
    if (currentStoredToken) {
      try {
        await NotificationDeviceService.unregister(currentStoredToken)
      } catch (error) {
        console.warn('Failed to unregister push token after permission denial', error)
      }
    }

    await removeStoredPushToken()
    return null
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId

  if (!projectId) {
    console.warn('Expo projectId not found. Push token registration skipped.')
    return null
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId
    })
  ).data

  await NotificationDeviceService.register({
    token,
    platform: Platform.OS,
    deviceId: await getPushInstallationId(),
    appBuild: Constants.expoConfig?.version,
    permissionStatus: finalStatus
  })

  await savePushToken(token)

  return token
}

export async function unregisterPushNotificationsAsync() {
  const token = await getStoredPushToken()

  if (!token) {
    return
  }

  try {
    await NotificationDeviceService.unregister(token)
  } finally {
    await removeStoredPushToken()
  }
}

export async function getInitialNotificationUrlAsync() {
  const response = await Notifications.getLastNotificationResponseAsync()
  return getNotificationUrlFromData(response?.notification.request.content.data)
}

export function subscribeToNotificationResponses(listener: (url: string) => void) {
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const url = getNotificationUrlFromData(response.notification.request.content.data)

    if (url) {
      listener(url)
    }
  })

  return () => subscription.remove()
}

function getNotificationUrlFromData(data: unknown) {
  if (!data || typeof data !== 'object' || !('url' in data)) {
    return null
  }

  const url = data.url

  return typeof url === 'string' ? url : null
}
