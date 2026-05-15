import React from 'react'
import { Alert, DimensionValue, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'
import {
  BadgesService,
  MY_BADGE_PROGRESS_QUERY_KEY,
  MY_BADGES_QUERY_KEY,
  PlaceBadgeListItem,
  PlaceBadgeProgressItem,
  USER_BADGES_QUERY_KEY
} from '@src/features/users-profile/services'
import { Box, Card, GoBackButton, ThemedIcon, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'

const getSelectedPlaceIds = (badges: PlaceBadgeListItem[]) =>
  badges
    .filter((badge) => badge.visibleOnProfile)
    .sort((a, b) => (a.profilePosition ?? 0) - (b.profilePosition ?? 0))
    .map((badge) => badge.placeId)

const applySelection = (badges: PlaceBadgeListItem[], placeIds: string[]) =>
  badges.map((badge) => {
    const index = placeIds.indexOf(badge.placeId)
    return {
      ...badge,
      visibleOnProfile: index >= 0,
      profilePosition: index >= 0 ? index + 1 : null
    }
  })

type BadgeCardProps = {
  badge: PlaceBadgeListItem
  disabled: boolean
  onPress: () => void
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, disabled, onPress }) => {
  const topTier = badge.tiers[badge.tiers.length - 1]
  const isSelected = badge.visibleOnProfile

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <Card p={5} gap={4} style={[styles.card, isSelected ? styles.cardSelected : styles.cardInactive]}>
        <Box flexDirection="row" alignItems="center" gap={4}>
          <Box style={[styles.countBadge, isSelected ? styles.countBadgeSelected : styles.countBadgeInactive]}>
            <ThemedText size="xl" weight="bold" color={isSelected ? 'primary' : 'textTerciary'}>
              {badge.reviewCount}
            </ThemedText>
          </Box>

          <Box flex={1}>
            <ThemedText size="lg" weight="bold" color={isSelected ? 'textPrimary' : 'textSecondary'}>
              {topTier?.label ?? 'badge'}
            </ThemedText>
            <ThemedText variant="mono" size="xs" color="textSecondary">
              {badge.placeName ?? 'lugar'}
            </ThemedText>
          </Box>

          <Box style={[styles.statusBadge, isSelected ? styles.statusSelected : styles.statusInactive]}>
            {isSelected ? <ThemedIcon name="Check" color="background" size={16} strokeWidth={3} /> : null}
          </Box>
        </Box>

        {isSelected ? (
          <Box style={styles.visibleLabel}>
            <ThemedText variant="mono" size="xs" color="primary">
              visível no perfil
            </ThemedText>
          </Box>
        ) : null}
      </Card>
    </TouchableOpacity>
  )
}

type LockedBadgeCardProps = {
  progressBadge: PlaceBadgeProgressItem
}

const LockedBadgeCard: React.FC<LockedBadgeCardProps> = ({ progressBadge }) => {
  const progressPercent = `${Math.min(progressBadge.reviewCount / progressBadge.targetReviewCount, 1) * 100}%` as DimensionValue

  return (
    <Card p={5} gap={3} style={[styles.card, styles.lockedCard]}>
      <Box flexDirection="row" alignItems="center" gap={4}>
        <Box style={[styles.countBadge, styles.countBadgeInactive]}>
          <ThemedText size="xl" weight="bold" color="textTerciary">
            {progressBadge.targetReviewCount}
          </ThemedText>
        </Box>

        <Box flex={1} gap={1}>
          <ThemedText size="lg" weight="bold" color="textSecondary">
            {progressBadge.label}
          </ThemedText>
          <ThemedText variant="mono" size="xs" color="textSecondary">
            {progressBadge.placeName ?? 'lugar'}
          </ThemedText>
          <Box style={styles.progressTrack}>
            <Box style={[styles.progressFill, { width: progressPercent }]} />
          </Box>
          <ThemedText variant="mono" size="xs" color="textSecondary">
            {progressBadge.reviewCount} / {progressBadge.targetReviewCount}
          </ThemedText>
        </Box>

        <ThemedIcon name="Lock" color="textTerciary" size={24} />
      </Box>
    </Card>
  )
}

