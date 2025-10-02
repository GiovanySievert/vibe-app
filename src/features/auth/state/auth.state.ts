import { atom } from 'jotai'

import { UserAuthenticated } from '../types'

export const authStateAtom = atom<UserAuthenticated>({
  isAuthenticated: false,
  user: {
    id: '',
    email: '',
    password: ''
  }
})
