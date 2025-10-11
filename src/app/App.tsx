import 'react-native-gesture-handler'

import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toast } from '@src/shared/components/toast/toast.component'

import { MainAppNavigator } from './navigation'
import { AppProvider, ToastProvider } from './providers'

const queryClient = new QueryClient()

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NavigationContainer>
            <Toast />
            <AppProvider>
              <MainAppNavigator />
            </AppProvider>
          </NavigationContainer>
        </ToastProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
