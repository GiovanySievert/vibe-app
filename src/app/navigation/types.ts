import { NavigatorScreenParams } from '@react-navigation/native'

export enum TabRoutesName {
  HOME = 'Home',
  MENU = 'Perfil',
  SOCIAL = 'Social'
}

export type UnathenticatedStackParamList = {
  AuthScreen: undefined
  SignInScreen: undefined
  ForgotPasswordScreen: {
    typedEmail?: string
  }
}

export type TabsNavigatorParamsList = {
  HomeScreen: undefined
  UserMenuScreen: undefined
  SocialScreen: undefined
}

export type ModalNavigatorParamsList = {
  PlacesDetailsScreen: { placeId: string }
  SearchScreen: undefined
  LocationModal: undefined
}

export type AuthenticatedStackParamList = {
  Tabs: NavigatorScreenParams<TabsNavigatorParamsList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
}

export type AppNavigatorRootParamsList = {
  TabsNavigator: NavigatorScreenParams<AuthenticatedStackParamList>
  UnathenticatedStack: NavigatorScreenParams<UnathenticatedStackParamList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
}

// export type GlobalStackParamList = ModalNavigatorParamsList & {
//   MainApp: NavigatorScreenParams<AppNavigatorRootParamsList>
// }

// export type GlobalNavigationProps<Screen extends keyof RootStackParamList> = {
//   navigation: NavigationProp<RootStackParamList>
//   route: RouteProp<RootStackParamList, Screen>
// }
