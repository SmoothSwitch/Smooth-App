import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome5,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/logo.svg';

/* ────────────── component ────────────── */

export default function OnboardingCompleteScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ──────── HEADER ──────── */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-2">
        {/* Logo + Name */}
        <View className="flex-row items-center gap-2">
          <Logo width={32} height={32} />
          <Text
            className="text-base text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            SmoothSwitch
          </Text>
        </View>

        {/* Verified Badge */}
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: '#ECFDF5',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons
            name="check-decagram"
            size={22}
            color="#10B981"
          />
        </View>
      </View>

      {/* ──────── HERO GRADIENT CARD ──────── */}
      <View className="mx-5 mt-4">
        <LinearGradient
          colors={['#E0F7F0', '#E8F5E9', '#F0FAF5', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 20,
            paddingTop: 32,
            paddingBottom: 24,
            paddingHorizontal: 20,
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Decorative celebration icon — top left */}
          <View style={{ position: 'absolute', top: 20, left: 20 }}>
            <MaterialCommunityIcons
              name="party-popper"
              size={28}
              color="#4DB6AC"
              style={{ opacity: 0.6 }}
            />
          </View>

          {/* Decorative sparkle — top right */}
          <View style={{ position: 'absolute', top: 28, right: 50 }}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={18}
              color="#80CBC4"
              style={{ opacity: 0.5 }}
            />
          </View>

          {/* Decorative star — middle right */}
          <View style={{ position: 'absolute', top: 80, right: 30 }}>
            <MaterialCommunityIcons
              name="star-four-points-outline"
              size={24}
              color="#A5D6A7"
              style={{ opacity: 0.4 }}
            />
          </View>

          {/* Large green checkmark circle */}
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: '#10B981',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <MaterialCommunityIcons
              name="check-bold"
              size={44}
              color="#FFFFFF"
            />
          </View>

          {/* Title */}
          <Text
            className="text-[26px] text-[#1A1A2E] text-center mt-6 leading-8"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            SmoothSwitch is{'\n'}now fully active
          </Text>

          {/* Subtitle */}
          <Text
            className="text-sm text-[#6B7280] text-center mt-3 leading-5 px-2"
            style={{ fontFamily: 'Gilroy-Regular' }}
          >
            Setup complete! Your device is optimized{'\n'}and running at peak
            performance.
          </Text>
        </LinearGradient>
      </View>

      {/* ──────── CURRENT MODE CARD ──────── */}
      <View
        className="mx-5 mt-5 rounded-2xl bg-white px-4 py-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        {/* Label */}
        <Text
          className="text-[11px] text-[#2196F3] tracking-wider mb-2"
          style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 1.2 }}
        >
          CURRENT MODE
        </Text>

        <View className="flex-row items-center">
          {/* Robot icon */}
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: '#EBF5FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="robot-outline"
              size={22}
              color="#2196F3"
            />
          </View>

          {/* Mode text */}
          <View className="flex-1 ml-3">
            <Text
              className="text-base text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              Full Auto Mode
            </Text>
            <View className="flex-row items-center mt-0.5">
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#10B981',
                  marginRight: 5,
                }}
              />
              <Text
                className="text-xs text-[#10B981]"
                style={{ fontFamily: 'Gilroy-SemiBold' }}
              >
                ACTIVE NOW
              </Text>
            </View>
          </View>

          {/* Settings gear */}
          <TouchableOpacity activeOpacity={0.6}>
            <Feather name="settings" size={22} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ──────── FEATURE BADGES ──────── */}
      <View className="flex-row mx-5 mt-4 gap-3">
        {/* Battery Optimized */}
        <View
          className="flex-1 flex-row items-center rounded-xl px-3 py-3"
          style={{
            backgroundColor: '#F9FAFB',
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <Ionicons
            name="battery-charging-outline"
            size={18}
            color="#6B7280"
          />
          <Text
            className="text-xs text-[#374151] ml-2"
            style={{ fontFamily: 'Gilroy-SemiBold' }}
          >
            Battery{'\n'}Optimized
          </Text>
        </View>

        {/* Max Speed */}
        <View
          className="flex-1 flex-row items-center rounded-xl px-3 py-3"
          style={{
            backgroundColor: '#F9FAFB',
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <MaterialCommunityIcons
            name="speedometer"
            size={18}
            color="#6B7280"
          />
          <Text
            className="text-xs text-[#374151] ml-2"
            style={{ fontFamily: 'Gilroy-SemiBold' }}
          >
            Max Speed
          </Text>
        </View>
      </View>

      {/* ──────── SPACER ──────── */}
      <View className="flex-1" />

      {/* ──────── GO TO DASHBOARD BUTTON ──────── */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-[#2196F3] rounded-2xl py-4 flex-row items-center justify-center"
          style={{
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text
            className="text-white text-base mr-2"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Go to Dashboard
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ──────── FINISH LATER ──────── */}
      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center mt-4"
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text
          className="text-sm text-[#6B7280]"
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          Finish Later
        </Text>
      </TouchableOpacity>

      {/* ──────── BOTTOM STATUS BAR ──────── */}
      <View className="flex-row items-center justify-center mt-6 pb-8 gap-6">
        {/* Settings Synced */}
        <View className="flex-row items-center gap-1.5">
          <MaterialCommunityIcons
            name="cloud-check-outline"
            size={16}
            color="#9CA3AF"
          />
          <Text
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Settings Synced
          </Text>
        </View>

        {/* Connection Secure */}
        <View className="flex-row items-center gap-1.5">
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={16}
            color="#9CA3AF"
          />
          <Text
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Connection Secure
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
