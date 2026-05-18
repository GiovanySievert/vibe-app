import React from 'react'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'
import Animated from 'react-native-reanimated'

export type TouchableProps = TouchableOpacityProps
export type TouchableRef = React.ElementRef<typeof TouchableOpacity>

export const Touchable = React.forwardRef<TouchableRef, TouchableProps>(({ activeOpacity = 0.7, ...props }, ref) => (
  <TouchableOpacity ref={ref} activeOpacity={activeOpacity} {...props} />
))

Touchable.displayName = 'Touchable'

export const AnimatedTouchable = Animated.createAnimatedComponent(Touchable as React.ComponentType<TouchableProps>)
