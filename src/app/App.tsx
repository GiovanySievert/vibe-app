import 'react-native-gesture-handler'

import { MainAppNavigator } from './navigation'
import { RootProvider } from './providers'

export default function App() {
  return (
    <RootProvider>
      <MainAppNavigator />
    </RootProvider>
  )
}
