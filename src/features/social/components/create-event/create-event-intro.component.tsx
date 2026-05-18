import React from 'react'
import { StyleSheet } from 'react-native'

import { Box, Button, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type CreateEventIntroProps = {
  onNext: () => void
}

export const CreateEventIntro: React.FC<CreateEventIntroProps> = ({ onNext }) => {
  const { t } = useAppTranslation()
  const features = [
    {
      icon: 'CalendarPlus' as const,
      title: t('social.createEventIntro.feature1Title'),
      description: t('social.createEventIntro.feature1Desc')
    },
    {
      icon: 'Users' as const,
      title: t('social.createEventIntro.feature2Title'),
      description: t('social.createEventIntro.feature2Desc')
    },
    {
      icon: 'CircleCheck' as const,
      title: t('social.createEventIntro.feature3Title'),
      description: t('social.createEventIntro.feature3Desc')
    }
  ]

  return (
    <Box style={styles.container} justifyContent="space-between">
      <Box gap={6}>
        <Box gap={2}>
          <ThemedText size="xl" weight="bold">
            {t('social.createEventIntro.title')}
          </ThemedText>
          <ThemedText color="textSecondary">{t('social.createEventIntro.description')}</ThemedText>
        </Box>

        <Box gap={5}>
          {features.map((item, i) => (
            <Box key={i} flexDirection="row" gap={4} alignItems="flex-start">
              <Box style={styles.iconWrapper}>
                <ThemedIcon name={item.icon} size={20} color="primary" />
              </Box>
              <Box flex={1} gap={1}>
                <ThemedText weight="semibold">{item.title}</ThemedText>
                <ThemedText color="textSecondary" size="sm">
                  {item.description}
                </ThemedText>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box pt={6}>
        <Button onPress={onNext}>
          <ThemedText color="background" weight="semibold">
            {t('social.createEventBtn')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }
})
