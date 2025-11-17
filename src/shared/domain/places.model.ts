export type PlacesModel = {
  id: string
  name: string
  distance: number
  image: string
  location: {
    lat: number
    lon: number
  }
}

export type Venue = {
  id: number
  brandId: number
  name: string
  priceRange: string
  paymentMethods: string
  socialInstagram: string
  socialTiktok: string
  contactPhone: string
  about: string
  createdAt: string
  updatedAt: string
}

export type BrandMenu = {
  id: number
  brandId: number
  name: string
  description: string
  priceCents: number
  createdAt: string
  updatedAt: string
}

export type Brand = {
  id: number
  name: string
  taxId: string
  type: string
  avatar: string | null
  createdAt: string
  updatedAt: string
  menus: BrandMenu[]
}

export type VenueLocation = {
  id: number
  venueId: number
  addressLine: string
  addressLine2: string
  number: string
  neighborhood: string
  city: string
  state: string
  country: string
  postalCode: string
  lat: string
  lng: string
  createdAt: string
  updatedAt: string
}

export type PlacesByIdResponse = {
  id: number
  brandId: number
  name: string
  priceRange: string
  paymentMethods: string
  socialInstagram: string
  socialTiktok: string
  contactPhone: string
  about: string
  createdAt: string
  updatedAt: string
  brand: Brand
  location: VenueLocation
}
