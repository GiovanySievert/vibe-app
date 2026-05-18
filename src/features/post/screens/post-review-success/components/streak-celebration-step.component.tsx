import React from 'react'
import { Pressable, ScrollView, StyleSheet } from 'react-native'

import { useQuery } from '@tanstack/react-query'

import { StreakService } from '@src/features/users-profile/services'
import type { FriendStreakSummary, StreakUpdateResponse } from '@src/features/users-profile/types'
import { Avatar, Box, Button, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { space } from '@src/shared/utils'

type Props = {
  streakUpdate: StreakUpdateResponse
  onClose: () => void
  onContinue: () => void
}

const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7]
const FRIENDS_LIMIT = 5

export const StreakCelebrationStep: React.FC<Props> = ({ streakUpdate, onClose, onContinue }) => {
  const { t } = useAppTranslation()
  const activeWeeks = Math.min(streakUpdate.currentStreak, WEEK_DAYS.length)

  const { data, isLoading: loading } = useQuery({
    queryKey: ['myFriendsStreaks', FRIENDS_LIMIT],
    queryFn: async () => (await StreakService.fetchMyFriendsStreaks(FRIENDS_LIMIT)).data,
    retry: false,
    staleTime: 60 * 5
  })

  const friends = data?.friends ?? []
  const count = data?.count ?? 0

  return (
    <Box flex={1} p={5} style={styles.content}>
      <Box flexDirection="row" justifyContent="flex-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
          style={styles.closeButton}
        >
          <ThemedIcon name="X" size={20} color="textPrimary" />
        </Pressable>
      </Box>

      <Box flex={1}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Box gap={6}>
            <Box gap={3}>
              <ThemedText variant="mono" color="primary" letterSpacing="wider" textTransform="uppercase">
                {t('post.success.reviewStatus')}
              </ThemedText>
              <Box flexDirection="row" alignItems="flex-end" gap={2} style={styles.titleRow}>
                <ThemedText variant="title" letterSpacing="normal" style={styles.title}>
                  {t('usersProfile.streak.week', {
                    count: streakUpdate.currentStreak
                  })}{' '}
                  de streak!
                </ThemedText>
                <ThemedIcon name="Flame" size={34} color="primary" />
              </Box>
              <ThemedText variant="mono" color="textSecondary" size="sm" letterSpacing="normal" style={styles.subtitle}>
                {t('post.success.streakSubtitle')}
              </ThemedText>
            </Box>

            <Box flexDirection="row" gap={2} style={styles.weekGrid}>
              {WEEK_DAYS.map((week) => {
                const active = week <= activeWeeks
                return (
                  <Box key={week} style={[styles.weekCell, active && styles.weekCellActive]}>
                    {active ? (
                      <ThemedIcon name="Check" size={16} color="background" />
                    ) : (
                      <ThemedText variant="mono" weight="bold" color="textTerciary" letterSpacing="normal">
                        {week}
                      </ThemedText>
                    )}
                  </Box>
                )
              })}
            </Box>

            <Box gap={4} p={5} style={styles.friendsCard}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                <ThemedText variant="mono" color="textSecondary" letterSpacing="wider" textTransform="uppercase">
                  {t('post.success.friendsStreak')}
                </ThemedText>
                <ThemedText variant="mono" color="textSecondary" letterSpacing="normal">
                  {count}
                </ThemedText>
              </Box>

              {friends.length > 0 ? (
                <Box gap={4}>
                  {friends.map((friend) => (
                    <FriendStreakRow key={friend.userId} friend={friend} />
                  ))}
                </Box>
              ) : (
                <Box justifyContent="center" style={loading ? styles.emptyLoading : undefined}>
                  <ThemedText variant="mono" color="textSecondary" size="sm" letterSpacing="normal">
                    {loading ? t('post.success.loadingFriends') : t('post.success.emptyFriends')}
                  </ThemedText>
                </Box>
              )}
            </Box>
          </Box>
        </ScrollView>

        <Button onPress={onContinue}>
          <ThemedText weight="bold" color="background" letterSpacing="normal">
            {t('post.actions.continueBtn')}
          </ThemedText>
        </Button>
      </Box>
    </Box>
  )
}

const FriendStreakRow: React.FC<{ friend: FriendStreakSummary }> = ({ friend }) => {
  const { t } = useAppTranslation()

  return (
    <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={3}>
      <Box flex={1} flexDirection="row" alignItems="center" gap={3}>
        <Avatar size="xs" uri={friend.image} fallbackLetter={friend.name || friend.username} />
        <Box flex={1}>
          <ThemedText weight="bold" color="textPrimary" letterSpacing="normal" numberOfLines={1}>
            {friend.name}
          </ThemedText>
          <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal" numberOfLines={1}>
            @{friend.username}
          </ThemedText>
        </Box>
      </Box>
      <Box flexDirection="row" alignItems="baseline" gap={1}>
        <ThemedText weight="bold" size="xl" color="primary" letterSpacing="normal">
          {friend.currentStreak}
        </ThemedText>
        <ThemedText variant="mono" size="xs" color="textSecondary" letterSpacing="normal">
          {t('post.success.weekShort')}
        </ThemedText>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent'
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  titleRow: {
    maxWidth: 340
  },
  title: {
    flexShrink: 1,
    maxWidth: 300
  },
  subtitle: {
    maxWidth: 300
  },
  scrollContent: {
    paddingBottom: space(6)
  },
  weekGrid: {
    width: '100%'
  },
  weekCell: {
    flex: 1,
    aspectRatio: 0.86,
    minHeight: 52,
    maxHeight: 76,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  weekCellActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary
  },
  friendsCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    minHeight: space(16) * 3
  },
  emptyLoading: {
    minHeight: 92
  }
})
