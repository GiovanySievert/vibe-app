import { Box } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { GetUserByUsername } from '@src/shared/domain/users.model'

import { SearchResultItem } from './search-result-items.component'

type SearchResultItemsProps = {
  searchResultItemData: PlacesModel[] | GetUserByUsername[]
  searchType: 'USERS' | 'PLACES'
}

export const SearchResultItems: React.FC<SearchResultItemsProps> = ({ searchResultItemData, searchType }) => {
  if (!searchResultItemData?.length) {
    return
  }
  return (
    <>
      <Box gap={4}>
        {searchResultItemData.map((searchResultItem) => {
          return <SearchResultItem data={searchResultItem} searchType={searchType} />
        })}
      </Box>
    </>
  )
}
