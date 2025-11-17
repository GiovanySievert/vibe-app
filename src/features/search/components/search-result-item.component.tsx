import { Box } from '@src/shared/components'

import { SearchResultItem } from './search-result-items.component'

type SearchResultItemsProps = {
  searchResultItemData: any[]
}

export const SearchResultItems: React.FC<SearchResultItemsProps> = ({ searchResultItemData }) => {
  return (
    <>
      <Box gap={4}>
        {searchResultItemData.map((searchResultItem) => {
          return <SearchResultItem data={searchResultItem} />
        })}
      </Box>
    </>
  )
}
