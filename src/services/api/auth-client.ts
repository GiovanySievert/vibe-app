import { expoClient } from '@better-auth/expo/client'
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import * as SecureStore from 'expo-secure-store'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include'
  },
  plugins: [
    expoClient({
      scheme: 'myapp',
      storagePrefix: 'myapp',
      storage: SecureStore
    }),
    emailOTPClient(),
    inferAdditionalFields({
      user: {
        username: { type: 'string' }
      }
    })
  ]
})
