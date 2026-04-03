import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ─────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────── */

export default function NetworkSwitchSuccessScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ──────── HEADER ──────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={{ padding: 4 }}
        >
          <Ionicons name="close" size={26} color="#1A1A2E" />
        </TouchableOpacity>

        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: 18,
            color: '#1A1A2E',
          }}
        >
          Network Switch
        </Text>

        {/* Spacer to keep title centered */}
        <View style={{ width: 34 }} />
      </View>

      {/* ──────── HERO ILLUSTRATION ──────── */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 32,
        }}
      >
        {/* Decorative dots + main circle container */}
        <View
          style={{
            width: 260,
            height: 260,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          {/* Dot — top right */}
          <View
            style={{
              position: 'absolute',
              top: 20,
              right: 22,
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: '#6EE7B7',
              opacity: 0.75,
            }}
          />

          {/* Dot — right middle */}
          <View
            style={{
              position: 'absolute',
              right: 4,
              top: '48%',
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#34D399',
              opacity: 0.6,
            }}
          />

          {/* Dot — bottom left */}
          <View
            style={{
              position: 'absolute',
              bottom: 28,
              left: 14,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#A7F3D0',
              opacity: 0.8,
            }}
          />

          {/* Main circle */}
          <View
            style={{
              width: 180,
              height: 180,
              borderRadius: 90,
              backgroundColor: '#ECFDF5',
              borderWidth: 3,
              borderColor: '#10B981',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#10B981',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18,
              shadowRadius: 20,
              elevation: 6,
            }}
          >
            <MaterialCommunityIcons
              name="check-bold"
              size={80}
              color="#10B981"
            />
          </View>
        </View>

        {/* ──────── TEXT CONTENT ──────── */}

        {/* Title */}
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: 26,
            color: '#1A1A2E',
            textAlign: 'center',
            marginBottom: 14,
          }}
        >
          Switched to Verizon 5G
        </Text>

        {/* Latency badge */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#EBF5FF',
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 7,
            marginBottom: 18,
          }}
        >
          <MaterialCommunityIcons
            name="speedometer"
            size={16}
            color="#2196F3"
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontSize: 13,
              color: '#2196F3',
            }}
          >
            Latency improved by 45ms
          </Text>
        </View>

        {/* Subtitle */}
        <Text
          style={{
            fontFamily: 'Gilroy-Regular',
            fontSize: 14,
            color: '#6B7280',
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: 8,
            marginBottom: 28,
          }}
        >
          Your device has automatically connected{'\n'}to the strongest
          available network for{'\n'}peak performance.
        </Text>

        {/* Divider */}
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#F3F4F6',
            marginBottom: 18,
          }}
        />

        {/* Signal Strength row */}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
          }}
        >
          <Text
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontSize: 15,
              color: '#374151',
            }}
          >
            Signal Strength
          </Text>

          {/* Green signal bars icon */}
          <MaterialCommunityIcons
            name="signal"
            size={26}
            color="#10B981"
          />
        </View>
      </View>

      {/* ──────── BOTTOM ACTIONS ──────── */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {/* Dismiss button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#2196F3',
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontFamily: 'Gilroy-Bold',
              fontSize: 16,
              color: '#FFFFFF',
            }}
          >
            Dismiss
          </Text>
        </TouchableOpacity>

        {/* View Connection Details link */}
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ alignItems: 'center' }}
          onPress={() => {}}
        >
          <Text
            style={{
              fontFamily: 'Gilroy-Medium',
              fontSize: 14,
              color: '#374151',
            }}
          >
            View Connection Details
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
