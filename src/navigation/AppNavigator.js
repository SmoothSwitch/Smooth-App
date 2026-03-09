import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../features/onboarding/SplashScreen';
import CreateAccountScreen from '../features/auth/CreateAccountScreen';
import VerifyNumberScreen from '../features/auth/VerifyNumberScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="VerifyNumber" component={VerifyNumberScreen} />
    </Stack.Navigator>
  );
}
