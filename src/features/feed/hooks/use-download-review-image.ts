import { useCallback } from 'react'

import { File, Paths } from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'

import { useToast } from '@src/app/providers/toast.provider'
import { useAppTranslation } from '@src/shared/i18n'

export const useDownloadReviewImage = () => {
  const { t } = useAppTranslation()
  const { showToast } = useToast()

  const downloadImage = useCallback(
    async (url: string | null) => {
      if (!url) {
        showToast(t('feed.menu.downloadNoImage'), 'error')
        return
      }

      const permission = await MediaLibrary.requestPermissionsAsync(true)
      if (!permission.granted) {
        showToast(t('feed.menu.downloadNoPermission'), 'error')
        return
      }

      try {
        const destination = new File(Paths.cache, `review-${Date.now()}.jpg`)
        const downloaded = await File.downloadFileAsync(url, destination)
        await MediaLibrary.saveToLibraryAsync(downloaded.uri)
        showToast(t('feed.menu.downloadSuccess'), 'success')
      } catch {
        showToast(t('feed.menu.downloadFailed'), 'error')
      }
    },
    [showToast, t]
  )

  return { downloadImage }
}
