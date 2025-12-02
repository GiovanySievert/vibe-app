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
  id: string
  brandId: string
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
  id: string
  brandId: string
  name: string
  description: string
  priceCents: number
  createdAt: string
  updatedAt: string
}

export type Brand = {
  id: string
  name: string
  taxId: string
  type: string
  avatar: string | null
  createdAt: string
  updatedAt: string
  menus: BrandMenu[]
}

export type VenueLocation = {
  id: string
  venueId: string
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
  id: string
  brandId: string
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
