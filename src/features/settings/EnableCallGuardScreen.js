import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EnableCallGuardScreen() {
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
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{ padding: 2 }}>
          <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 17, color: '#1A1A2E' }}>Permissions</Text>
        {/* Spacer */}
        <View style={{ width: 28 }} />
      </View>

      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 24 }}>
        {/* ──────── HERO ILLUSTRATION ──────── */}
        <View style={{ marginTop: 30, marginBottom: 28, alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer light blue circle */}
          <View
            style={{
              width: 210,
              height: 210,
              borderRadius: 105,
              backgroundColor: '#DBEAFE',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Green shield icon in smaller green circle */}
            <View
              style={{
                position: 'absolute',
                top: 36,
                width: 86,
                height: 86,
                borderRadius: 43,
                backgroundColor: '#D1FAE5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons name="shield-heart" size={44} color="#10B981" />
            </View>

            {/* White pill — phone icon + line + checkmark */}
            <View
              style={{
                position: 'absolute',
                bottom: 38,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: 30,
                paddingHorizontal: 18,
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
                width: 150,
              }}
            >
              <Ionicons name="call" size={20} color="#2196F3" />
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: '#E5E7EB',
                  marginHorizontal: 10,
                  borderRadius: 1,
                }}
              />
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: '#10B981',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="checkmark" size={13} color="#FFFFFF" />
              </View>
            </View>
          </View>
        </View>

        {/* ──────── SECURE CONNECTION BADGE ──────── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ECFDF5',
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 6,
            marginBottom: 18,
          }}
        >
          <MaterialCommunityIcons name="shield-outline" size={14} color="#10B981" style={{ marginRight: 5 }} />
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 12, color: '#10B981', letterSpacing: 0.8 }}>
            SECURE CONNECTION
          </Text>
        </View>

        {/* ──────── TITLE ──────── */}
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: 26,
            color: '#1A1A2E',
            textAlign: 'center',
            marginBottom: 10,
          }}
        >
          Enable Call Guard
        </Text>

        {/* ──────── SUBTITLE ──────── */}
        <Text
          style={{
            fontFamily: 'Gilroy-Bold',
            fontSize: 16,
            color: '#374151',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 18,
          }}
        >
          Stay connected even when your{'\n'}signal drops mid-call.
        </Text>

        {/* ──────── DESCRIPTION CARD ──────── */}
        <View
          style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 14,
            paddingHorizontal: 20,
            paddingVertical: 16,
            marginBottom: 28,
            width: '100%',
          }}
        >
          <Text
            style={{
              fontFamily: 'Gilroy-Regular',
              fontSize: 13,
              color: '#6B7280',
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            SmoothSwitch needs permission to manage calls to ensure seamless switching without dropping your connection.
          </Text>
        </View>

        {/* ──────── ENABLE BUTTON ──────── */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            width: '100%',
            backgroundColor: '#2196F3',
            borderRadius: 16,
            paddingVertical: 17,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 16, color: '#FFFFFF' }}>
            Enable Call Guard
          </Text>
        </TouchableOpacity>

        {/* ──────── NOT NOW LINK ──────── */}
        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
          <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 14, color: '#9CA3AF' }}>Not now</Text>
        </TouchableOpacity>
      </View>

      {/* ──────── BOTTOM HANDLE BAR ──────── */}
      <View style={{ alignItems: 'center', paddingBottom: 14, paddingTop: 10 }}>
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#D1D5DB',
          }}
        />
      </View>
    </SafeAreaView>
  );
}
