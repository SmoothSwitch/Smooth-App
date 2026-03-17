import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ────────────── SIM data ────────────── */

const DETECTED_SIMS = [
  {
    id: '1',
    carrier: 'MTN',
    status: 'ACTIVE',
    statusColor: '#10B981',
    phone: '+234 81** *** **45',
    slotInfo: 'Slot 1 • Physical SIM',
    typeBadge: 'Physical',
    typeBadgeColor: '#6B7280',
    logoBg: '#FFCC00',
    logoTextColor: '#1A1A2E',
  },
  {
    id: '2',
    carrier: 'Airtel',
    status: 'STANDBY',
    statusColor: '#6B7280',
    phone: '+234 90** *** **12',
    slotInfo: 'eSIM • Digital Profile',
    typeBadge: 'eSIM',
    typeBadgeColor: '#F97316',
    logoBg: '#E42326',
    logoTextColor: '#FFFFFF',
  },
];

/* ────────────── component ────────────── */

export default function ScanningNetworksScreen() {
  const navigation = useNavigation();
  /* Pulsing ring animation */
  const pulse1 = useRef(new Animated.Value(0.6)).current;
  const pulse2 = useRef(new Animated.Value(0.4)).current;
  const pulse3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const createPulse = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 1400,
            useNativeDriver: true,
          }),
        ]),
      );

    const anim = Animated.parallel([
      createPulse(pulse1, 0),
      createPulse(pulse2, 300),
      createPulse(pulse3, 600),
    ]);
    anim.start();

    return () => anim.stop();
  }, [pulse1, pulse2, pulse3]);

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
            Detecting your SIMs
          </Text>
        </View>
      </View>

      {/* ──────── PULSING ANIMATION + SIM ICON ──────── */}
      <View className="items-center mt-8 mb-6">
        <View
          style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Outermost ring */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: '#FDEAD7',
              opacity: pulse3,
            }}
          />
          {/* Middle ring */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 156,
              height: 156,
              borderRadius: 78,
              backgroundColor: '#F9C9A3',
              opacity: pulse2,
            }}
          />
          {/* Inner ring */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 116,
              height: 116,
              borderRadius: 58,
              backgroundColor: '#F2994A',
              opacity: pulse1,
            }}
          />
          {/* Centre solid disc */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#F97316',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
            }}
          >
            <MaterialCommunityIcons name="sim" size={36} color="#FFFFFF" />
          </View>
        </View>

        {/* Title + subtitle */}
        <Text
          className="text-2xl text-[#1A1A2E] mt-5"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          Scanning Networks
        </Text>
        <Text
          className="text-sm text-[#6B7280] text-center mt-2 px-10 leading-5"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Please stay on this screen while we identify your{'\n'}available SIM cards.
        </Text>
      </View>

      {/* ──────── DETECTED SIMS HEADER ──────── */}
      <View className="flex-row items-center justify-between px-5 mt-4 mb-3">
        <Text
          className="text-xs text-[#6B7280] tracking-widest"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          DETECTED SIMS
        </Text>
        <View className="flex-row items-center gap-1">
          <View className="w-2 h-2 rounded-full bg-[#F97316]" />
          <Text
            className="text-sm text-[#F97316]"
            style={{ fontFamily: 'Gilroy-SemiBold' }}
          >
            {DETECTED_SIMS.length} Found
          </Text>
        </View>
      </View>

      {/* ──────── SIM CARDS ──────── */}
      <View className="px-5 gap-3">
        {DETECTED_SIMS.map((sim) => (
          <View
            key={sim.id}
            className="bg-white rounded-2xl px-4 py-4 flex-row items-center"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {/* Carrier logo */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: sim.logoBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Gilroy-ExtraBold',
                  fontSize: sim.carrier === 'MTN' ? 14 : 11,
                  color: sim.logoTextColor,
                }}
              >
                {sim.carrier === 'MTN' ? 'MTN' : 'airtel'}
              </Text>
            </View>

            {/* Info */}
            <View className="flex-1 ml-3">
              <View className="flex-row items-center gap-2">
                <Text
                  className="text-base text-[#1A1A2E]"
                  style={{ fontFamily: 'Gilroy-Bold' }}
                >
                  {sim.carrier}
                </Text>
                <View
                  className="flex-row items-center rounded-full px-2 py-0.5"
                  style={{ backgroundColor: sim.statusColor + '18' }}
                >
                  <View
                    className="w-1.5 h-1.5 rounded-full mr-1"
                    style={{ backgroundColor: sim.statusColor }}
                  />
                  <Text
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: 10,
                      color: sim.statusColor,
                    }}
                  >
                    {sim.status}
                  </Text>
                </View>
              </View>
              <Text
                className="text-sm text-[#6B7280] mt-0.5"
                style={{ fontFamily: 'Gilroy-Medium' }}
              >
                {sim.phone}
              </Text>
              <Text
                className="text-xs text-[#9CA3AF] mt-0.5"
                style={{ fontFamily: 'Gilroy-Regular' }}
              >
                {sim.slotInfo}
              </Text>
            </View>

            {/* Type badge */}
            <View
              className="rounded-full px-3 py-1.5"
              style={{
                borderWidth: 1,
                borderColor: sim.typeBadgeColor + '40',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontSize: 12,
                  color: sim.typeBadgeColor,
                }}
              >
                {sim.typeBadge}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ──────── SPACER ──────── */}
      <View className="flex-1" />

      {/* ──────── CONTINUE BUTTON ──────── */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-[#F97316] rounded-2xl py-4 items-center"
          style={{
            shadowColor: '#F97316',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => navigation.navigate('NIEDemo')}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* ──────── ADD MANUALLY LINK ──────── */}
      <View className="items-center mt-4 pb-8">
        <Text
          className="text-sm text-[#6B7280]"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Not seeing your SIM?{' '}
          <Text
            className="text-[#10B981]"
            style={{ fontFamily: 'Gilroy-Bold' }}
            onPress={() => {}}
          >
            Add manually
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}
