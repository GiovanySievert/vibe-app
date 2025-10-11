export interface HttpError extends Error {
  response?: {
    status: number
    data: HttpErrorData
  }
}

type HttpErrorData = {
  name: string
  message: string
}
