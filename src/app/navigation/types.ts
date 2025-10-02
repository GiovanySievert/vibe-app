import { NavigationProp, NavigatorScreenParams,RouteProp } from '@react-navigation/native'

export enum TabRoutesName {
  HOME = 'Home',
  MENU = 'Menu'
}

export type UnathenticatedStackParamList = {
  AuthScreen: undefined
  SignInScreen: undefined
}

export type AuthenticatedStackParamList = {
  HomeScreen: undefined
  UserMenuScreen: undefined
}

export type AppNavigatorRootParamsList = {
  TabsNavigator: NavigatorScreenParams<AuthenticatedStackParamList>
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
