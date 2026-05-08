import { Box, ThemedIcon, ThemedText } from '@src/shared/components'

import { useUserBadges } from '../hooks/use-user-badges.hook'

type Props = {
  userId: string
}

export const UserPlaceBadges: React.FC<Props> = ({ userId }) => {
  const { data: badges } = useUserBadges(userId)

  if (!badges?.length) return null

  return (
    <>
      {badges.map((badge) => {
        const topTier = badge.tiers[badge.tiers.length - 1]
        return (
          <Box key={badge.placeId} flexDirection="row" alignItems="center" gap={1} mt={-1}>
            <ThemedIcon name="Crown" size={12} color="textSecondary" />
            <ThemedText size="xs" color="textSecondary" variant="mono" textTransform="lowercase">
              {topTier.label} do {badge.placeName ?? 'lugar'}
            </ThemedText>
          </Box>
        )
      })}
    </>
  )
}
