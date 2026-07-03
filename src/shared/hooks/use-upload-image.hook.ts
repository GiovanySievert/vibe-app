import { useRef, useState } from 'react'
import { Image } from 'react-native'

import * as ImageManipulator from 'expo-image-manipulator'

import { StorageService } from '@src/services/api/storage.service'

type UploadFolder = 'reviews' | 'avatars' | 'uploads'
type VariantKind = 'avatar' | 'review'

type UploadedImageVariants = {
  fullUrl: string
  thumbnailUrl: string
}

const IMAGE_VARIANTS: Record<VariantKind, { full: number; thumbnail: number }> = {
  avatar: { full: 1024, thumbnail: 192 },
  review: { full: 1280, thumbnail: 480 }
}

const getImageSize = (uri: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject)
  })

const resizeImage = async (uri: string, maxSize: number, compress: number) => {
  const { width, height } = await getImageSize(uri)
  const ratio = Math.min(1, maxSize / Math.max(width, height))
  const nextWidth = Math.round(width * ratio)
  const nextHeight = Math.round(height * ratio)

  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: nextWidth, height: nextHeight } }],
    { compress, format: ImageManipulator.SaveFormat.JPEG }
  )

  return result.uri
}

export function useUploadImage() {
  const [uploading, setUploading] = useState(false)
  const activeUploads = useRef(0)

  const startUpload = () => {
    activeUploads.current += 1
    setUploading(true)
  }

  const finishUpload = () => {
    activeUploads.current = Math.max(0, activeUploads.current - 1)
    setUploading(activeUploads.current > 0)
  }

  const uploadFile = async (localUri: string, folder: UploadFolder): Promise<string> => {
    return await StorageService.uploadImage(localUri, folder)
  }

  const upload = async (localUri: string, folder: UploadFolder): Promise<string> => {
    startUpload()
    try {
      return await uploadFile(localUri, folder)
    } finally {
      finishUpload()
    }
  }

  const uploadVariants = async (
    localUri: string,
    folder: UploadFolder,
    variantKind: VariantKind
  ): Promise<UploadedImageVariants> => {
    startUpload()
    try {
      const variant = IMAGE_VARIANTS[variantKind]
      const [fullUri, thumbnailUri] = await Promise.all([
        resizeImage(localUri, variant.full, 0.82),
        resizeImage(localUri, variant.thumbnail, 0.7)
      ])
      const [fullUrl, thumbnailUrl] = await Promise.all([
        uploadFile(fullUri, folder),
        uploadFile(thumbnailUri, folder)
      ])
      return { fullUrl, thumbnailUrl }
    } finally {
      finishUpload()
    }
  }

  return { upload, uploadVariants, uploading }
}
