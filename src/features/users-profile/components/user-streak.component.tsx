import { Box, ThemedIcon, ThemedText } from '@src/shared/components'

import { useUserStreak } from '../hooks/use-user-streak.hook'

type Props = {
  userId: string
}

export const UserStreak: React.FC<Props> = ({ userId }) => {
  const { data: streakData } = useUserStreak(userId)
  const currentStreak = streakData?.streak.currentStreak ?? 0

  return (
    <Box flexDirection="row" alignItems="center" gap={1} mt={-1}>
      <ThemedIcon name="Flame" size={12} color="textSecondary" />
      <ThemedText size="xs" color="textSecondary" variant="mono">
        {currentStreak} {currentStreak === 1 ? 'semana' : 'semanas'} em sequência
      </ThemedText>
    </Box>
  )
}
