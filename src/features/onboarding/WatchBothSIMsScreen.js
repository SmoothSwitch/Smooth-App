import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/* ────────────── Signal Bar component ────────────── */

function SignalBars({ filled, total, filledColor, emptyColor }) {
  const bars = [];
  const baseHeight = 18;
  const step = 10;

  for (let i = 0; i < total; i++) {
    const height = baseHeight + i * step;
    bars.push(
      <View
        key={i}
        style={{
          width: 36,
          height,
          borderRadius: 6,
          backgroundColor: i < filled ? filledColor : emptyColor,
          marginRight: i < total - 1 ? 8 : 0,
        }}
      />,
    );
  }

  return (
    <View className="flex-row items-end mt-4">
      {bars}
    </View>
  );
}

/* ────────────── component ────────────── */

export default function WatchBothSIMsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-[#F4F6FB]"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      {/* ──────── HEADER ──────── */}
      <View className="flex-row items-center px-5 pt-14 pb-2">
        <TouchableOpacity activeOpacity={0.6} className="absolute left-5 z-10">
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text
            className="text-lg text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            SmoothSwitch
          </Text>
        </View>
      </View>

      {/* ──────── PROGRESS DOTS ──────── */}
      <View className="flex-row items-center justify-center mt-4 gap-2">
        {/* Dot 1 — inactive */}
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
        {/* Dot 2 — active (wider pill) */}
        <View
          style={{
            width: 28,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#2196F3',
          }}
        />
        {/* Dot 3 — inactive */}
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
      </View>

      {/* ──────── TITLE ──────── */}
      <View className="px-5 mt-6">
        <Text
          className="text-[28px] text-[#1A1A2E] text-center leading-9"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          Watch both SIMs
        </Text>
        <Text
          className="text-sm text-[#6B7280] text-center mt-3 leading-5 px-4"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          To monitor both your signal levels,{'\n'}SmoothSwitch needs to see your SIM info.
        </Text>
      </View>

      {/* ──────── SIGNAL CARD ──────── */}
      <View
        className="mx-5 mt-6 rounded-2xl bg-white px-5 pt-5 pb-6"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {/* — SIM 1 — */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="sim" size={22} color="#2196F3" />
            <Text
              className="text-base text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              SIM 1 (Blue)
            </Text>
          </View>
          <Text
            className="text-base"
            style={{ fontFamily: 'Gilroy-Bold', color: '#2196F3' }}
          >
            Excellent
          </Text>
        </View>

        <SignalBars
          filled={5}
          total={5}
          filledColor="#2196F3"
          emptyColor="#E5E7EB"
        />

        <View className="flex-row items-center mt-3 gap-1">
          <Ionicons name="trending-up" size={16} color="#10B981" />
          <Text
            className="text-sm"
            style={{ fontFamily: 'Gilroy-SemiBold', color: '#10B981' }}
          >
            +12% Stability
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px bg-[#F3F4F6] my-5" />

        {/* — SIM 2 — */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons name="sim" size={22} color="#10B981" />
            <Text
              className="text-base text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              SIM 2 (Green)
            </Text>
          </View>
          <Text
            className="text-base"
            style={{ fontFamily: 'Gilroy-Bold', color: '#10B981' }}
          >
            Good
          </Text>
        </View>

        <SignalBars
          filled={3}
          total={5}
          filledColor="#10B981"
          emptyColor="#E5E7EB"
        />

        <View className="flex-row items-center mt-3 gap-1">
          <Ionicons name="trending-down" size={16} color="#EF4444" />
          <Text
            className="text-sm"
            style={{ fontFamily: 'Gilroy-SemiBold', color: '#EF4444' }}
          >
            -5% Interruption
          </Text>
        </View>
      </View>

      {/* ──────── FEATURE ROWS ──────── */}
      <View className="px-5 mt-8 gap-5">
        {/* Real-time balancing */}
        <View className="flex-row items-start gap-3">
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#EBF5FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="monitor-cellphone"
              size={20}
              color="#2196F3"
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-base text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              Real-time balancing
            </Text>
            <Text
              className="text-sm text-[#6B7280] mt-1 leading-5"
              style={{ fontFamily: 'Gilroy-Regular' }}
            >
              Switch intelligently between providers{'\n'}based on signal strength.
            </Text>
          </View>
        </View>

        {/* Private & Secure */}
        <View className="flex-row items-start gap-3">
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: '#ECFDF5',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialCommunityIcons
              name="shield-check"
              size={20}
              color="#10B981"
            />
          </View>
          <View className="flex-1">
            <Text
              className="text-base text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              Private & Secure
            </Text>
            <Text
              className="text-sm text-[#6B7280] mt-1 leading-5"
              style={{ fontFamily: 'Gilroy-Regular' }}
            >
              Your SIM identification data never leaves{'\n'}this device.
            </Text>
          </View>
        </View>
      </View>

      {/* ──────── SPACER ──────── */}
      <View className="flex-1" />

      {/* ──────── ALLOW BUTTON ──────── */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-[#2196F3] rounded-2xl py-4 flex-row items-center justify-center gap-2"
          style={{
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Allow Signal Monitoring
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ──────── MAYBE LATER ──────── */}
      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center mt-4 pb-8"
      >
        <Text
          className="text-sm text-[#6B7280]"
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          Maybe later
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
