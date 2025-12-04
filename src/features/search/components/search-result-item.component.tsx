import { Box } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { GetUserByUsername } from '@src/shared/domain/users.model'

import { SearchResultItem } from './search-result-items.component'

type SearchResultItemsProps =
  | {
      searchResultItemData: PlacesModel[]
      searchType: 'PLACES'
    }
  | {
      searchResultItemData: GetUserByUsername[]
      searchType: 'USERS'
    }

export const SearchResultItems: React.FC<SearchResultItemsProps> = (props) => {
  if (!props.searchResultItemData?.length) {
    return null
  }

  return (
    <Box gap={4}>
      {props.searchType === 'PLACES'
        ? props.searchResultItemData.map((item) => (
            <SearchResultItem data={item} searchType="PLACES" key={item.id} />
          ))
        : props.searchResultItemData.map((item) => (
            <SearchResultItem data={item} searchType="USERS" key={item.id} />
          ))}
    </Box>
  )
}
