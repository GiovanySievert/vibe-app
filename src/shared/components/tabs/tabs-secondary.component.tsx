import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { ThemedText } from '../themed-text'

type SecondaryTabsProps = {
  titles: string[]
  activeIndex: number
  onTabPress: (index: number) => void
}

export const SecondaryTabs: React.FC<SecondaryTabsProps> = ({ titles, activeIndex, onTabPress }) => {
  return (
    <View style={styles.secondaryTabContainer}>
      {titles.map((title, index) => (
        <Pressable key={title + index} style={styles.secondaryTab} onPress={() => onTabPress(index)}>
          <ThemedText
            style={{
              color: index === activeIndex ? theme.colors.textPrimary : theme.colors.textSecondary,
              fontSize: theme.sizes.md,
              fontWeight: index === activeIndex ? theme.weights.semibold : theme.weights.regular
            }}
          >
            {title}
          </ThemedText>
          {index === activeIndex && <View style={styles.activeIndicator} />}
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  secondaryTabContainer: {
    flexDirection: 'row',
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderFocus
  },
  secondaryTab: {
    paddingVertical: 12,
    alignItems: 'center'
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '100%',
    backgroundColor: theme.colors.textPrimary
  }
})
