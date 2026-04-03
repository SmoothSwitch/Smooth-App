import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

function InfoRow({ label, value, isLast }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 14, color: '#6B7280' }}>{label}</Text>
      <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 14, color: '#1A1A2E' }}>{value}</Text>
    </View>
  );
}

function TabBarItem({ iconName, label, active, onPress }) {
  const color = active ? '#2196F3' : '#9CA3AF';
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
    >
      <MaterialCommunityIcons name={iconName} size={22} color={color} />
      <Text
        style={{
          fontFamily: 'Gilroy-SemiBold',
          fontSize: 9,
          color,
          marginTop: 3,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────── */

export default function CriticalOutageScreen() {
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

        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 17, color: '#1A1A2E' }}>SmoothSwitch</Text>

        <TouchableOpacity activeOpacity={0.7} style={{ padding: 2 }}>
          <MaterialCommunityIcons name="dots-vertical" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ──────── SYSTEM ALERT badge ──────── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 10 }}>
          <View
            style={{
              width: 9, height: 9, borderRadius: 5,
              backgroundColor: '#EF4444',
              marginRight: 7,
            }}
          />
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 12, color: '#EF4444', letterSpacing: 0.8 }}>
            SYSTEM ALERT
          </Text>
        </View>

        {/* ──────── TITLE ──────── */}
        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 30, color: '#1A1A2E', lineHeight: 36, marginBottom: 10 }}>
          Critical Outage{'\n'}Detected
        </Text>

        <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 14, color: '#6B7280', lineHeight: 21, marginBottom: 18 }}>
          Main server nodes in your region are currently unresponsive. Our failover system is engaging.
        </Text>

        {/* ──────── IMPACT LEVEL CARD ──────── */}
        <View
          style={{
            backgroundColor: '#FEF2F2',
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,
            borderWidth: 1,
            borderColor: '#FECACA',
          }}
        >
          {/* Top row: label + badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 12, color: '#9CA3AF', letterSpacing: 0.7 }}>
              IMPACT LEVEL
            </Text>
            <View
              style={{
                backgroundColor: '#EF4444',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 11, color: '#FFFFFF' }}>-100% Connectivity</Text>
            </View>
          </View>

          {/* HIGH label */}
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 26, color: '#EF4444', marginBottom: 12 }}>HIGH</Text>

          {/* Red filled progress bar */}
          <View style={{ height: 6, backgroundColor: '#FECACA', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#EF4444', borderRadius: 3 }} />
          </View>
        </View>

        {/* ──────── MAP PLACEHOLDER ──────── */}
        <View
          style={{
            height: 160,
            borderRadius: 14,
            overflow: 'hidden',
            backgroundColor: '#C8E6ED',
            marginBottom: 14,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Grid lines */}
          {[40, 80, 120].map((y) => (
            <View key={y} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 1, backgroundColor: '#A8D5DC', opacity: 0.5 }} />
          ))}
          {[80, 160, 240].map((x) => (
            <View key={x} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, backgroundColor: '#A8D5DC', opacity: 0.5 }} />
          ))}

          {/* Red pulsing pin area */}
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                width: 40, height: 40, borderRadius: 20,
                backgroundColor: 'rgba(239,68,68,0.15)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: 16, height: 16, borderRadius: 8,
                  backgroundColor: '#EF4444',
                  borderWidth: 2, borderColor: '#FFFFFF',
                }}
              />
            </View>
          </View>

          {/* LIVE INCIDENT AREA label */}
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 10, color: '#374151', letterSpacing: 0.5 }}>
              LIVE INCIDENT AREA
            </Text>
          </View>
        </View>

        {/* ──────── SWITCHING TO BACKUP CARD ──────── */}
        <View
          style={{
            backgroundColor: '#EBF5FF',
            borderRadius: 14,
            padding: 16,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#BFDBFE',
          }}
        >
          {/* Blue circle icon */}
          <View
            style={{
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: '#2196F3',
              alignItems: 'center', justifyContent: 'center',
              marginRight: 14, flexShrink: 0,
            }}
          >
            <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="#FFFFFF" />
          </View>

          {/* Text */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 15, color: '#1A1A2E', marginBottom: 2 }}>
              Switching to Backup
            </Text>
            <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 12, color: '#2196F3' }}>
              Redirecting traffic via Node-04...
            </Text>
          </View>

          {/* Refresh icon */}
          <Ionicons name="refresh-outline" size={22} color="#2196F3" style={{ marginLeft: 8 }} />
        </View>

        {/* ──────── VIEW INCIDENT DETAILS BUTTON ──────── */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={{
            backgroundColor: '#2196F3',
            borderRadius: 14,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            shadowColor: '#2196F3',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 16, color: '#FFFFFF', marginRight: 8 }}>
            View Incident Details
          </Text>
          <MaterialCommunityIcons name="open-in-new" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* ──────── INFO ROWS ──────── */}
        <View>
          <InfoRow label="Estimated Resolution" value="~14 Minutes" />
          <InfoRow label="Report ID" value="#ERR-4029-SMOOTH" isLast />
        </View>
      </ScrollView>

      {/* ──────── BOTTOM TAB BAR ──────── */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <TabBarItem iconName="view-dashboard-outline" label="Dashboard" active onPress={() => {}} />
        <TabBarItem iconName="radio-tower" label="Nodes" active={false} onPress={() => {}} />
        <TabBarItem iconName="format-list-bulleted" label="Logs" active={false} onPress={() => {}} />
        <TabBarItem iconName="tune-variant" label="Config" active={false} onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
