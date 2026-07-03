import { Platform } from 'react-native'
import { FullWindowOverlay } from 'react-native-screens'

import { PortalHost } from '@gorhom/portal'

import { PlatformOS } from '@src/shared/constants/platform'

export function ToastPortalHost() {
  if (Platform.OS === PlatformOS.IOS) {
    return (
      <FullWindowOverlay>
        <PortalHost name="toast" />
      </FullWindowOverlay>
    )
  }

  return <PortalHost name="toast" />
}
