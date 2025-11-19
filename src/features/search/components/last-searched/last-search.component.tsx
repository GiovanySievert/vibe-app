import { Box, ThemedText } from '@src/shared/components'

import { SearchResultItems } from '../search-result-item.component'

type LastSearchedProps = {}

export const LastSearched: React.FC<LastSearchedProps> = () => {
  return (
    <Box>
      <Box mb={4} flexDirection="row" justifyContent="space-between" alignItems="baseline">
        <ThemedText variant="secondary">Last Searched</ThemedText>
        <ThemedText variant="secondary" size="sm">
          Clear
        </ThemedText>
      </Box>
      <SearchResultItems searchResultItemData={[1, 2]} />
    </Box>
  )
}
