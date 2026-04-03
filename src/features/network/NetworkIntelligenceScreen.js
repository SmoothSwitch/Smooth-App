import React, { useState } from 'react';
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
   CONSTANTS
───────────────────────────────────────── */

const TABS = ['Overview', 'Performance', 'Predictive', 'Topology'];

const BAR_DATA = [
  { label: '00:00', heights: [0.45, 0.35] },
  { label: '', heights: [0.55, 0.42] },
  { label: '', heights: [0.5, 0.38] },
  { label: '06:00', heights: [0.6, 0.48] },
  { label: '', heights: [0.72, 0.55] },
  { label: '', heights: [0.65, 0.5] },
  { label: '12:00', heights: [0.9, 0.7] },
  { label: '', heights: [0.85, 0.65] },
  { label: '', heights: [0.75, 0.58] },
  { label: '18:00', heights: [0.68, 0.52] },
  { label: '', heights: [0.8, 0.62] },
  { label: '', heights: [0.88, 0.68] },
  { label: '23:59', heights: [0.95, 0.75] },
];

const TIME_FILTERS = ['1H', '6H', '24H', '7D'];

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/* Horizontal stat card */
function StatCard({ title, value, unit, trendIcon, trendText, trendColor, badge, badgeColor, rightIcon }) {
  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text style={{ fontFamily: 'Gilroy-Medium', fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
          {title}
        </Text>
        <Ionicons name={rightIcon} size={20} color="#2196F3" />
      </View>

      <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 32, color: '#1A1A2E', lineHeight: 38 }}>
        {value}
        <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 18, color: '#374151' }}>
          {unit ? ` ${unit}` : ''}
        </Text>
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
        {badge ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: badgeColor || '#EBF5FF',
              borderRadius: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
              marginTop: 2,
            }}
          >
            <Ionicons name="trending-up-outline" size={12} color="#2196F3" style={{ marginRight: 4 }} />
            <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 12, color: '#2196F3' }}>
              {badge}
            </Text>
          </View>
        ) : (
          <>
            {trendIcon && (
              <MaterialCommunityIcons name={trendIcon} size={16} color={trendColor || '#10B981'} style={{ marginRight: 4 }} />
            )}
            <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 13, color: trendColor || '#10B981' }}>
              {trendText}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

