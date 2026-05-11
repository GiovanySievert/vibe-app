import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { HotPlaceItem } from '@src/features/search/domain'
import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'
import { formatDistance } from '@src/shared/utils'

type HotPlacesCardProps = {
  item: HotPlaceItem
  index: number
}

export const HotPlacesCard: React.FC<HotPlacesCardProps> = ({ item, index }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const handleNavigate = () => {
    navigation.goBack()
    navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId: item.id } })
  }

  const position = String(index + 1).padStart(2, '0')

  return (
    <>
      <Box flexDirection="row" alignItems="center" gap={3} mt={1} mb={4}>
        <ThemedText variant="mono" weight="medium" color="textSecondary">
          {position}
        </ThemedText>
        <Avatar size="sm" square placeholderIcon="MapPin" />
        <TouchableOpacity onPress={handleNavigate} style={styles.content}>
          <ThemedText color="textPrimary" weight="medium" size="lg">
            {item.name}
          </ThemedText>
          <ThemedText color="textSecondary" variant="mono" size="xs" letterSpacing="wider">
            {formatDistance(item.distance)}
          </ThemedText>
        </TouchableOpacity>
        {item.isHot && (
          <ThemedText size="sm" color="success" weight="semibold">
            em alta
          </ThemedText>
        )}
      </Box>
      <Divider />
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1
  }
})
