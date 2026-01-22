import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, LoadingPage, ThemedText } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import { useLastSearched } from '../hooks'
import { SearchResultItems } from './search-result-item.component'

type SearchPlacesProps = {
  inputSearch: string
}

export const SearchPlaces: React.FC<SearchPlacesProps> = ({ inputSearch }) => {
  const { saveSearch } = useLastSearched()

  const fetchPlacesByName = async () => {
    const response = await PlacesService.fetchPlaceByName(inputSearch)

    return response.data
  }

  const { data: placeData, isFetching } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlacesByName', inputSearch],
    queryFn: fetchPlacesByName,
    retry: false,
    staleTime: 0,
    enabled: inputSearch.length >= 3
  })

  const handleItemClick = (item: PlacesModel) => {
    saveSearch({
      id: item.id,
      name: item.name,
      image: item.image,
      searchType: 'PLACES'
    })
  }

  if (isFetching) {
    return (
      <Box bg="background">
        <LoadingPage />
      </Box>
    )
  }

  if (!placeData?.length && !isFetching && inputSearch.length >= 3) {
    return (
      <Box mt={5}>
        <ThemedText>No results found.</ThemedText>
      </Box>
    )
  }
  return (
    <Box mt={5}>
      <SearchResultItems searchResultItemData={placeData!} searchType="PLACES" onItemClick={handleItemClick} />
    </Box>
  )
}
