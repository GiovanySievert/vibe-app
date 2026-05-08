import { useState } from 'react'

import { StorageService } from '@src/services/api/storage.service'

type UploadFolder = 'reviews' | 'avatars' | 'uploads'

export function useUploadImage() {
  const [uploading, setUploading] = useState(false)

  const upload = async (localUri: string, folder: UploadFolder): Promise<string> => {
    setUploading(true)
    try {
      return await StorageService.uploadImage(localUri, folder)
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
