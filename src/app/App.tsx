import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { MainAppNavigator } from './navigation'

const queryClient = new QueryClient()

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MainAppNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
