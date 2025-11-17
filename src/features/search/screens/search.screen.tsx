import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { Tabs } from '@src/shared/components/tabs/tabs.component'
import { theme } from '@src/shared/constants/theme'

import { SearchInput, SearchPlaces, SearchUsers } from '../components'

type SearchScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'SearchScreen'>

export const SearchScreen: React.FC<SearchScreenScreenProps> = () => {
  const [inputSearch, setInputSearch] = useState('')

  return (
    <Box flex={1}>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <Box p={5} gap={3}>
            <Box mb={3}>
              <SearchInput inputSearch={inputSearch} setInputSearch={setInputSearch} />
            </Box>
            <Tabs titles={['Places', 'Users']} defaultIndex={0} variant="secondary">
              <SearchPlaces inputSearch={inputSearch} />
              <SearchUsers inputSearch={inputSearch} />
            </Tabs>
          </Box>
        </Screen>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  },
  relativeContainer: {
    flex: 1
  },
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
