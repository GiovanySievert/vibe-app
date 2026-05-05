import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'

import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { UserSuggestion } from '@src/shared/domain/users.model'

import { useUserSuggestions } from '../hooks'
import { SuggestedUserCard } from './suggested-user-card.component'

export const FeedSuggestions: React.FC = () => {
  const { data: suggestions, isPending } = useUserSuggestions()

  if (isPending) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" pt={10}>
        <ActivityIndicator color={theme.colors.primary} />
      </Box>
    )
  }

  if (!suggestions?.length) {
    return null
  }

  return (
    <Box pt={6} pl={4} pr={4}>
      <Box mb={1}>
        <ThemedText weight="semibold" size="lg">
          Pessoas que você pode conhecer
        </ThemedText>
      </Box>
      <Box mb={5}>
        <ThemedText color="textSecondary" size="sm">
          Siga alguém para ver as reviews deles aqui
        </ThemedText>
      </Box>
      <FlatList<UserSuggestion>
        data={suggestions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SuggestedUserCard item={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <Box style={styles.separator} />}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border
  }
})
