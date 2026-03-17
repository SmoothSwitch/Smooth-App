import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ────────────── component ────────────── */

export default function EnableSmartModeScreen() {
  const navigation = useNavigation();
  const [toggleOn, setToggleOn] = useState(true);

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
        {/* Dot 1 */}
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
        {/* Dot 2 */}
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
        {/* Dot 3 — active pill */}
        <View
          style={{
            width: 28,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#2196F3',
          }}
        />
        {/* Dot 4 */}
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#D1D5DB',
          }}
        />
      </View>

      {/* ──────── SPARKLE ICON ──────── */}
      <View className="items-center mt-8">
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 22,
            backgroundColor: '#EBF5FF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MaterialCommunityIcons
            name="creation"
            size={42}
            color="#2196F3"
          />
        </View>
      </View>

      {/* ──────── TITLE ──────── */}
      <View className="px-5 mt-6">
        <Text
          className="text-[28px] text-[#1A1A2E] text-center leading-9"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          Enable Smart Mode
        </Text>
        <Text
          className="text-sm text-[#6B7280] text-center mt-3 leading-5 px-4"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Smart Mode lets SmoothSwitch switch{'\n'}automatically—you never touch Settings{'\n'}again.
        </Text>
      </View>

      {/* ──────── ACCESSIBILITY SERVICE CARD ──────── */}
      <View
        className="mx-5 mt-8 rounded-2xl bg-white px-4 pt-4 pb-5"
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
        {/* Row: icon + text + toggle */}
        <View className="flex-row items-center">
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
              name="human-greeting-variant"
              size={22}
              color="#2196F3"
            />
          </View>

          <View className="flex-1 ml-3">
            <Text
              className="text-base text-[#1A1A2E]"
              style={{ fontFamily: 'Gilroy-Bold' }}
            >
              Accessibility Service
            </Text>
            <Text
              className="text-xs text-[#6B7280] mt-0.5"
              style={{ fontFamily: 'Gilroy-Regular' }}
            >
              Automation active
            </Text>
          </View>

          <Switch
            value={toggleOn}
            onValueChange={setToggleOn}
            trackColor={{ false: '#D1D5DB', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Grey placeholder lines */}
        <View className="mt-4 gap-2.5">
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#F3F4F6',
              width: '100%',
            }}
          />
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#F3F4F6',
              width: '70%',
            }}
          />
        </View>
      </View>

      {/* ──────── BATTERY EFFICIENT CARD ──────── */}
      <View
        className="mx-5 mt-4 rounded-2xl px-4 py-4 flex-row items-start gap-3"
        style={{ backgroundColor: '#ECFDF5' }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#10B981',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
        </View>
        <View className="flex-1">
          <Text
            className="text-base text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Battery Efficient
          </Text>
          <Text
            className="text-sm text-[#6B7280] mt-1 leading-5"
            style={{ fontFamily: 'Gilroy-Regular' }}
          >
            Uses less than 1% battery daily for background automation.
          </Text>
        </View>
      </View>

      {/* ──────── SPACER ──────── */}
      <View className="flex-1" />

      {/* ──────── ENABLE BUTTON ──────── */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-[#2196F3] rounded-2xl py-4 items-center"
          style={{
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate('StayProtected')}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Enable Smart Mode
          </Text>
        </TouchableOpacity>
      </View>

      {/* ──────── I'LL DO THIS LATER ──────── */}
      <TouchableOpacity
        activeOpacity={0.6}
        className="items-center mt-4 pb-8"
        onPress={() => navigation.navigate('StayProtected')}
      >
        <Text
          className="text-sm text-[#6B7280]"
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          I'll do this later
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
