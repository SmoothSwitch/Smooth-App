import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
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

/* Zoom / Location button */
function MapButton({ children, onPress, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
}

/* Filter pill */
function FilterPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: active ? '#2196F3' : '#FFFFFF',
        borderWidth: active ? 0 : 1.5,
        borderColor: '#D1D5DB',
        marginRight: 8,
      }}
    >
      <Text
        style={{
          fontFamily: active ? 'Gilroy-SemiBold' : 'Gilroy-Medium',
          fontSize: 13,
          color: active ? '#FFFFFF' : '#374151',
        }}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-down"
        size={13}
        color={active ? '#FFFFFF' : '#6B7280'}
        style={{ marginLeft: 4 }}
      />
    </TouchableOpacity>
  );
}

/* Signal legend row */
function LegendRow({ color, label }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <View
        style={{
          height: 6,
          width: '90%',
          borderRadius: 3,
          backgroundColor: color,
          marginBottom: 5,
        }}
      />
      <Text
        style={{
          fontFamily: 'Gilroy-SemiBold',
          fontSize: 10,
          color: '#9CA3AF',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

/* Bottom tab item */
function TabItem({ icon, label, active, onPress }) {
  const color = active ? '#2196F3' : '#9CA3AF';
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', paddingVertical: 10 }}
    >
      <Ionicons name={icon} size={22} color={color} />
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

export default function NetworkMapScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Carriers');

  const filters = ['All Carriers', '5G Ultra', '4G LTE'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
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
            <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
          </TouchableOpacity>

          <Text
            style={{
              fontFamily: 'Gilroy-Bold',
              fontSize: 18,
              color: '#1A1A2E',
            }}
          >
            Network Map
          </Text>

          <TouchableOpacity activeOpacity={0.7} style={{ padding: 4 }}>
            <Ionicons name="search-outline" size={24} color="#1A1A2E" />
          </TouchableOpacity>
        </View>

        {/* ──────── SEARCH BAR ──────── */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 11,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
              borderWidth: 1,
              borderColor: '#F3F4F6',
            }}
          >
            <Ionicons
              name="location-outline"
              size={20}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Find coverage by city or ZIP"
              placeholderTextColor="#9CA3AF"
              style={{
                flex: 1,
                fontFamily: 'Gilroy-Regular',
                fontSize: 14,
                color: '#1A1A2E',
                padding: 0,
              }}
            />
          </View>
        </View>

        {/* ──────── MAP AREA ──────── */}
        <View style={{ position: 'relative' }}>
          {/* Map placeholder */}
          <View
            style={{
              width: '100%',
              height: 420,
              backgroundColor: '#D6EAF8',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Grid lines for map feel */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.25,
              }}
            >
              {[60, 130, 200, 270, 340].map((y) => (
                <View
                  key={y}
                  style={{
                    position: 'absolute',
                    top: y,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: '#7FB3D3',
                  }}
                />
              ))}
              {[70, 160, 250, 330].map((x) => (
                <View
                  key={x}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: 0,
                    bottom: 0,
                    width: 1,
                    backgroundColor: '#7FB3D3',
                  }}
                />
              ))}
            </View>

            <MaterialCommunityIcons
              name="map-outline"
              size={48}
              color="#5DADE2"
              style={{ opacity: 0.6 }}
            />
            <Text
              style={{
                fontFamily: 'Gilroy-SemiBold',
                fontSize: 15,
                color: '#5DADE2',
                marginTop: 10,
                opacity: 0.8,
              }}
            >
              MapView Placeholder
            </Text>
          </View>

          {/* ── Zoom + Location buttons (right side) ── */}
          <View
            style={{
              position: 'absolute',
              right: 14,
              top: 14,
              alignItems: 'center',
            }}
          >
            {/* Zoom In */}
            <MapButton>
              <Ionicons name="add" size={20} color="#374151" />
            </MapButton>

            {/* Zoom Out */}
            <MapButton style={{ marginTop: 4 }}>
              <Ionicons name="remove" size={20} color="#374151" />
            </MapButton>

            {/* Location target */}
            <MapButton style={{ marginTop: 12 }}>
              <MaterialCommunityIcons
                name="crosshairs-gps"
                size={20}
                color="#2196F3"
              />
            </MapButton>
          </View>

          {/* ── Filter pills (bottom of map) ── */}
          <View
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              flexDirection: 'row',
            }}
          >
            {filters.map((f) => (
              <FilterPill
                key={f}
                label={f}
                active={activeFilter === f}
                onPress={() => setActiveFilter(f)}
              />
            ))}
          </View>
        </View>

        {/* ──────── SIGNAL LEGEND CARD ──────── */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 18,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 18,
            paddingVertical: 18,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
            borderWidth: 1,
            borderColor: '#F3F4F6',
          }}
        >
          {/* Card header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontFamily: 'Gilroy-Bold',
                fontSize: 16,
                color: '#1A1A2E',
              }}
            >
              Signal Legend
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#9CA3AF"
            />
          </View>

          <Text
            style={{
              fontFamily: 'Gilroy-Regular',
              fontSize: 13,
              color: '#6B7280',
              marginBottom: 14,
            }}
          >
            Estimated outdoor coverage strength
          </Text>

          {/* Legend bars */}
          <View style={{ flexDirection: 'row', marginBottom: 18 }}>
            <LegendRow color="#10B981" label="Excellent" />
            <LegendRow color="#2196F3" label="Good" />
            <LegendRow color="#F97316" label="Weak" />
            <LegendRow color="#D1D5DB" label="None" />
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: '#F3F4F6',
              marginBottom: 14,
            }}
          />

          {/* Carrier Comparison Row */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* Icon box */}
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: '#EBF5FF',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <MaterialCommunityIcons
                name="chart-bar"
                size={22}
                color="#2196F3"
              />
            </View>

            {/* Text */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: 'Gilroy-Bold',
                  fontSize: 14,
                  color: '#1A1A2E',
                  marginBottom: 2,
                }}
              >
                Carrier Comparison
              </Text>
              <Text
                style={{
                  fontFamily: 'Gilroy-Regular',
                  fontSize: 12,
                  color: '#6B7280',
                  lineHeight: 17,
                }}
              >
                T-Mobile currently has best 5G in this area.
              </Text>
            </View>

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Bottom spacing before tab bar */}
        <View style={{ height: 16 }} />
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
        <TabItem
          icon="map"
          label="Map"
          active
          onPress={() => {}}
        />
        <TabItem
          icon="speedometer-outline"
          label="Speed Test"
          active={false}
          onPress={() => {}}
        />
        <TabItem
          icon="wifi-outline"
          label="Status"
          active={false}
          onPress={() => {}}
        />
        <TabItem
          icon="settings-outline"
          label="Settings"
          active={false}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  );
}
