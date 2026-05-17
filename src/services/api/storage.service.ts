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
    const startedAt = Date.now()
    console.log('📤 [UPLOAD]', 'PUT', uploadUrl)

    try {
      const localResponse = await fetch(localUri)
      if (!localResponse.ok) {
        throw new Error(`local image read failed with status ${localResponse.status}`)
      }

      const blob = await localResponse.blob()
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: blob
      })

      const duration = Date.now() - startedAt
      console.log('📥 [UPLOAD]', uploadResponse.status, uploadUrl, `\n⏱ ${duration}ms`)

      if (!uploadResponse.ok) {
        const body = await uploadResponse.text()
        throw new Error(`storage upload failed with status ${uploadResponse.status}: ${body}`)
      }
    } catch (error) {
      const duration = Date.now() - startedAt
      console.log('❌ [UPLOAD]', uploadUrl, `\n⏱ ${duration}ms`, '\nMessage:', error)
      throw error
    }
  },

  uploadImage: async (localUri: string, folder: UploadFolder, contentType: ImageContentType = 'image/jpeg') => {
    const { data } = await StorageService.getUploadUrl(contentType, folder)
    await StorageService.uploadToStorage(localUri, data.uploadUrl, contentType)
    return data.publicUrl
  }
}
