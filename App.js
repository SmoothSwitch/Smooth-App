import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Gilroy-Bold': require('./src/assets/fonts/Gilroy-Bold.ttf'),
    'Gilroy-Heavy': require('./src/assets/fonts/Gilroy-Heavy.ttf'),
    'Gilroy-Light': require('./src/assets/fonts/Gilroy-Light.ttf'),
    'Gilroy-Medium': require('./src/assets/fonts/Gilroy-Medium.ttf'),
    'Gilroy-Regular': require('./src/assets/fonts/Gilroy-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 bg-[#F4F6FB] items-center justify-center">
        <ActivityIndicator size="large" color="#2196F3" />
        <Text className="mt-4 text-base text-[#6B7280]">Loading…</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
