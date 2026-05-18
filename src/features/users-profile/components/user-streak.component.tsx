import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'

import { useUserStreak } from '../hooks/use-user-streak.hook'

type Props = {
  userId: string
}

export const UserStreak: React.FC<Props> = ({ userId }) => {
  const { t } = useAppTranslation()
  const { data: streakData } = useUserStreak(userId)
  const currentStreak = streakData?.streak.currentStreak ?? 0

  return (
    <Box flexDirection="row" alignItems="center" gap={1} mt={-1}>
      <ThemedIcon name="Flame" size={12} color="textSecondary" />
      <ThemedText size="xs" color="textSecondary" variant="mono">
        {t('usersProfile.streak.sequence', {
          value: t('usersProfile.streak.week', { count: currentStreak })
        })}
      </ThemedText>
    </Box>
  )
}
