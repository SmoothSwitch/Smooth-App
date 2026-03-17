import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import Logo from '../../assets/images/logo.svg';

/**
 * SplashScreen – onboarding / landing screen.
 * Uses ScrollView as the root container and NativeWind for all styling.
 * No web-only HTML tags – fully compatible with Android.
 */
export default function SplashScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView className="flex-1 bg-[#F4F6FB]">
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      {/* ──────────────── HEADER ──────────────── */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
        {/* Logo + brand */}
        <View className="flex-row items-center gap-2">
          <Logo width={80} height={80} />
          <Text className="text-lg font-bold text-[#1A1A2E]">SmoothSwitch</Text>
        </View>

        {/* Get Started pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-[#2196F3] rounded-full px-5 py-2"
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text className="text-white text-sm font-semibold">Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* ──────────────── HERO ILLUSTRATION CARD ──────────────── */}
      <View className="mx-5 mt-4 rounded-3xl overflow-hidden"
        style={{
          backgroundColor: '#D6F0EC',
        }}
      >
        {/* Gradient-ish background approximation via layered Views */}
        <View className="px-6 pt-8 pb-6 items-center">
          {/* Icon row */}
          <View className="flex-row items-center gap-4 mb-4">
            {/* SIM / network icon */}
            <View className="w-14 h-14 rounded-2xl bg-white/80 items-center justify-center shadow-sm">
              <MaterialCommunityIcons name="sim" size={28} color="#2196F3" />
            </View>

            {/* Animated dots */}
            <View className="flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-[#2196F3]" />
              <View className="w-2 h-2 rounded-full bg-[#2196F3] opacity-70" />
              <View className="w-2 h-2 rounded-full bg-[#2196F3] opacity-40" />
              <View className="w-2 h-2 rounded-full bg-[#2196F3] opacity-20" />
            </View>

            {/* Antenna / signal icon */}
            <View className="w-14 h-14 rounded-2xl bg-white/80 items-center justify-center shadow-sm">
              <MaterialCommunityIcons name="antenna" size={28} color="#2196F3" />
            </View>
          </View>

          {/* Status label */}
          <View className="flex-row items-center bg-white/70 rounded-full px-4 py-2 gap-2">
            <View className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
            <Text className="text-sm text-[#333] font-medium">
              Switching to optimal network…
            </Text>
          </View>
        </View>
      </View>

      {/* ──────────────── HERO TEXT ──────────────── */}
      <View className="px-5 mt-8">
        <Text className="text-3xl font-extrabold text-[#1A1A2E] text-center leading-10">
          Never lose your{'\n'}
          <Text className="text-[#2196F3]">connection</Text> again.
        </Text>
        <Text className="text-center text-[#6B7280] mt-3 text-base leading-6 px-4">
          Intelligent switching between your SIM cards for the best network quality,
          guaranteed.
        </Text>
      </View>

      {/* ──────────────── CTA BUTTONS ──────────────── */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-[#2196F3] rounded-full py-4 items-center shadow-lg shadow-blue-300"
          onPress={() => navigation.navigate('CreateAccount')}
        >
          <Text className="text-white text-base font-bold">Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="mt-4 items-center py-2"
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text className="text-[#1A1A2E] text-base font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* ──────────────── FEATURE CARDS ──────────────── */}
      <View className="px-5 mt-10 gap-4">
        {/* Zero Latency */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="w-12 h-12 rounded-2xl bg-[#EBF5FF] items-center justify-center mb-3">
            <Ionicons name="flash" size={24} color="#2196F3" />
          </View>
          <Text className="text-lg font-bold text-[#1A1A2E] mb-1">Zero Latency</Text>
          <Text className="text-sm text-[#6B7280] leading-5">
            Seamless switching without dropping active calls or data streams.
          </Text>
        </View>

        {/* AI-Driven */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="w-12 h-12 rounded-2xl bg-[#F0EAFF] items-center justify-center mb-3">
            <MaterialCommunityIcons name="creation" size={24} color="#7C3AED" />
          </View>
          <Text className="text-lg font-bold text-[#1A1A2E] mb-1">AI-Driven</Text>
          <Text className="text-sm text-[#6B7280] leading-5">
            Our algorithms learn your coverage patterns to predict dead zones.
          </Text>
        </View>

        {/* Power Efficient */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="w-12 h-12 rounded-2xl bg-[#E8F9EF] items-center justify-center mb-3">
            <Feather name="battery-charging" size={24} color="#10B981" />
          </View>
          <Text className="text-lg font-bold text-[#1A1A2E] mb-1">Power Efficient</Text>
          <Text className="text-sm text-[#6B7280] leading-5">
            Optimized to maintain dual connectivity with minimal battery impact.
          </Text>
        </View>
      </View>

      {/* ──────────────── FOOTER ──────────────── */}
      <View className="items-center mt-12 mb-8">
        <Text className="text-xs text-[#9CA3AF]">
          © 2026 SmoothSwitch Inc. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
