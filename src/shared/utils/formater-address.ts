export type AddressFormatterType =
  | 'basic'
  | 'full'
  | 'cityAndState'
  | 'cityAndNeighborhood'
  | 'onlyNeighborhood'
  | 'forSearchMaps'
  | 'cityAndNeighborhoodAndState'

export type Address = {
  addressLine?: string
  addressLine2?: string
  number?: string
  neighborhood?: string
  city: string
  state: string
  zipcode?: string
}

export const formaterAddress = (address: Address, type: AddressFormatterType = 'basic') => {
  if (!address) {
    return ''
  }

  if (type === 'cityAndState') {
    const parts = []
    parts.push(' ', address.city)
    parts.push(' - ', address.state)
    return parts.join('')
  }

  if (type === 'cityAndNeighborhood') {
    const parts = []
    parts.push(' ', address.city)
    parts.push(' - ', address.neighborhood)
    return parts.join('')
  }

  if (type === 'cityAndNeighborhoodAndState') {
    const parts = []
    parts.push('', address.neighborhood)
    parts.push(', ', address.city)
    parts.push('-', address.state)
    return parts.join('')
  }

  if (type === 'onlyNeighborhood') {
    const parts = []
    parts.push(' ', address.neighborhood)
    return parts.join('')
  }

  if (type === 'basic') {
    const parts = []
    parts.push(address.addressLine)
    parts.push(', ', address.number)
    parts.push(' - ', address.neighborhood)
    return parts.join('')
  }

  if (type === 'full') {
    const parts = []
    parts.push(address.addressLine)
    parts.push(', ', address.number)
    if (address.addressLine2) {
      parts.push(', ', address.addressLine2)
    }
    parts.push(' - ', address.neighborhood)
    parts.push(', ', address.city)
    parts.push(' - ', address.state)
    parts.push(', ', address.zipcode?.replace(/(\d{5})(\d{3})/, '$1-$2'))
    return parts.join('')
  }

  if (type === 'forSearchMaps') {
    const parts = []
    parts.push(address.addressLine)
    parts.push(', ', address.number)
    parts.push(' - ', address.neighborhood)
    parts.push(', ', address.city)
    parts.push(' - ', address.state)
    parts.push(', ', address.zipcode?.replace(/(\d{5})(\d{3})/, '$1-$2'))
    return parts.join('')
  }
}