export const UserBadgesScreen = () => {
  const [authState] = useAtom(authStateAtom)
  const queryClient = useQueryClient()

  const {
    data: unlockedBadges = [],
    isError: hasUnlockedBadgesError,
    isLoading
  } = useQuery<PlaceBadgeListItem[], Error>({
    queryKey: MY_BADGES_QUERY_KEY,
    queryFn: async () => (await BadgesService.fetchMyBadges()).data,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always'
  })
  const { data: progressBadges = [], isLoading: isProgressLoading } = useQuery<PlaceBadgeProgressItem[], Error>({
    queryKey: MY_BADGE_PROGRESS_QUERY_KEY,
    queryFn: async () => (await BadgesService.fetchMyBadgeProgress()).data,
    retry: false,
    staleTime: 0,
    refetchOnMount: 'always'
  })

  const selectedPlaceIds = getSelectedPlaceIds(unlockedBadges)

  const updateSelectionMutation = useMutation({
    mutationFn: async (placeIds: string[]) => (await BadgesService.updateProfileBadgeSelection(placeIds)).data,
    onMutate: async (placeIds) => {
      await queryClient.cancelQueries({ queryKey: MY_BADGES_QUERY_KEY })
      const previousBadges = queryClient.getQueryData<PlaceBadgeListItem[]>(MY_BADGES_QUERY_KEY)
      queryClient.setQueryData<PlaceBadgeListItem[]>(MY_BADGES_QUERY_KEY, (current) =>
        current ? applySelection(current, placeIds) : current
      )
      return { previousBadges }
    },
    onError: (_error, _placeIds, context) => {
      if (context?.previousBadges) {
        queryClient.setQueryData(MY_BADGES_QUERY_KEY, context.previousBadges)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MY_BADGES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...USER_BADGES_QUERY_KEY, authState.user.id] })
    }
  })

  const handleToggleBadge = (badge: PlaceBadgeListItem) => {
    const isSelected = selectedPlaceIds.includes(badge.placeId)
    const nextPlaceIds = isSelected
      ? selectedPlaceIds.filter((placeId) => placeId !== badge.placeId)
      : [...selectedPlaceIds, badge.placeId]

    if (!isSelected && selectedPlaceIds.length >= 3) {
      Alert.alert('limite de badges', 'você pode mostrar até 3 badges no perfil.')
      return
    }

    updateSelectionMutation.mutate(nextPlaceIds)
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" alignItems="center" gap={3}>
          <GoBackButton />
          <Box>
            <ThemedText variant="title">badges</ThemedText>
            <ThemedText variant="mono">conquistas · perfil</ThemedText>
          </Box>
        </Box>

        <Box pl={6} pr={6} pb={8} gap={5}>
          <Box>
            <ThemedText variant="title" size="2xl">
              suas conquistas
            </ThemedText>
            <ThemedText variant="mono" size="xs">
              toque pra mostrar/ocultar no perfil
            </ThemedText>
          </Box>

          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <ThemedText variant="mono" size="xs" style={styles.sectionLabel}>
              desbloqueadas
            </ThemedText>
            <ThemedText variant="mono" size="xs">
              {unlockedBadges.length}
            </ThemedText>
          </Box>

          <Box gap={4}>
            {isLoading ? (
              <ThemedText variant="mono" color="textSecondary">
                carregando...
              </ThemedText>
            ) : hasUnlockedBadgesError ? (
              <ThemedText variant="mono" color="textSecondary">
                não foi possível carregar suas conquistas
              </ThemedText>
            ) : unlockedBadges.length ? (
              unlockedBadges.map((badge) => (
                <BadgeCard
                  key={badge.placeId}
                  badge={badge}
                  disabled={updateSelectionMutation.isPending}
                  onPress={() => handleToggleBadge(badge)}
                />
              ))
            ) : (
              <ThemedText variant="mono" color="textSecondary">
                nenhuma conquista desbloqueada ainda
              </ThemedText>
            )}
          </Box>

          <Box flexDirection="row" alignItems="center" justifyContent="space-between" mt={3}>
            <ThemedText variant="mono" size="xs" style={styles.sectionLabel}>
              bloqueadas
            </ThemedText>
            <ThemedText variant="mono" size="xs">
              {progressBadges.length}
            </ThemedText>
          </Box>

          <Box gap={4}>
            {isProgressLoading ? (
              <ThemedText variant="mono" color="textSecondary">
                carregando...
              </ThemedText>
            ) : progressBadges.length ? (
              progressBadges.map((progressBadge) => (
                <LockedBadgeCard
                  key={`${progressBadge.placeId}-${progressBadge.tier}`}
                  progressBadge={progressBadge}
                />
              ))
            ) : (
              <ThemedText variant="mono" color="textSecondary">
                nenhuma badge em progresso
              </ThemedText>
            )}
          </Box>
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  content: {
    flexGrow: 1
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  card: {
    borderRadius: 8,
    borderWidth: 1
  },
  cardSelected: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.backgroundSecondary
  },
  cardInactive: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    opacity: 0.58
  },
  lockedCard: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    opacity: 0.55
  },
  countBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3
  },
  countBadgeSelected: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.primaryGlow
  },
  countBadgeInactive: {
    borderColor: theme.colors.border
  },
  statusBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3
  },
  statusSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary
  },
  statusInactive: {
    borderColor: theme.colors.border
  },
  visibleLabel: {
    borderRadius: 8,
    backgroundColor: theme.colors.primaryGlow,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  progressTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginTop: 8
  },
  progressFill: {
    height: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.textSecondary
  }
})
