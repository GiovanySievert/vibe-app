import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { useQuery } from '@tanstack/react-query'

import { SearchService } from '@src/features/search/services'
import { Avatar, Box, Button, Divider, Input, LoadingPage, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { GetUserByUsername } from '@src/shared/domain/users.model'
import { useDebounce } from '@src/shared/hooks'

type CreateEventParticipantsProps = {
  selected: GetUserByUsername[]
  onToggle: (user: GetUserByUsername) => void
  onNext: () => void
  onBack: () => void
}

export const CreateEventParticipants: React.FC<CreateEventParticipantsProps> = ({
  selected,
  onToggle,
  onNext,
  onBack
}) => {
  const [inputSearch, setInputSearch] = useState('')
  const debouncedSearch = useDebounce(inputSearch, 300)

  const { data: users, isLoading } = useQuery<GetUserByUsername[], Error>({
    queryKey: ['eventParticipantSearch', debouncedSearch],
    queryFn: async () => {
      const res = await SearchService.fetchUsersByUsername(debouncedSearch)
      return res.data
    },
    enabled: debouncedSearch.length >= 3,
    staleTime: 0,
    retry: false
  })

  const isSelected = (user: GetUserByUsername) => selected.some((s) => s.id === user.id)

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Box gap={3}>
        <Input
          value={inputSearch}
          onChangeText={setInputSearch}
          isClearable
          onClear={() => setInputSearch('')}
          autoFocus
        />

        {selected.length > 0 && (
          <Box flexDirection="row" flexWrap="wrap" gap={2}>
            {selected.map((username) => (
              <TouchableOpacity key={username.id} onPress={() => onToggle(username)}>
                <Box style={styles.chip} flexDirection="row" alignItems="center" gap={1}>
                  <ThemedText size="sm" color="primary">
                    {username.username}
                  </ThemedText>
                  <ThemedText size="sm" color="primary">
                    ×
                  </ThemedText>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
        )}

        {isLoading && (
          <Box mt={4}>
            <LoadingPage />
          </Box>
        )}

        {!isLoading && debouncedSearch.length >= 3 && !users?.length && (
          <Box mt={4}>
            <ThemedText color="textSecondary">Nenhum usuário encontrado.</ThemedText>
          </Box>
        )}

        {!isLoading && debouncedSearch.length < 3 && (
          <Box mt={2}>
            <ThemedText color="textTertiary" size="sm">
              Digite pelo menos 3 caracteres para buscar.
            </ThemedText>
          </Box>
        )}

        {!isLoading &&
          (users ?? []).map((user) => {
            const checked = isSelected(user)
            return (
              <TouchableOpacity key={user.id} onPress={() => onToggle(user)}>
                <Box flexDirection="row" alignItems="center" gap={3} pt={3} pb={3}>
                  <Avatar size="sm" uri={user.image} />
                  <Box flex={1}>
                    <ThemedText>{user.username}</ThemedText>
                  </Box>
                  <Box
                    style={[styles.checkbox, checked && styles.checkboxChecked]}
                    alignItems="center"
                    justifyContent="center"
                  >
                    {checked && (
                      <ThemedText size="sm" color="background" weight="bold">
                        ✓
                      </ThemedText>
                    )}
                  </Box>
                </Box>
                <Divider />
              </TouchableOpacity>
            )
          })}
      </Box>

      <Box gap={3} pt={4}>
        <Button onPress={onNext}>
          <ThemedText color="background" weight="semibold">
            Próximo
          </ThemedText>
        </Button>
        <Button variant="ghost" onPress={onBack}>
          <ThemedText color="primary" weight="semibold">
            Voltar
          </ThemedText>
        </Button>
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: theme.colors.primaryGlow,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.textTertiary
  },
  checkboxChecked: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary
  }
})
