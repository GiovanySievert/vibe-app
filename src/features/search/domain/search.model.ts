import { PlacesModel } from '@src/shared/domain'
import { GetUserByUsername } from '@src/shared/domain/users.model'

export type SearchResultDataType =
  | {
      searchResultItemData: PlacesModel[]
      searchType: 'PLACES'
    }
  | {
      searchResultItemData: GetUserByUsername[]
      searchType: 'USERS'
    }

export type SavedSearchItem =
  | {
      id: string
      name: string
      image?: string
      searchType: 'PLACES'
    }
  | {
      id: string
      username: string
      searchType: 'USERS'
    }
