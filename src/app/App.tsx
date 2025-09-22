import 'react-native-gesture-handler'

import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { MainAppNavigator } from './navigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MainAppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
