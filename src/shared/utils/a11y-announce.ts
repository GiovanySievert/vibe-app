import { AccessibilityInfo, findNodeHandle } from 'react-native'

export const announce = (message: string) => {
  if (!message) return
  AccessibilityInfo.announceForAccessibility(message)
}

export const focusOn = (ref: React.RefObject<unknown> | null) => {
  if (!ref?.current) return
  const node = findNodeHandle(ref.current as Parameters<typeof findNodeHandle>[0])
  if (node) AccessibilityInfo.setAccessibilityFocus(node)
}

export const isScreenReaderEnabled = async (): Promise<boolean> => {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled()
  } catch {
    return false
  }
}
