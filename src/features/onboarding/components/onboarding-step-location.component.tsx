import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import * as Location from 'expo-location'
import { useSetAtom } from 'jotai'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { locationStateAtom } from '@src/shared/state/location.state'

type OnboardingStepLocationProps = {
  onNext: () => void
}

export const OnboardingStepLocation: React.FC<OnboardingStepLocationProps> = ({ onNext }) => {
  const { t } = useAppTranslation()
  const [loading, setLoading] = useState(false)
  const setLocation = useSetAtom(locationStateAtom)

  const handleRequestLocation = async () => {
    setLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High
        })
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          neighborhood: null
        })
      }
    } catch {
      //
    } finally {
      setLoading(false)
      onNext()
    }
  }

  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6} alignItems="center" pt={4}>
        <Box style={styles.iconWrapper} alignItems="center" justifyContent="center">
          <ThemedIcon name="MapPin" size={36} color="primary" />
        </Box>

        <Box gap={2} alignItems="center">
          <ThemedText size="xl" weight="bold" style={styles.textCenter}>
            {t('onboarding.location.title')}
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.textCenter}>
            {t('onboarding.location.description')}
          </ThemedText>
        </Box>

        <Box style={styles.infoBox} gap={3}>
          {LOCATION_INFO_ITEMS.map((locationInfo) => (
            <Box key={locationInfo.key} flexDirection="row" gap={3} alignItems="center">
              <ThemedIcon name={locationInfo.icon} size={16} color="primary" />
              <ThemedText size="sm" color="textSecondary">
                {t(locationInfo.key)}
              </ThemedText>
            </Box>
          ))}
        </Box>
      </Box>

      <Box gap={3} pt={6}>
        <Button onPress={handleRequestLocation} disabled={loading}>
          <ThemedText color="background" weight="semibold">
            {loading ? t('onboarding.location.waiting') : t('onboarding.location.allowBtn')}
          </ThemedText>
        </Button>
        <Button variant="ghost" onPress={onNext}>
          <ThemedText color="textSecondary" weight="semibold">
            {t('onboarding.location.skipBtn')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const LOCATION_INFO_ITEMS = [
  { icon: 'Shield' as const, key: 'onboarding.location.info1' },
  { icon: 'EyeOff' as const, key: 'onboarding.location.info2' },
  { icon: 'Settings' as const, key: 'onboarding.location.info3' }
]

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryGlow
  },
  textCenter: {
    textAlign: 'center'
  },
  infoBox: {
    width: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border
  }
})
