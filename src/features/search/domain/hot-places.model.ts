export type HotPlaceItem = {
  id: string
  name: string
  distance?: number
  isHot?: boolean
  location?: {
    lat: number
    lon: number
  }
}
