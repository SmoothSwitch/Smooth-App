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
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

/* ────────────── helpers ────────────── */

const CARRIERS = [
  { name: 'CARRIER A', score: 95, color: '#10B981', filled: 5 },
  { name: 'CARRIER B', score: 82, color: '#2196F3', filled: 5 },
  { name: 'CARRIER C', score: 48, color: '#F59E0B', filled: 4 },
];

/* ────── Circular Progress Ring ────── */

function ProgressRing({ size = 80, strokeWidth = 6, progress, color, score }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {/* track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text
        style={{
          position: 'absolute',
          fontFamily: 'Gilroy-Bold',
          fontSize: 20,
          color: '#1A1A2E',
        }}
      >
        {score}
      </Text>
    </View>
  );
}

/* ────── Signal Bars ────── */

function SignalBars({ filled, color }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginTop: 6 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            width: 7,
            height: 10,
            borderRadius: 2,
            backgroundColor: i <= filled ? color : '#E5E7EB',
          }}
        />
      ))}
    </View>
  );
}

/* ────────────── component ────────────── */

export default function NIELiveQualityScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
      >
        {/* ──────── HEADER ──────── */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-3">
          <View className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={24}
              color="#2196F3"
            />
            <Text
              className="text-xl text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              NIE Live Quality
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.6}>
            <Feather name="refresh-cw" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* ──────── DIVIDER ──────── */}
        <View className="h-px bg-[#F3F4F6] mx-5" />

        {/* ──────── NETWORK SCORING ──────── */}
        <View className="px-5 mt-5">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-2xl text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              Network Scoring
            </Text>
            <View
              className="rounded-full px-3 py-1"
              style={{ backgroundColor: '#EBF5FF' }}
            >
              <Text
                className="text-xs text-[#2196F3]"
                style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 1 }}
              >
                LIVE
              </Text>
            </View>
          </View>

          {/* ──── Carrier Score Cards ──── */}
          <View className="flex-row justify-between mt-6 gap-3">
            {CARRIERS.map((c) => (
              <View
                key={c.name}
                className="flex-1 items-center rounded-2xl py-5"
                style={{
                  backgroundColor: '#FAFBFC',
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                }}
              >
                <ProgressRing
                  progress={c.score}
                  color={c.color}
                  score={c.score}
                />
                <Text
                  className="text-[11px] text-[#6B7280] mt-3"
                  style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 0.8 }}
                >
                  {c.name}
                </Text>
                <SignalBars filled={c.filled} color={c.color} />
              </View>
            ))}
          </View>
        </View>

        {/* ──────── CONNECTION DETAILS ──────── */}
        <View className="px-5 mt-8">
          <Text
            className="text-base text-[#6B7280] mb-4"
            style={{ fontFamily: 'Gilroy-SemiBold' }}
          >
            Connection Details
          </Text>

          {/* Download Speed Card */}
          <View
            className="flex-row items-center rounded-2xl px-4 py-4 mb-3"
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#F3F4F6',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#ECFDF5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="cloud-download-outline"
                size={22}
                color="#10B981"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text
                className="text-base text-[#1A1A2E]"
                style={{ fontFamily: 'Gilroy-Bold' }}
              >
                Download Speed
              </Text>
              <Text
                className="text-xs text-[#9CA3AF] mt-0.5"
                style={{ fontFamily: 'Gilroy-Regular' }}
              >
                Peak Performance
              </Text>
            </View>
            <View className="flex-row items-baseline">
              <Text
                className="text-2xl text-[#1A1A2E]"
                style={{ fontFamily: 'Gilroy-Bold' }}
              >
                142.5
              </Text>
              <Text
                className="text-sm text-[#6B7280] ml-1"
                style={{ fontFamily: 'Gilroy-Medium' }}
              >
                Mbps
              </Text>
            </View>
          </View>

          {/* Latency Card */}
          <View
            className="flex-row items-center rounded-2xl px-4 py-4"
            style={{
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#F3F4F6',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 4,
              elevation: 1,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: '#EBF5FF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name="swap-vertical"
                size={22}
                color="#2196F3"
              />
            </View>
            <View className="flex-1 ml-3">
              <Text
                className="text-base text-[#1A1A2E]"
                style={{ fontFamily: 'Gilroy-Bold' }}
              >
                Latency (Ping)
              </Text>
              <Text
                className="text-xs text-[#9CA3AF] mt-0.5"
                style={{ fontFamily: 'Gilroy-Regular' }}
              >
                Stability Index
              </Text>
            </View>
            <View className="flex-row items-baseline">
              <Text
                className="text-2xl text-[#2196F3]"
                style={{ fontFamily: 'Gilroy-Bold' }}
              >
                24
              </Text>
              <Text
                className="text-sm text-[#2196F3] ml-1"
                style={{ fontFamily: 'Gilroy-Medium' }}
              >
                ms
              </Text>
            </View>
          </View>
        </View>

        {/* ──────── NETWORK OPTIMIZED BANNER ──────── */}
        <View className="px-5 mt-6">
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 20,
              overflow: 'hidden',
            }}
          >
            {/* Decorative circle — right side */}
            <View
              style={{
                position: 'absolute',
                right: -20,
                bottom: -20,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(255,255,255,0.12)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                right: 10,
                bottom: 10,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255,255,255,0.08)',
              }}
            />

            <Text
              className="text-xl text-white"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              Network Optimized
            </Text>
            <Text
              className="text-sm text-white/80 mt-2 leading-5"
              style={{ fontFamily: 'Gilroy-Regular' }}
            >
              Switching to Carrier A for optimal streaming{'\n'}performance.
            </Text>
          </LinearGradient>
        </View>

        {/* ──────── SPACER ──────── */}
        <View className="flex-1" />

        {/* ──────── OBSERVATION STATUS BAR ──────── */}
        <View className="flex-row items-start px-5 mt-8 mb-2 gap-2">
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#10B981',
              marginTop: 4,
            }}
          />
          <Text
            className="text-sm text-[#6B7280] flex-1 leading-5"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            <Text style={{ fontFamily: 'Gilroy-Bold', color: '#1A1A2E' }}>
              Observation:
            </Text>{' '}
            All carriers stable. Handover successful at 14:02 UTC.
          </Text>
        </View>
      </ScrollView>

      {/* ──────── BOTTOM TAB BAR ──────── */}
      <View
        className="flex-row items-center justify-around py-3 bg-white"
        style={{
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        {/* Home — active */}
        <TouchableOpacity activeOpacity={0.7} className="items-center">
          <Ionicons name="home" size={22} color="#2196F3" />
          <Text
            className="text-[10px] text-[#2196F3] mt-1"
            style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 0.6 }}
          >
            HOME
          </Text>
        </TouchableOpacity>

        {/* Analytics */}
        <TouchableOpacity activeOpacity={0.7} className="items-center">
          <Ionicons name="bar-chart-outline" size={22} color="#9CA3AF" />
          <Text
            className="text-[10px] text-[#9CA3AF] mt-1"
            style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 0.6 }}
          >
            ANALYTICS
          </Text>
        </TouchableOpacity>

        {/* Logs */}
        <TouchableOpacity activeOpacity={0.7} className="items-center">
          <Ionicons name="document-text-outline" size={22} color="#9CA3AF" />
          <Text
            className="text-[10px] text-[#9CA3AF] mt-1"
            style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 0.6 }}
          >
            LOGS
          </Text>
        </TouchableOpacity>

        {/* Config */}
        <TouchableOpacity activeOpacity={0.7} className="items-center">
          <Ionicons name="settings-outline" size={22} color="#9CA3AF" />
          <Text
            className="text-[10px] text-[#9CA3AF] mt-1"
            style={{ fontFamily: 'Gilroy-Bold', letterSpacing: 0.6 }}
          >
            CONFIG
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
