import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, ThemedText } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import { SearchResultItems } from './search-result-item.component'

type SearchUsersProps = {
  inputSearch: string
}

export const SearchUsers: React.FC<SearchPlacesProps> = ({ inpuUsersh }) => {
  const fetchPlacesByName = async () => {
    const response = await PlacesService.fetchPlaceByName(inputSearch)
    return response.data
  }

  const { data: placeData, isLoading } = useQuery<PlacesByIdResponse, Error>({
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

  return (
    <Box mt={5}>
      <SearchResultItems searchResultItemData={[1, 2]} />
    </Box>
  )
}
