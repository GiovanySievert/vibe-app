import { UserData } from './user.model'

export type UserSignInRequestDTO = {
  login: string
  password: string
}

export type UserSignInResponseDTO = {
  user: UserSignInResponseBodyDTO
  token: string
}

export type UserSignInResponseBodyDTO = {
  emailVerified: boolean
  email: string
  password: string
  name: string
  username: string
}

export type UserSignUpRequestDTO = {
  username: string
  email: string
  password: string
}

export type UserSignUpResponseDTO = {
  password: string
}

export type SendVerificationEmailForm = {
  otp: string
}

export type SendVerificationEmailCodeRequestDTO = {
  email: string
}

export type CheckVerificationEmailCodeRequestDTO = {
  email: string
  otp: string
}

export type CheckVerificationEmailCodeResponseDTO = {
  status: string
  token: string
  user: UserData
}

export type UserForgotPasswordRequestDTO = {
  email: string
}

export type UserForgotPasswordResponseBodyDTO = {
  password: string
}

export type UserResetPasswordRequestDTO = {
  code: string
  password: string
  email: string
}

export type UserRequestPasswordResponseBodyDTO = {
  password: string
}
