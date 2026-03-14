import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

/* ────────────── component ────────────── */

export default function StayProtectedScreen() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
            Onboarding
          </Text>
        </View>
      </View>

      {/* ──────── PROGRESS DOTS ──────── */}
      <View className="flex-row items-center justify-center mt-4 gap-2">
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
        {/* Dot 4 — active pill */}
        <View
          style={{
            width: 28,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#2196F3',
          }}
        />
      </View>

      {/* ──────── TITLE ──────── */}
      <View className="px-5 mt-8">
        <Text
          className="text-[28px] text-[#1A1A2E] text-center leading-9"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          Stay protected 24/7
        </Text>
        <Text
          className="text-sm text-[#6B7280] text-center mt-3 leading-5 px-2"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Without this, SmoothSwitch goes to sleep{'\n'}after 20 minutes and can't protect your{'\n'}calls.
        </Text>
      </View>

      {/* ──────── COMPARISON CARDS ──────── */}
      <View className="px-5 mt-8 gap-4">
        {/* ── INACTIVE CARD ── */}
        <View
          className="rounded-2xl bg-white px-4 py-5"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              {/* Badge */}
              <View className="flex-row items-center gap-1.5 mb-3">
                <Text
                  className="text-xs"
                  style={{ fontFamily: 'Gilroy-Bold', color: '#EF4444' }}
                >
                  INACTIVE
                </Text>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={16}
                  color="#EF4444"
                />
              </View>

              <Text
                className="text-base text-[#1A1A2E]"
                style={{ fontFamily: 'Gilroy-Bold' }}
              >
                Without Battery Guard
              </Text>
              <Text
                className="text-sm text-[#6B7280] mt-1"
                style={{ fontFamily: 'Gilroy-Regular' }}
              >
                App sleeps after 20 mins
              </Text>
            </View>

            {/* Red battery icon */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: '#FEE2E2',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            >
              <MaterialCommunityIcons
                name="battery-alert-variant-outline"
                size={28}
                color="#EF4444"
              />
            </View>
          </View>
        </View>

        {/* ── RECOMMENDED CARD ── */}
        <View
          className="rounded-2xl bg-white px-4 py-5"
          style={{
            borderWidth: 2,
            borderColor: '#2196F3',
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              {/* Badge */}
              <View className="flex-row items-center gap-1.5 mb-3">
                <Text
                  className="text-xs"
                  style={{ fontFamily: 'Gilroy-Bold', color: '#10B981' }}
                >
                  RECOMMENDED
                </Text>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={16}
                  color="#10B981"
                />
              </View>

              <Text
                className="text-base text-[#1A1A2E]"
                style={{ fontFamily: 'Gilroy-Bold' }}
              >
                With Battery Guard
              </Text>
              <Text
                className="text-sm text-[#6B7280] mt-1"
                style={{ fontFamily: 'Gilroy-Regular' }}
              >
                Active & Protected 24/7
              </Text>
            </View>

            {/* Green shield icon */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: '#D1FAE5',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 12,
              }}
            >
              <MaterialCommunityIcons
                name="shield-heart-outline"
                size={28}
                color="#10B981"
              />
            </View>
          </View>
        </View>
      </View>

      {/* ──────── INFO CARD ──────── */}
      <View
        className="mx-5 mt-5 rounded-2xl px-4 py-4 flex-row items-start gap-3"
        style={{ backgroundColor: '#F4F6FB' }}
      >
        <Ionicons
          name="information-circle-outline"
          size={22}
          color="#2196F3"
          style={{ marginTop: 1 }}
        />
        <Text
          className="flex-1 text-sm text-[#6B7280] leading-5"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Disabling optimization allows the app to respond immediately to incoming network changes.
        </Text>
      </View>

      {/* ──────── SPACER ──────── */}
      <View className="flex-1" />

      {/* ──────── OPEN BATTERY SETTINGS BUTTON ──────── */}
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
            Open Battery Settings
          </Text>
          <MaterialCommunityIcons name="cog-outline" size={20} color="#FFFFFF" />
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
