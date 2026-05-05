import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, ThemedText } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import { SearchResultItems } from '../search-result-item.component'

export const HotPlaces: React.FC = () => {
  const { data } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchHotPlaces'],
    queryFn: async () => {
      const response = await PlacesService.fetchHotPlaces()
      return response.data
    },
    retry: false,
    staleTime: 60_000
  })

  if (!data?.length) {
    return null
  }

  return (
    <Box mt={6}>
      <Box mb={4}>
        <ThemedText variant="secondary">Lugares em alta</ThemedText>
      </Box>
      <SearchResultItems searchResultItemData={data} searchType="PLACES" />
    </Box>
  )
}
