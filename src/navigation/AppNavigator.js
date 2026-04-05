import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WalletScreen from '../features/dashboard/WalletScreen';
import TopUpScreen    from '../features/dashboard/TopUpScreen';
import AddFundsScreen           from '../features/dashboard/AddFundsScreen';
import TransactionHistoryScreen from '../features/dashboard/TransactionHistoryScreen';
import SIMManagerScreen         from '../features/dashboard/SIMManagerScreen';
import ActivateESIMScreen       from '../features/dashboard/ActivateESIMScreen';
import SIMSettingsScreen        from '../features/dashboard/SIMSettingsScreen';
import AreaAdvisoryMapScreen    from '../features/dashboard/AreaAdvisoryMapScreen';
import AreaAnalysisScreen       from '../features/dashboard/AreaAnalysisScreen';
import SettingsHomeScreen       from '../features/dashboard/SettingsHomeScreen';
import AccountProfileScreen     from '../features/dashboard/AccountProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Wallet"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Wallet" component={WalletScreen} />
        <Stack.Screen name="TopUp"     component={TopUpScreen}    />
        <Stack.Screen name="AddFunds"           component={AddFundsScreen}           />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
        <Stack.Screen name="SIMManager"         component={SIMManagerScreen}         />
        <Stack.Screen name="ActivateESIM"       component={ActivateESIMScreen}       />
        <Stack.Screen name="SIMSettings"        component={SIMSettingsScreen}        />
        <Stack.Screen name="AreaAdvisoryMap"    component={AreaAdvisoryMapScreen}    />
        <Stack.Screen name="AreaAnalysis"        component={AreaAnalysisScreen}        />
        <Stack.Screen name="SettingsHome"         component={SettingsHomeScreen}         />
        <Stack.Screen name="AccountProfile"       component={AccountProfileScreen}       />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
