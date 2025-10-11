import { atom } from 'jotai'

import { UserAuthenticated } from '../domain'

const initialAuthState: UserAuthenticated = {
  isAuthenticated: false,
  user: {
    id: '',
    createdAt: new Date(0),
    updatedAt: new Date(0),
    email: '',
    emailVerified: false,
    name: '',
    image: null
  },
  session: {
    id: '',
    createdAt: null,
    updatedAt: null,
    userId: '',
    expiresAt: null,
    token: '',
    ipAddress: '',
    userAgent: ''
  }
}

export const authStateAtom = atom<UserAuthenticated>(initialAuthState)
