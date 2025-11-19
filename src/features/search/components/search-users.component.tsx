import React from 'react'

import { useQuery } from '@tanstack/react-query'

import { Box, LoadingPage, ThemedText } from '@src/shared/components'
import { GetUserByUsername } from '@src/shared/domain/users.model'

import { SearchService } from '../services'
import { SearchResultItems } from './search-result-item.component'

type SearchPlacesProps = {
  inputSearch: string
}

export const SearchUsers: React.FC<SearchPlacesProps> = ({ inputSearch }) => {
  const fetchPlacesByName = async () => {
    console.log('CHAMOU')
    const response = await SearchService.fetchUsersByUsername(inputSearch)

    return response.data
  }

  const { data: usersData, isLoading } = useQuery<GetUserByUsername[], Error>({
    queryKey: ['fetchUsersByUsername', inputSearch],
    queryFn: fetchPlacesByName,
    retry: false,
    staleTime: 0,
    enabled: inputSearch.length >= 3
  })

  if (isLoading) {
    return (
      <Box bg="background">
        <LoadingPage />
      </Box>
    )
  }

  if (!usersData?.length && !isLoading && inputSearch.length > 0) {
    return (
      <Box mt={5}>
        <ThemedText>No results found.</ThemedText>
      </Box>
    )
  }

  return (
    <Box mt={5}>
      <SearchResultItems searchResultItemData={usersData!} searchType="USERS" />
    </Box>
  )
}
