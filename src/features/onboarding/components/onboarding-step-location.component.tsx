import React, { useState } from 'react'
import { StyleSheet } from 'react-native'

import * as Location from 'expo-location'
import { useSetAtom } from 'jotai'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { locationStateAtom } from '@src/shared/state/location.state'

type OnboardingStepLocationProps = {
  onNext: () => void
}

export const OnboardingStepLocation: React.FC<OnboardingStepLocationProps> = ({ onNext }) => {
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
          longitude: loc.coords.longitude
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
            Precisamos da sua localização
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.textCenter}>
            Para mostrar os lugares e vibes perto de você, o app precisa saber onde você está. Seus dados não são
            compartilhados com ninguém.
          </ThemedText>
        </Box>

        <Box style={styles.infoBox} gap={3}>
          {LOCATION_INFO_ITEMS.map((locationInfo) => (
            <Box key={locationInfo.text} flexDirection="row" gap={3} alignItems="center">
              <ThemedIcon name={locationInfo.icon} size={16} color="primary" />
              <ThemedText size="sm" color="textSecondary">
                {locationInfo.text}
              </ThemedText>
            </Box>
          ))}
        </Box>
      </Box>

      <Box gap={3} pt={6}>
        <Button onPress={handleRequestLocation} disabled={loading}>
          <ThemedText color="background" weight="semibold">
            {loading ? 'Aguardando...' : 'Liberar localização'}
          </ThemedText>
        </Button>
        <Button variant="ghost" onPress={onNext}>
          <ThemedText color="textSecondary" weight="semibold">
            Agora não
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const LOCATION_INFO_ITEMS = [
  { icon: 'Shield' as const, text: 'Usada apenas para encontrar lugares próximos' },
  { icon: 'EyeOff' as const, text: 'Não compartilhamos sua localização com terceiros' },
  { icon: 'Settings' as const, text: 'Você pode alterar isso a qualquer momento nas configurações' }
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
