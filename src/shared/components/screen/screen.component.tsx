import React, { forwardRef } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewProps
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { theme } from '@src/shared/constants/theme'

export type BaseScreenProps = {
  backgroundColor?: string
  children: React.ReactNode
  asView?: boolean
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
} & ScrollViewProps

const ScreenComponent = (
  { children, asView, onScroll, contentContainerStyle, style, ...props }: BaseScreenProps,
  ref: React.Ref<ScrollView | View>
) => {
  if (asView) {
    return (
      <View ref={ref} style={[styles.flex, style as ViewProps['style']]}>
        {children}
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.flex]}>
      <ScrollView
        ref={ref as React.Ref<ScrollView>}
        style={[styles.flex]}
        contentContainerStyle={contentContainerStyle}
        scrollEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

export const Screen = forwardRef<ScrollView | View, BaseScreenProps>(ScreenComponent)

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})
