import React from 'react'
import { TouchableOpacity } from 'react-native'

import { Box } from '../box'

type PillProps = {
  label: string
  type?: 'Primary' | 'Secondary'
  onPress?: () => void
}

export const Pill: React.FC<PillProps> = ({ type, label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box>{label}</Box>
    </TouchableOpacity>
  )
}
