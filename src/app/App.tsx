import 'react-native-gesture-handler'

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Toast } from '@src/shared/components/toast/toast.component'
import { i18n } from '@src/shared/i18n'

import { MainAppNavigator } from './navigation'
import { linking } from './navigation/linking'
import { AppProvider } from './providers'
import { ToastProvider } from './providers/toast.provider'

const queryClient = new QueryClient()

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ToastProvider>
            <NavigationContainer linking={linking}>
              <Toast />
              <AppProvider>
                <MainAppNavigator />
              </AppProvider>
            </NavigationContainer>
          </ToastProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
