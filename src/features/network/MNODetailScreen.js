import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/* Generic card wrapper */
function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: '#F3F4F6',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* Stat card (half-width or full-width) */
function StatCard({ label, value, unit, trend, trendUp, iconName, style }) {
  return (
    <Card style={[{ flex: 1 }, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 12, color: '#6B7280' }}>{label}</Text>
        <MaterialCommunityIcons name={iconName} size={18} color="#2196F3" />
      </View>
      <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 26, color: '#1A1A2E', lineHeight: 32 }}>
        {value}
        <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 14, color: '#6B7280' }}> {unit}</Text>
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <MaterialCommunityIcons
          name={trendUp ? 'trending-up' : 'trending-down'}
          size={14}
          color={trendUp ? '#10B981' : '#EF4444'}
          style={{ marginRight: 3 }}
        />
        <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 12, color: trendUp ? '#10B981' : '#EF4444' }}>
          {trend}
        </Text>
      </View>
    </Card>
  );
}

/* Settings row */
function SettingsRow({ iconName, label, value }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
      }}
    >
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <MaterialCommunityIcons name={iconName} size={18} color="#6B7280" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 12, color: '#9CA3AF', marginBottom: 1 }}>{label}</Text>
        <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 14, color: '#1A1A2E' }}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
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
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────
   BAR CHART DATA
───────────────────────────────────────── */

const SPEED_BARS = [
  { h: 0.35, label: '00:00', highlight: false },
  { h: 0.45, label: '', highlight: false },
  { h: 0.55, label: '', highlight: false },
  { h: 0.42, label: '06:00', highlight: false },
  { h: 0.6,  label: '', highlight: false },
  { h: 0.5,  label: '', highlight: false },
  { h: 0.65, label: '12:00', highlight: false },
  { h: 0.72, label: '', highlight: false },
  { h: 0.58, label: '', highlight: false },
  { h: 0.95, label: '18:00', highlight: true  },
  { h: 0.52, label: '', highlight: false },
  { h: 0.48, label: 'Now',   highlight: false },
];

const LATENCY_BARS = [
  { hGreen: 0.7, hBlue: 0.45 },
  { hGreen: 0.6, hBlue: 0.5  },
  { hGreen: 0.8, hBlue: 0.55 },
  { hGreen: 0.65,hBlue: 0.4  },
  { hGreen: 0.75,hBlue: 0.6  },
];

/* ─────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────── */

