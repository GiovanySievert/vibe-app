import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, ThemedText } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import { SearchResultItems } from './search-result-item.component'

type SearchPlacesProps = {
  inputSearch: string
}

export const SearchPlaces: React.FC<SearchPlacesProps> = ({ inputSearch }) => {
  const fetchPlacesByName = async () => {
    const response = await PlacesService.fetchPlaceByName(inputSearch)

    return response.data
  }

  const { data: placeData, isLoading } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlacesByName'],
    queryFn: fetchPlacesByName,
    retry: false,
    staleTime: 0
  })

  if (isLoading) {
    return (
      <Box bg="background">
        <ThemedText>CARREGANDO</ThemedText>
      </Box>
    )
  }

  if (!placeData) {
    return
  }

  return (
    <Box mt={5}>
      <SearchResultItems searchResultItemData={placeData} />
    </Box>
  )
}
