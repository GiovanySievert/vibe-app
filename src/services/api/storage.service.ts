import { coreApi } from './core-api'

type ImageContentType = 'image/jpeg' | 'image/png' | 'image/webp'
type UploadFolder = 'reviews' | 'avatars' | 'uploads'

interface UploadUrlResponse {
  uploadUrl: string
  publicUrl: string
}

export const StorageService = {
  getUploadUrl: (contentType: ImageContentType, folder: UploadFolder) =>
    coreApi.post<UploadUrlResponse>('/storage/upload-url', { contentType, folder }),

  uploadToStorage: async (localUri: string, uploadUrl: string, contentType: ImageContentType) => {
    const response = await fetch(localUri)
    const blob = await response.blob()

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob
    })
  },

  uploadImage: async (localUri: string, folder: UploadFolder, contentType: ImageContentType = 'image/jpeg') => {
    const { data } = await StorageService.getUploadUrl(contentType, folder)
    await StorageService.uploadToStorage(localUri, data.uploadUrl, contentType)
    return data.publicUrl
  }
}
