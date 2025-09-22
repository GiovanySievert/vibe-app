import { NavigationProp, RouteProp, NavigatorScreenParams } from '@react-navigation/native'

export enum TabRoutesName {
  HOME = 'Home',
  // APPOINTMENTS = 'Agendamentos',
  MENU = 'Menu'
}

export type UnathenticatedStackParamList = {
  AuthScreen: undefined
}

export type AuthenticatedStackParamList = {
  HomeScreen: undefined
  ProfileScreen: undefined
}

export type RootStackParamList = {
  AuthenticatedTab: NavigatorScreenParams<AuthenticatedStackParamList>
}

export type AppNavigatorRootParamsList = {
  TabsNavigator: NavigatorScreenParams<RootStackParamList>
  UnathenticatedStack: NavigatorScreenParams<UnathenticatedStackParamList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
}

export type ModalNavigatorParamsList = {
  LocationModal: {
    onChange?: () => void
  }
}

export type GlobalStackParamList = ModalNavigatorParamsList & {
  MainApp: NavigatorScreenParams<AppNavigatorRootParamsList>
}

export type GlobalNavigationProps<Screen extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, Screen>
}
