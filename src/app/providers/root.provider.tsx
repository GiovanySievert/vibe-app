import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { I18nextProvider } from 'react-i18next'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { PortalProvider } from '@gorhom/portal'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@src/services/api/query-client'
import { Toast } from '@src/shared/components/toast/toast.component'
import { ToastPortalHost } from '@src/shared/components/toast/toast-portal-host.component'
import { i18n, I18nGate } from '@src/shared/i18n'

import { linking } from '../navigation/linking'
import { AppProvider } from './app.provider'
import { ToastProvider } from './toast.provider'

type RootProviderProps = {
  children: React.ReactNode
}

export const RootProvider: React.FC<RootProviderProps> = ({ children }) => (
  <SafeAreaProvider>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <I18nGate>
          <PortalProvider>
            <ToastProvider>
              <NavigationContainer linking={linking}>
                <Toast />
                <AppProvider>{children}</AppProvider>
              </NavigationContainer>
            </ToastProvider>
            <ToastPortalHost />
          </PortalProvider>
        </I18nGate>
      </I18nextProvider>
    </QueryClientProvider>
  </SafeAreaProvider>
)
