import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Button, ThemedText } from '@src/shared/components'

type Nav = NativeStackNavigationProp<ModalNavigatorParamsList>

export const PlacesFlutuantButton = ({ placeId, placeName }: { placeId: string; placeName: string }) => {
  const navigation = useNavigation<Nav>()

  return (
    <Box m={5} alignItems="center" justifyContent="center" bg="primary">
      <Button style={styles.button} onPress={() => navigation.navigate('PlaceReviewPostScreen', { placeId, placeName })}>
        <ThemedText color="background" size="lg" weight="semibold">
          postar vibe daqui
        </ThemedText>
      </Button>
    </Box>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    width: '100%'
  }
})
