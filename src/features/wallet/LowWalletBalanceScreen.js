import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function LowWalletBalanceScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        {/* ── Main White Card ── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 5,
          }}
        >
          {/* ── Header row ── */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 4,
            }}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 17, color: '#1A1A2E' }}>Alert</Text>
          </View>

          {/* ── Gradient Hero ── */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
            <LinearGradient
              colors={['#FEF9EC', '#EEF6FB', '#F0F4F8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                height: 160,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="alert-outline" size={72} color="#F59E0B" />
            </LinearGradient>
          </View>

          {/* ── Title + Subtitle ── */}
          <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 4, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'Gilroy-Bold',
                fontSize: 26,
                color: '#1A1A2E',
                textAlign: 'center',
                marginBottom: 10,
              }}
            >
              Low Wallet Balance
            </Text>
            <Text
              style={{
                fontFamily: 'Gilroy-Regular',
                fontSize: 14,
                color: '#6B7280',
                textAlign: 'center',
                lineHeight: 21,
              }}
            >
              Add funds to ensure uninterrupted network switching for your connected devices.
            </Text>
          </View>

          {/* ── Balance Card ── */}
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <View
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 14,
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: '#F3F4F6',
              }}
            >
              {/* Label + wallet icon */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontSize: 11,
                    color: '#9CA3AF',
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                  }}
                >
                  Current Balance
                </Text>
                <MaterialCommunityIcons name="wallet-outline" size={22} color="#F59E0B" />
              </View>

              {/* Amount */}
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 12 }}>
                <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 36, color: '#1A1A2E' }}>$0.45</Text>
                <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 14, color: '#9CA3AF', marginLeft: 6 }}>USD</Text>
              </View>

              {/* Progress bar */}
              <View
                style={{
                  height: 6,
                  backgroundColor: '#E5E7EB',
                  borderRadius: 3,
                  overflow: 'hidden',
                  marginBottom: 6,
                }}
              >
                <View
                  style={{
                    width: '8%',
                    height: '100%',
                    backgroundColor: '#F59E0B',
                    borderRadius: 3,
                  }}
                />
              </View>

              {/* Critically low label */}
              <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 12, color: '#F59E0B' }}>
                Critically low
              </Text>
            </View>
          </View>

          {/* ── Buttons ── */}
          <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 10 }}>
            {/* Top Up Now — green */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={{
                backgroundColor: '#10B981',
                borderRadius: 14,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#10B981',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.28,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 16, color: '#FFFFFF' }}>Top Up Now</Text>
            </TouchableOpacity>

            {/* View Balance History — light blue */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                backgroundColor: '#EBF5FF',
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 15, color: '#2196F3' }}>
                View Balance History
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Help link ── */}
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 16,
              paddingBottom: 24,
              gap: 5,
            }}
          >
            <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 13, color: '#9CA3AF' }}>
              How does network switching work?
            </Text>
            <Ionicons name="help-circle-outline" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
