import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { ThemedText } from '../themed-text'

type PrimaryTabsProps = {
  titles: string[]
  activeIndex: number
  onTabPress: (index: number) => void
}

export const PrimaryTabs: React.FC<PrimaryTabsProps> = ({ titles, activeIndex, onTabPress }) => {
  return (
    <View
      style={[
        styles.tabContainer,
        {
          borderColor: theme.colors.borderFocus,
          backgroundColor: theme.colors.background,
          borderRadius: 8
        }
      ]}
    >
      {titles.map((title, index) => (
        <Pressable key={title + index} style={styles.tab} onPress={() => onTabPress(index)}>
          <View
            style={[
              styles.tabTextContainer,
              {
                backgroundColor: index === activeIndex ? theme.colors.backgroundTertiary : 'transparent'
              }
            ]}
          >
            <ThemedText
              style={{
                color: index === activeIndex ? theme.colors.textPrimary : theme.colors.textSecondary,
                fontSize: theme.sizes.lg,
                fontWeight: index === activeIndex ? theme.weights.semibold : theme.weights.regular
              }}
            >
              {title}
            </ThemedText>
          </View>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    flex: 0,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  tab: {
    alignSelf: 'center'
  },
  tabTextContainer: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    margin: 4,
    flex: 1
  }
})