export default function MNODetailScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ──────── HEADER ──────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 12,
          backgroundColor: '#F8FAFC',
        }}
      >
        {/* Back + titles */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={{ marginRight: 10, padding: 2 }}>
            <Ionicons name="arrow-back" size={22} color="#1A1A2E" />
          </TouchableOpacity>
          <View>
            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 16, color: '#1A1A2E' }}>Horizon Mobile</Text>
            <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 11, color: '#9CA3AF' }}>Network ID: 310-260</Text>
          </View>
        </View>

        {/* Share + Refresh */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: '#FFFFFF',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
            }}
          >
            <Feather name="share-2" size={17} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 36, height: 36, borderRadius: 18,
              backgroundColor: '#2196F3',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#2196F3', shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3, shadowRadius: 4, elevation: 3,
            }}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ──────── SCROLLABLE CONTENT ──────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 14, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Carrier Header Card ── */}
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Antenna icon box */}
            <View
              style={{
                width: 52, height: 52, borderRadius: 14,
                backgroundColor: '#EBF5FF',
                alignItems: 'center', justifyContent: 'center',
                marginRight: 14,
              }}
            >
              <MaterialCommunityIcons name="antenna" size={28} color="#2196F3" />
            </View>

            <View style={{ flex: 1 }}>
              {/* Name + green dot */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 16, color: '#1A1A2E', marginRight: 6 }}>
                  Verizon Wireless
                </Text>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
              </View>
              <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 12, color: '#10B981', marginBottom: 2 }}>
                Status: Excellent
              </Text>
              <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 11, color: '#9CA3AF' }}>
                Last ping: 45 seconds ago
              </Text>
            </View>
          </View>
        </Card>

        {/* ── Signal Strength + Download (row) ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
          <StatCard
            label="Signal Strength"
            value="-82"
            unit="dBm"
            trend="+4.2%"
            trendUp
            iconName="signal"
            style={{ marginBottom: 0 }}
          />
          <StatCard
            label="Download"
            value="245.8"
            unit="Mbps"
            trend="+12.5%"
            trendUp
            iconName="download-outline"
            style={{ marginBottom: 0 }}
          />
        </View>

        {/* ── Upload (full width) ── */}
        <StatCard
          label="Upload"
          value="52.1"
          unit="Mbps"
          trend="-2.4%"
          trendUp={false}
          iconName="upload-outline"
        />

        {/* ── Data Speed Trends ── */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 14, color: '#1A1A2E' }}>Data Speed Trends</Text>
            <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 11, color: '#9CA3AF' }}>Last 24 Hours</Text>
          </View>

          {/* Bars */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 90 }}>
            {SPEED_BARS.map((bar, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                <View
                  style={{
                    width: '70%',
                    height: Math.round(bar.h * 80),
                    backgroundColor: bar.highlight ? '#2196F3' : '#BFDBFE',
                    borderRadius: 3,
                  }}
                />
              </View>
            ))}
          </View>

          {/* Labels */}
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            {SPEED_BARS.map((bar, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 8, color: '#9CA3AF' }}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* ── Latency Ping ── */}
        <Card>
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 14, color: '#1A1A2E', marginBottom: 14 }}>
            Latency (Ping)
          </Text>

          {/* Mini bar chart */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 50, marginBottom: 12 }}>
            {LATENCY_BARS.map((bar, i) => (
              <View key={i} style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 2 }}>
                <View style={{ width: 8, height: Math.round(bar.hGreen * 46), backgroundColor: '#10B981', borderRadius: 3 }} />
                <View style={{ width: 8, height: Math.round(bar.hBlue * 46), backgroundColor: '#BFDBFE', borderRadius: 3 }} />
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 28, color: '#1A1A2E' }}>18</Text>
              <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 12, color: '#6B7280', marginLeft: 3 }}>ms</Text>
            </View>
            <View
              style={{
                backgroundColor: '#ECFDF5',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 11, color: '#10B981', letterSpacing: 0.5 }}>
                STABLE
              </Text>
            </View>
          </View>
        </Card>

        {/* ── Cell Tower Coverage ── */}
        <Card>
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 14, color: '#1A1A2E', marginBottom: 12 }}>
            Cell Tower Coverage
          </Text>

          {/* Map placeholder */}
          <View
            style={{
              height: 110,
              backgroundColor: '#E5EFF7',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#D1E3F0',
            }}
          >
            {/* Grid decoration */}
            {[28, 56, 84].map((y) => (
              <View key={y} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 1, backgroundColor: '#BDD5EA', opacity: 0.5 }} />
            ))}
            {[70, 140, 210, 280].map((x) => (
              <View key={x} style={{ position: 'absolute', left: x, top: 0, bottom: 0, width: 1, backgroundColor: '#BDD5EA', opacity: 0.5 }} />
            ))}
            <MaterialCommunityIcons name="map-outline" size={32} color="#5DADE2" style={{ opacity: 0.5 }} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 13, color: '#374151' }}>
              Current Cell: L-8902
            </Text>
            <MaterialCommunityIcons name="map-legend" size={20} color="#9CA3AF" />
          </View>
        </Card>

        {/* ── Settings Rows ── */}
        <View
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#F3F4F6',
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
            marginBottom: 8,
          }}
        >
          <SettingsRow iconName="access-point-network" label="APN Settings" value="VZWINTERNET" />
          <SettingsRow iconName="wifi" label="Frequency Band" value="n77 (C-Band 5G)" />
          <View style={{ borderBottomWidth: 0 }}>
            <SettingsRow iconName="sim-outline" label="SIM Type" value="eSIM Active" />
          </View>
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
        <TabBarItem iconName="view-dashboard-outline" label="Dashboard" active={false} onPress={() => {}} />
        <TabBarItem iconName="chart-line" label={'MNO\nPerformance'} active onPress={() => {}} />
        <TabBarItem iconName="map-outline" label="Map" active={false} onPress={() => {}} />
        <TabBarItem iconName="cog-outline" label="Settings" active={false} onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
