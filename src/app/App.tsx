import 'react-native-gesture-handler'

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toast } from '@src/shared/components/toast/toast.component'

import { MainAppNavigator } from './navigation'
import { linking } from './navigation/linking'
import { AppProvider } from './providers'
import { ToastProvider } from './providers/toast.provider'

const queryClient = new QueryClient()

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
