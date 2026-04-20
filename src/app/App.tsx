import 'react-native-gesture-handler'

import React from 'react'
import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toast } from '@src/shared/components/toast/toast.component'

import { MainAppNavigator } from './navigation'
import { AppNavigatorRootParamsList } from './navigation/types'
import { AppProvider } from './providers'
import { ToastProvider } from './providers/toast.provider'

const queryClient = new QueryClient()

const linking: LinkingOptions<AppNavigatorRootParamsList> = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      TabsNavigator: {
        screens: {
          SharedEventScreen: 'events/share/:token'
        }
      }
    }
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NavigationContainer linking={linking}>
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
