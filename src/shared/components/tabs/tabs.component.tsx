import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { PrimaryTabs } from './tabs-primary.component'
import { SecondaryTabs } from './tabs-secondary.component'

type TabProps = {
  titles: string[]
  children: React.ReactNode[]
  defaultIndex?: number
  onChange?: (index: number) => void
  variant?: 'primary' | 'secondary'
}

export const Tabs: React.FC<TabProps> = ({ titles, children, defaultIndex, onChange, variant = 'primary' }) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex || 0)

  useEffect(() => {
    if (defaultIndex !== undefined) {
      setActiveIndex(defaultIndex)
    }
  }, [defaultIndex])

  const handleTabPress = (index: number) => {
    setActiveIndex(index)
    onChange && onChange(index)
  }

  const renderContent = () => {
    return children.map((child, index) => (
      <View key={index} style={index === activeIndex ? styles.visible : styles.hidden}>
        {child}
      </View>
    ))
  }

  return (
    <View style={styles.tabsWrapper}>
      {variant === 'primary' ? (
        <PrimaryTabs titles={titles} activeIndex={activeIndex} onTabPress={handleTabPress} />
      ) : (
        <SecondaryTabs titles={titles} activeIndex={activeIndex} onTabPress={handleTabPress} />
      )}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  tabsWrapper: {
    justifyContent: 'center',
    width: '100%'
  },
  content: {},
  visible: {
    display: 'flex'
  },
  hidden: {
    display: 'none'
  }
})
