import { Box } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { GetUserByUsername } from '@src/shared/domain/users.model'

import { SearchResultItem } from './search-result-items.component'

type SearchResultItemsProps =
  | {
      searchResultItemData: PlacesModel[]
      searchType: 'PLACES'
      onItemClick?: (item: PlacesModel) => void
    }
  | {
      searchResultItemData: GetUserByUsername[]
      searchType: 'USERS'
      onItemClick?: (item: GetUserByUsername) => void
    }

export const SearchResultItems: React.FC<SearchResultItemsProps> = (props) => {
  if (!props.searchResultItemData?.length) {
    return null
  }

  if (props.searchType === 'PLACES') {
    return (
      <Box gap={4}>
        {props.searchResultItemData.map((item) => (
          <SearchResultItem
            data={item}
            searchType="PLACES"
            key={item.id}
            onItemClick={props.onItemClick ? () => props.onItemClick?.(item) : undefined}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box gap={4}>
      {props.searchResultItemData.map((item) => (
        <SearchResultItem
          data={item}
          searchType="USERS"
          key={item.id}
          onItemClick={props.onItemClick ? () => props.onItemClick?.(item) : undefined}
        />
      ))}
    </Box>
  )
}
