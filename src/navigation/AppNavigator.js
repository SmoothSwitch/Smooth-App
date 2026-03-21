import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingCompleteScreen from '../features/onboarding/OnboardingCompleteScreen'

import SplashScreen from '../features/onboarding/SplashScreen'
import CreateAccountScreen from '../features/onboarding/CreateAccountScreen'
import VerifyNumberScreen from '../features/onboarding/VerifyNumberScreen'
import ScanningNetworksScreen from '../features/onboarding/ScanningNetworksScreen'
import NIEDemoScreen from '../features/onboarding/NIEDemoScreen'
import WatchBothSIMsScreen from '../features/onboarding/WatchBothSIMsScreen'
import EnableSmartModeScreen from '../features/onboarding/EnableSmartModeScreen'
import StayProtectedScreen from '../features/onboarding/StayProtectedScreen'
import NIELiveQualityScreen from '../features/network/NIELiveQualityScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName='Splash'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Splash' component={SplashScreen} />
      <Stack.Screen name='CreateAccount' component={CreateAccountScreen} />
      <Stack.Screen name='VerifyNumber' component={VerifyNumberScreen} />
      <Stack.Screen
        name='ScanningNetworks'
        component={ScanningNetworksScreen}
      />
      <Stack.Screen name='NIEDemo' component={NIEDemoScreen} />
      <Stack.Screen name='WatchBothSIMs' component={WatchBothSIMsScreen} />
      <Stack.Screen name='EnableSmartMode' component={EnableSmartModeScreen} />
      <Stack.Screen name='StayProtected' component={StayProtectedScreen} />
      <Stack.Screen
        name='OnboardingComplete'
        component={OnboardingCompleteScreen}
      />
      <Stack.Screen name='NIELiveQuality' component={NIELiveQualityScreen} />
    </Stack.Navigator>
  )
}