/* Bottom tab item */
function TabBarItem({ icon, label, active, onPress }) {
  const color = active ? '#2196F3' : '#9CA3AF';
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
    >
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text
        style={{
          fontFamily: 'Gilroy-SemiBold',
          fontSize: 10,
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

export default function NetworkIntelligenceScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeTime, setActiveTime] = useState('1H');

  const BAR_MAX_HEIGHT = 110;

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
        {/* Left: icon + title */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="network-outline" size={22} color="#2196F3" style={{ marginRight: 8 }} />
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 17, color: '#1A1A2E' }}>
            Network Intelligence
          </Text>
        </View>

        {/* Right: search + bell */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity activeOpacity={0.7}>
            <Ionicons name="search-outline" size={22} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={{ position: 'relative' }}>
            <Ionicons name="notifications-outline" size={22} color="#374151" />
            {/* Red dot badge */}
            <View
              style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#EF4444',
                borderWidth: 1,
                borderColor: '#FFFFFF',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ──────── HORIZONTAL TAB BAR ──────── */}
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
          paddingHorizontal: 18,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab)}
              style={{
                marginRight: 20,
                paddingBottom: 10,
                borderBottomWidth: isActive ? 2.5 : 0,
                borderBottomColor: '#2196F3',
              }}
            >
              <Text
                style={{
                  fontFamily: isActive ? 'Gilroy-Bold' : 'Gilroy-Medium',
                  fontSize: 13,
                  color: isActive ? '#2196F3' : '#9CA3AF',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ──────── SCROLLABLE CONTENT ──────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Stat Cards ── */}
        <StatCard
          title="Network Uptime"
          value="99.98"
          unit="%"
          trendIcon="trending-up"
          trendText="+0.02%  vs last 24h"
          trendColor="#10B981"
          rightIcon="checkmark-circle-outline"
        />

        <StatCard
          title="Avg Latency"
          value="14.2"
          unit="ms"
          trendIcon="trending-down"
          trendText="-2.4ms  improved"
          trendColor="#10B981"
          rightIcon="reload-circle-outline"
        />

        <StatCard
          title="Total Traffic"
          value="8.4"
          unit="TB/s"
          badge="Normal  within range"
          badgeColor="#EBF5FF"
          rightIcon="sync-circle-outline"
        />

        {/* ── Performance Trends Card ── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#F3F4F6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 15, color: '#1A1A2E', marginBottom: 2 }}>
            Performance Trends
          </Text>
          <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 12, color: '#6B7280', marginBottom: 14 }}>
            Aggregate throughput vs latency over 24 hours
          </Text>

          {/* Time filter pills */}
          <View style={{ flexDirection: 'row', marginBottom: 18 }}>
            {TIME_FILTERS.map((f) => {
              const isActive = activeTime === f;
              return (
                <TouchableOpacity
                  key={f}
                  activeOpacity={0.7}
                  onPress={() => setActiveTime(f)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    borderRadius: 8,
                    backgroundColor: isActive ? '#2196F3' : '#F3F4F6',
                    marginRight: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: 12,
                      color: isActive ? '#FFFFFF' : '#6B7280',
                    }}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bar chart */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: BAR_MAX_HEIGHT + 24 }}>
            {BAR_DATA.map((bar, i) => (
              <View
                key={i}
                style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}
              >
                {/* Background bar */}
                <View style={{ width: '55%', position: 'relative', alignItems: 'center' }}>
                  <View
                    style={{
                      width: '100%',
                      height: Math.round(bar.heights[0] * BAR_MAX_HEIGHT),
                      backgroundColor: '#BFDBFE',
                      borderRadius: 4,
                    }}
                  />
                  {/* Foreground bar overlaid */}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      width: '100%',
                      height: Math.round(bar.heights[1] * BAR_MAX_HEIGHT),
                      backgroundColor: '#2196F3',
                      borderRadius: 4,
                    }}
                  />
                </View>
                {/* Time label */}
                <Text
                  style={{
                    fontFamily: 'Gilroy-Regular',
                    fontSize: 8,
                    color: '#9CA3AF',
                    marginTop: 5,
                    textAlign: 'center',
                  }}
                >
                  {bar.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Predictive Analysis Card ── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: '#F3F4F6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <MaterialCommunityIcons name="head-lightbulb-outline" size={20} color="#2196F3" style={{ marginRight: 8 }} />
            <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 15, color: '#1A1A2E' }}>
              Predictive Analysis
            </Text>
          </View>

          {/* Row 1 — Low Congestion */}
          <View
            style={{
              backgroundColor: '#F0FDF4',
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 13, color: '#065F46', marginBottom: 3 }}>
                Low Congestion Expected
              </Text>
              <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 12, color: '#6B7280', lineHeight: 17 }}>
                Next 4 hours will likely see 15% lower traffic than usual.
              </Text>
            </View>
            <MaterialCommunityIcons name="check-circle-outline" size={20} color="#10B981" />
          </View>

          {/* Row 2 — Infrastructure */}
          <View
            style={{
              backgroundColor: '#EBF5FF',
              borderRadius: 12,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 13, color: '#1E3A5F', marginBottom: 3 }}>
                Infrastructure Expansion Recommendation
              </Text>
              <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 12, color: '#6B7280', lineHeight: 17 }}>
                US-East-1 node will reach 85% capacity in 12 days based on growth trends.
              </Text>
            </View>
            <Ionicons name="information-circle-outline" size={20} color="#2196F3" />
          </View>
        </View>

        {/* ── Global Node Health Card ── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            marginBottom: 4,
            borderWidth: 1,
            borderColor: '#F3F4F6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          {/* Card header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons name="earth" size={20} color="#2196F3" style={{ marginRight: 8 }} />
              <Text style={{ fontFamily: 'Gilroy-Bold', fontSize: 15, color: '#1A1A2E' }}>
                Global Node Health
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 13, color: '#2196F3' }}>
                View Map
              </Text>
            </TouchableOpacity>
          </View>

          {/* Map placeholder area */}
          <View
            style={{
              height: 90,
              backgroundColor: '#F8FAFC',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text style={{ fontFamily: 'Gilroy-Regular', fontSize: 12, color: '#9CA3AF' }}>
              Network distribution visualization
            </Text>
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            {[
              { color: '#10B981', label: 'HEALTHY' },
              { color: '#F97316', label: 'WARNING' },
              { color: '#EF4444', label: 'CRITICAL' },
            ].map(({ color, label }) => (
              <View key={label} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: color,
                    marginRight: 5,
                  }}
                />
                <Text style={{ fontFamily: 'Gilroy-SemiBold', fontSize: 10, color: '#6B7280', letterSpacing: 0.4 }}>
                  {label}
                </Text>
              </View>
            ))}
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
        <TabBarItem icon="view-dashboard-outline" label="Dashboard" active onPress={() => {}} />
        <TabBarItem icon="server-network" label="Nodes" active={false} onPress={() => {}} />
        <TabBarItem icon="bell-alert-outline" label="Alerts" active={false} onPress={() => {}} />
        <TabBarItem icon="cog-outline" label="Settings" active={false} onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
