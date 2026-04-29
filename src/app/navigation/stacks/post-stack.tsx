import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PostFeatures } from '@src/features'

import { PostStackParamList } from '../types'

const PostStack = createNativeStackNavigator<PostStackParamList>()

export function PostStackNavigator() {
  return (
    <PostStack.Navigator screenOptions={{ headerShown: false }}>
      <PostStack.Screen name="PostMain" component={PostFeatures.PostScreen} />
    </PostStack.Navigator>
  )
}
