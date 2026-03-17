import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ────────────── constants ────────────── */

const MTN_LATENCY = 85;
const AIRTEL_LATENCY = 130;
const DIFFERENCE = AIRTEL_LATENCY - MTN_LATENCY; // 45
const PERCENT_DIFF = Math.round((DIFFERENCE / AIRTEL_LATENCY) * 100); // ~35

const MAX_BAR_HEIGHT = 140; // tallest bar px

/* ────────────── component ────────────── */

export default function NIEDemoScreen() {
  const navigation = useNavigation();
  const mtnBarHeight = (MTN_LATENCY / AIRTEL_LATENCY) * MAX_BAR_HEIGHT;
  const airtelBarHeight = MAX_BAR_HEIGHT;

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ──────── HEADER ──────── */}
      <View className="flex-row items-center px-5 pt-14 pb-2">
        <TouchableOpacity activeOpacity={0.6} className="absolute left-5 z-10">
          <Ionicons name="close" size={24} color="#1A1A2E" />
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

      {/* ──────── HERO TITLE ──────── */}
      <View className="px-5 mt-6">
        <Text
          className="text-[28px] text-[#1A1A2E] leading-9"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          You're leaving{' '}
          <Text style={{ color: '#2196F3', fontFamily: 'Gilroy-Bold' }}>
            {DIFFERENCE}ms
          </Text>
          {'\n'}on the table
        </Text>
        <Text
          className="text-sm text-[#6B7280] mt-3 leading-5"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Your MTN is at {MTN_LATENCY}ms RTT. Airtel is at{'\n'}
          {AIRTEL_LATENCY}ms.
        </Text>
      </View>

      {/* ──────── LATENCY CARD ──────── */}
      <View
        className="mx-5 mt-6 rounded-2xl px-5 pt-5 pb-6"
        style={{ backgroundColor: '#F4F6FB' }}
      >
        {/* Label */}
        <Text
          className="text-xs text-[#6B7280] tracking-widest"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          NETWORK LATENCY (RTT)
        </Text>

        {/* Difference headline */}
        <View className="flex-row items-baseline mt-2 gap-2">
          <Text
            className="text-2xl text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            {DIFFERENCE}ms Difference
          </Text>
          <Text
            className="text-sm"
            style={{ fontFamily: 'Gilroy-Bold', color: '#10B981' }}
          >
            -{PERCENT_DIFF}%
          </Text>
        </View>

        {/* ──── BAR CHART ──── */}
        <View className="flex-row items-end justify-center mt-6 gap-12">
          {/* MTN bar */}
          <View className="items-center">
            <View
              style={{
                width: 48,
                height: mtnBarHeight,
                borderRadius: 8,
                backgroundColor: '#2196F3',
              }}
            />
            <Text
              className="text-base text-[#1A1A2E] mt-3"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              {MTN_LATENCY}ms
            </Text>
            <Text
              className="text-sm text-[#6B7280] mt-1"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              MTN
            </Text>
          </View>

          {/* Airtel bar */}
          <View className="items-center">
            <View
              style={{
                width: 48,
                height: airtelBarHeight,
                borderRadius: 8,
                backgroundColor: '#CBD5E1',
              }}
            />
            <Text
              className="text-base text-[#1A1A2E] mt-3"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              {AIRTEL_LATENCY}ms
            </Text>
            <Text
              className="text-sm text-[#6B7280] mt-1"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              Airtel
            </Text>
          </View>
        </View>
      </View>

      {/* ──────── STAT CARDS ──────── */}
      <View className="flex-row px-5 mt-4 gap-3">
        {/* MTN card */}
        <View
          className="flex-1 rounded-2xl px-4 py-4"
          style={{ backgroundColor: '#F4F6FB' }}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <MaterialCommunityIcons
              name="swap-horizontal-circle"
              size={18}
              color="#2196F3"
            />
            <Text
              className="text-xs text-[#6B7280]"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              MTN Latency
            </Text>
          </View>
          <Text
            className="text-2xl text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            {MTN_LATENCY}ms
          </Text>
          <View className="flex-row items-center mt-1.5 gap-1">
            <Ionicons name="trending-down" size={14} color="#10B981" />
            <Text
              className="text-xs"
              style={{ fontFamily: 'Gilroy-SemiBold', color: '#10B981' }}
            >
              Better{'\n'}performance
            </Text>
          </View>
        </View>

        {/* Airtel card */}
        <View
          className="flex-1 rounded-2xl px-4 py-4"
          style={{ backgroundColor: '#F4F6FB' }}
        >
          <View className="flex-row items-center gap-1.5 mb-2">
            <MaterialCommunityIcons
              name="signal-cellular-3"
              size={18}
              color="#6B7280"
            />
            <Text
              className="text-xs text-[#6B7280]"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              Airtel Latency
            </Text>
          </View>
          <Text
            className="text-2xl text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            {AIRTEL_LATENCY}ms
          </Text>
          <Text
            className="text-xs text-[#9CA3AF] mt-1.5"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            +{DIFFERENCE}ms lag
          </Text>
        </View>
      </View>

      {/* ──────── SPACER ──────── */}
      <View className="flex-1" />

      {/* ──────── SHOW ME HOW BUTTON ──────── */}
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
          onPress={() => navigation.navigate('WatchBothSIMs')}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Show me how
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ──────── DISCLAIMER ──────── */}
      <View className="items-center mt-4 pb-8">
        <Text
          className="text-xs text-[#9CA3AF] text-center px-10"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Based on your current location and network traffic.
        </Text>
      </View>
    </ScrollView>
  );
}
