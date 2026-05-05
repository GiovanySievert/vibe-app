import { useQuery } from '@tanstack/react-query'

import { UsersProfileService } from '@src/features/users-profile/services'

export const useUserSuggestions = () => {
  return useQuery({
    queryKey: ['userSuggestions'],
    queryFn: () => UsersProfileService.fetchSuggestions().then((respoonse) => respoonse.data),
    staleTime: 5 * 60_000
  })
}
