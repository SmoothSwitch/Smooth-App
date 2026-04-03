import React, { useState } from 'react';
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
   DATA
───────────────────────────────────────── */

const LOG_EVENTS = [
  {
    id: 1,
    icon: 'check-circle',
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    title: 'Switched to Carrier A',
    subtitle: 'Automatic optimization completed',
    time: '10:30 AM',
    category: 'Connections',
  },
  {
    id: 2,
    icon: 'information',
    iconBg: '#EBF5FF',
    iconColor: '#2196F3',
    title: 'Signal dropped below 20%',
    subtitle: 'Scanning for better alternative...',
    time: '09:15 AM',
    category: 'Warnings',
  },
  {
    id: 3,
    icon: 'check-circle',
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    title: 'Network Handover Success',
    subtitle: 'Seamlessly switched from Wi-Fi to LTE',
    time: '08:42 AM',
    category: 'Connections',
  },
  {
    id: 4,
    icon: 'information',
    iconBg: '#EBF5FF',
    iconColor: '#2196F3',
    title: 'Carrier B Coverage Detected',
    subtitle: 'New strong network available',
    time: '07:55 AM',
    category: 'Connections',
  },
  {
    id: 5,
    icon: 'cog',
    iconBg: '#F3F4F6',
    iconColor: '#9CA3AF',
    title: 'Configuration Updated',
    subtitle: 'Roaming priority settings modified',
    time: 'YESTERDAY',
    category: 'Connections',
  },
  {
    id: 6,
    icon: 'check-circle',
    iconBg: '#ECFDF5',
    iconColor: '#10B981',
    title: 'System Boot Complete',
    subtitle: 'All protocols operational',
    time: 'YESTERDAY',
    category: 'Connections',
  },
];

const FILTERS = ['All Events', 'Connections', 'Warnings'];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

function LogRow({ item, isLast }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: '#F3F4F6',
      }}
    >
      {/* Icon square */}
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          backgroundColor: item.iconBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 13,
          marginTop: 2,
          flexShrink: 0,
        }}
      >
        <MaterialCommunityIcons name={item.icon} size={22} color={item.iconColor} />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontFamily: 'Gilroy-Bold', fontSize: 14, color: '#1A1A2E', marginBottom: 3 }}
        >
          {item.title}
        </Text>
        <Text
          style={{ fontFamily: 'Gilroy-Regular', fontSize: 12, color: '#6B7280', lineHeight: 17 }}
        >
          {item.subtitle}
        </Text>
      </View>

      {/* Timestamp */}
      <Text
        style={{
          fontFamily: 'Gilroy-Medium',
          fontSize: 11,
          color: '#9CA3AF',
          marginLeft: 10,
          marginTop: 2,
          flexShrink: 0,
          textAlign: 'right',
        }}
      >
        {item.time}
      </Text>
    </TouchableOpacity>
  );
}

/* Bottom tab item */
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

export default function NetworkLogsScreen() {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('All Events');

  const filtered =
    activeFilter === 'All Events'
      ? LOG_EVENTS
      : LOG_EVENTS.filter((e) => e.category === activeFilter);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="light-content" backgroundColor="#2196F3" />

      {/* ──────── BLUE HEADER ──────── */}
      <View style={{ backgroundColor: '#2196F3', paddingBottom: 22, paddingHorizontal: 18 }}>
        {/* Top row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 14,
            marginBottom: 18,
          }}
        >
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{ padding: 2 }}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 18, color: '#FFFFFF' }}>Logs</Text>

          <TouchableOpacity activeOpacity={0.7} style={{ padding: 2 }}>
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Subtitle + title */}
        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
          Network Activity
        </Text>
        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 24, color: '#FFFFFF' }}>
          Recent Events
        </Text>
      </View>

      {/* ──────── FILTER PILLS ──────── */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        }}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(f)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: isActive ? '#2196F3' : '#FFFFFF',
                borderWidth: isActive ? 0 : 1.5,
                borderColor: '#D1D5DB',
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: 13,
                  color: isActive ? '#FFFFFF' : '#6B7280',
                }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ──────── LOG LIST ──────── */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((item, idx) => (
          <LogRow key={item.id} item={item} isLast={idx === filtered.length - 1} />
        ))}
        <View style={{ height: 12 }} />
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
        <TabBarItem iconName="home-outline" label="Home" active={false} onPress={() => {}} />
        <TabBarItem iconName="format-list-bulleted" label="Logs" active onPress={() => {}} />
        <TabBarItem iconName="web" label="Network" active={false} onPress={() => {}} />
        <TabBarItem iconName="cog-outline" label="Settings" active={false} onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
