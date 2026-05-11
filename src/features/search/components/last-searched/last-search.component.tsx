import { Pressable } from 'react-native'

import { Box, ThemedText } from '@src/shared/components'

import { useLastSearched } from '../../hooks'
import { SearchResultItem } from '../search-result-items.component'

type LastSearchedProps = Record<string, never>

export const LastSearched: React.FC<LastSearchedProps> = () => {
  const { lastSearched, isLoading, clearLastSearched, removeSearchItem } = useLastSearched()

  if (isLoading) {
    return null
  }

  if (!lastSearched || lastSearched.length === 0) {
    return null
  }

  return (
    <Box>
      <Box mb={4} flexDirection="row" justifyContent="space-between" alignItems="center">
        <ThemedText variant="mono" letterSpacing="wide">
          recentes
        </ThemedText>
        <Pressable onPress={clearLastSearched}>
          <ThemedText variant="secondary" size="xs">
            limpar
          </ThemedText>
        </Pressable>
      </Box>
      <Box gap={4}>
        {lastSearched.map((item, index) => {
          if (item.searchType === 'PLACES') {
            return (
              <SearchResultItem
                key={index}
                data={{
                  id: item.id,
                  name: item.name,
                  image: item.image || '',
                  distance: 0,
                  location: { lat: 0, lon: 0 }
                }}
                searchType="PLACES"
                onRemove={() => removeSearchItem(item.id)}
              />
            )
          }

          return (
            <SearchResultItem
              key={index}
              data={{ id: item.id, username: item.username, image: item.image ?? null }}
              searchType="USERS"
              onRemove={() => removeSearchItem(item.id)}
            />
          )
        })}
      </Box>
    </Box>
  )
}
