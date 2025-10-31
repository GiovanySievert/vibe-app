import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { theme } from '@src/shared/constants/theme'

import { ThemedText } from '../themed-text'

type TabProps = {
  titles: string[]
  children: React.ReactNode[]
  defaultIndex?: number
  onChange?: (index: number) => void
}

export const Tabs: React.FC<TabProps> = ({ titles, children, defaultIndex, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex || 0)

  useEffect(() => {
    if (defaultIndex !== undefined) {
      setActiveIndex(defaultIndex)
    }
  }, [defaultIndex])

  const renderTabs = () => {
    return titles.map((title, index) => (
      <Pressable
        key={title + index}
        style={styles.tab}
        onPress={() => {
          setActiveIndex(index)
          onChange && onChange(index)
        }}
      >
        <View
          style={[
            styles.tabTextContainer,
            {
              backgroundColor: index === activeIndex ? theme.colors.backgroundTertiary : 'transparent'
            }
          ]}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color: index === activeIndex ? theme.colors.textPrimary : theme.colors.textSecondary,
                fontSize: theme.sizes.lg,
                fontWeight: index === activeIndex ? theme.weights.semibold : theme.weights.regular
              }
            ]}
          >
            {title}
          </ThemedText>
        </View>
      </Pressable>
    ))
  }

  const renderContent = () => {
    return children[activeIndex]
  }

  return (
    <View style={styles.tabsWrapper}>
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
        {renderTabs()}
      </View>
      <View style={styles.content}>{renderContent()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabsWrapper: {
    justifyContent: 'center',
    width: '100%'
  },
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
  content: {},
  tabTextContainer: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    margin: 4,
    flex: 1
  },
  tabText: {}
})
