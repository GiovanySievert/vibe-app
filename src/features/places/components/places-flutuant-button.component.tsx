import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Button, ThemedText } from '@src/shared/components'

type Nav = NativeStackNavigationProp<ModalNavigatorParamsList>

export const PlacesFlutuantButton = ({ placeId }: { placeId: string }) => {
  const navigation = useNavigation<Nav>()

  return (
    <Box style={styles.absoluteContainer}>
      <Button onPress={() => navigation.navigate('PlaceReviewPostScreen', { placeId, photoUri: 'hhtt' })}>
        <ThemedText weight="medium" size="lg">
          Mandar foto do local
        </ThemedText>
      </Button>
    </Box>
  )
}

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  }
})
