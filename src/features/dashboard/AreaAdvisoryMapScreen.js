import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  TextInput,
} from 'react-native';

// ─── Gilroy font helper ───────────────────────────────────────────────────────
const gilroy = (weight = '400') => ({
  fontFamily:
    weight === 'bold' || weight === '700'
      ? 'Gilroy-Bold'
      : weight === '600'
      ? 'Gilroy-SemiBold'
      : weight === '500'
      ? 'Gilroy-Medium'
      : 'Gilroy-Regular',
});

// ─── Icon primitives ──────────────────────────────────────────────────────────

const BackArrow = () => (
  <View style={ic.arrowWrap}>
    <View style={ic.arrowStem} />
    <View style={ic.arrowHead} />
  </View>
);

/** ⓘ info circle */
const InfoCircle = () => (
  <View style={ic.infoCircle}>
    <Text style={ic.infoText}>i</Text>
  </View>
);

/** 🔍 search */
const SearchIcon = () => (
  <View style={ic.searchWrap}>
    <View style={ic.searchCircle} />
    <View style={ic.searchHandle} />
  </View>
);

/** ◎ location target / crosshair */
const TargetIcon = () => (
  <View style={ic.targetWrap}>
    <View style={ic.targetRing} />
    <View style={ic.targetH} />
    <View style={ic.targetV} />
    <View style={ic.targetDot} />
  </View>
);

/** + zoom in */
const PlusIcon = ({ color = '#424242' }) => (
  <View style={ic.plusWrap}>
    <View style={[ic.plusH, { backgroundColor: color }]} />
    <View style={[ic.plusV, { backgroundColor: color }]} />
  </View>
);

/** − zoom out */
const MinusIcon = ({ color = '#424242' }) => (
  <View style={[ic.plusH, { backgroundColor: color, position: 'relative' }]} />
);

/** ❖ layers icon */
const LayersIcon = () => (
  <View style={ic.layersWrap}>
    <View style={[ic.layerBar, { top: 2,  opacity: 0.35 }]} />
    <View style={[ic.layerBar, { top: 6,  opacity: 0.65 }]} />
    <View style={[ic.layerBar, { top: 10, opacity: 1 }]} />
  </View>
);

/** Bar chart icon (blue) */
const BarChartIcon = ({ color = '#1565C0' }) => (
  <View style={ic.barsRow}>
    <View style={[ic.bar, { height: 8,  backgroundColor: color }]} />
    <View style={[ic.bar, { height: 14, backgroundColor: color }]} />
    <View style={[ic.bar, { height: 10, backgroundColor: color }]} />
  </View>
);

// ─── Tab bar icons ────────────────────────────────────────────────────────────

const HomeTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.homeWrap}>
      <View style={[ic.homeRoof, { borderBottomColor: c }]} />
      <View style={[ic.homeDoor, { borderColor: c }]} />
    </View>
  );
};

const MapTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.mapWrap}>
      {/* three vertical fold lines */}
      <View style={[ic.mapFold, { left: 4, borderColor: c }]} />
      <View style={[ic.mapFold, { left: 10, borderColor: c }]} />
      <View style={[ic.mapOuter, { borderColor: c }]} />
    </View>
  );
};

const StatsTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.statsWrap}>
      <View style={[ic.statsFrame, { borderColor: c }]} />
      <View style={[ic.statsBar1, { backgroundColor: c }]} />
      <View style={[ic.statsBar2, { backgroundColor: c }]} />
      <View style={[ic.statsBar3, { backgroundColor: c }]} />
    </View>
  );
};

const ProfileTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.profileWrap}>
      <View style={[ic.profileHead, { borderColor: c }]} />
      <View style={[ic.profileShoulder, { borderColor: c }]} />
    </View>
  );
};

// ─── Filter pill data ─────────────────────────────────────────────────────────
const FILTERS = [
  { key: 'good',        label: 'Good Coverage', dotColor: '#43A047' },
  { key: 'maintenance', label: 'Maintenance',   dotColor: '#1565C0' },
  { key: 'critical',    label: 'Critical A...',  dotColor: '#FB8C00' },
];

const BOTTOM_TABS = [
  { key: 'Home',        label: 'Home' },
  { key: 'NetworkMap',  label: 'Network Map' },
  { key: 'Stats',       label: 'Stats' },
  { key: 'Profile',     label: 'Profile' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function AreaAdvisoryMapScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('good');
  const [activeTab, setActiveTab]       = useState('NetworkMap');
  const [searchText, setSearchText]     = useState('');

  const renderTabIcon = (key, active) => {
    if (key === 'Home')       return <HomeTabIcon    active={active} />;
    if (key === 'NetworkMap') return <MapTabIcon     active={active} />;
    if (key === 'Stats')      return <StatsTabIcon   active={active} />;
    if (key === 'Profile')    return <ProfileTabIcon active={active} />;
    return null;
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => navigation?.goBack?.()}
          accessibilityLabel="Go back"
        >
          <BackArrow />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Text style={[s.headerTitle, gilroy('bold')]}>Area Advisory Map</Text>
          <Text style={[s.headerSub, gilroy('400')]}>SmoothSwitch Network Status</Text>
        </View>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="Info">
          <InfoCircle />
        </TouchableOpacity>
      </View>

      {/* ── Search bar ──────────────────────────────────────────────────────── */}
      <View style={s.searchRow}>
        <View style={s.searchBar}>
          <SearchIcon />
          <TextInput
            style={[s.searchInput, gilroy('400')]}
            placeholder="Search cities or coverage zones"
            placeholderTextColor="#BDBDBD"
            value={searchText}
            onChangeText={setSearchText}
            accessibilityLabel="Search coverage zones"
          />
          <TouchableOpacity accessibilityLabel="Use current location">
            <TargetIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Map area (flex fills remaining space above bottom card + tab bar) ─ */}
      <View style={s.mapContainer}>

        {/* Map background — soft blue-grey gradient simulation */}
        <View style={s.mapBg}>

          {/* Soft glow blobs to simulate map zones */}
          <View style={[s.glow, { top: 40,  left: 30,  width: 130, height: 100, backgroundColor: 'rgba(251,140,0,0.12)' }]} />
          <View style={[s.glow, { top: 100, left: 10,  width: 160, height: 140, backgroundColor: 'rgba(67,160,71,0.10)' }]} />
          <View style={[s.glow, { top: 60,  right: 20, width: 100, height: 90,  backgroundColor: 'rgba(21,101,192,0.08)' }]} />

          {/* ── Map control buttons (right rail) ────────────────────────────── */}
          <View style={s.mapControls}>
            <TouchableOpacity style={s.mapCtrlBtn} accessibilityLabel="Zoom in">
              <PlusIcon />
            </TouchableOpacity>
            <TouchableOpacity style={s.mapCtrlBtn} accessibilityLabel="Zoom out">
              <MinusIcon />
            </TouchableOpacity>
            <TouchableOpacity style={s.mapCtrlBtn} accessibilityLabel="Toggle layers">
              <LayersIcon />
            </TouchableOpacity>
          </View>

          {/* ── Location pins ────────────────────────────────────────────────── */}

          {/* Blue pin — maintenance zone */}
          <View style={[s.pinWrap, { top: '38%', right: '22%' }]}>
            <View style={s.pinRingBlue} />
            <View style={s.pinDotBlue} />
          </View>

          {/* Green pin — good coverage */}
          <View style={[s.pinWrap, { top: '58%', left: '22%' }]}>
            <View style={s.pinRingGreen} />
            <View style={s.pinDotGreen} />
          </View>

          {/* ── Filter pills (bottom of map) ─────────────────────────────────── */}
          <View style={s.filterRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.filterContent}
            >
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  style={[s.filterPill, activeFilter === f.key && s.filterPillActive]}
                  onPress={() => setActiveFilter(f.key)}
                  accessibilityLabel={`Filter: ${f.label}`}
                >
                  <View style={[s.filterDot, { backgroundColor: f.dotColor }]} />
                  <Text style={[s.filterText, gilroy('500')]}>{f.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ── Bottom info card ─────────────────────────────────────────────── */}
        <View style={s.infoCard}>
          <View style={[s.infoIconBox]}>
            <BarChartIcon color="#1565C0" />
          </View>

          <View style={s.infoText}>
            <Text style={[s.infoTitle, gilroy('bold')]}>Downtown Sector A-12</Text>
            <Text style={[s.infoSub, gilroy('400')]}>Planned Maintenance • 4h remaining</Text>
          </View>

          <TouchableOpacity style={s.detailsBtn} accessibilityLabel="View details">
            <Text style={[s.detailsBtnText, gilroy('bold')]}>View{'\n'}Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Bottom Tab Bar ───────────────────────────────────────────────────── */}
      <View style={s.tabBar}>
        {BOTTOM_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={s.tabBarItem}
              onPress={() => setActiveTab(tab.key)}
              accessibilityLabel={tab.label}
            >
              {renderTabIcon(tab.key, isActive)}
              <Text style={[s.tabBarLabel, gilroy('500'), { color: isActive ? '#1565C0' : '#9E9E9E' }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Main styles ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, color: '#1A1A2E' },
  headerSub: { fontSize: 11, color: '#9E9E9E', marginTop: 1 },

  // Search bar
  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1A1A2E', padding: 0 },

  // Map container
  mapContainer: { flex: 1, marginHorizontal: 0 },
  mapBg: {
    flex: 1,
    backgroundColor: '#D8E8F0',
    position: 'relative',
    overflow: 'hidden',
  },

  // Glow blobs
  glow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 1,
  },

  // Map control buttons
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 14,
    gap: 8,
  },
  mapCtrlBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ android: { elevation: 3 } }),
  },

  // Location pins
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinRingBlue: {
    position: 'absolute',
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(21, 101, 192, 0.18)',
  },
  pinDotBlue: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#1565C0',
    ...Platform.select({ android: { elevation: 2 } }),
  },
  pinRingGreen: {
    position: 'absolute',
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(67, 160, 71, 0.22)',
  },
  pinDotGreen: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#2E7D32',
    ...Platform.select({ android: { elevation: 2 } }),
  },

  // Filter pills row
  filterRow: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    paddingBottom: 10,
  },
  filterContent: { paddingHorizontal: 14, gap: 8 },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    ...Platform.select({ android: { elevation: 2 } }),
  },
  filterPillActive: { borderWidth: 1.5, borderColor: '#1565C0' },
  filterDot: { width: 8, height: 8, borderRadius: 4 },
  filterText: { fontSize: 13, color: '#424242' },

  // Bottom info card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    ...Platform.select({ android: { elevation: 4 } }),
  },
  infoIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 15, color: '#1A1A2E', marginBottom: 3 },
  infoSub: { fontSize: 12, color: '#9E9E9E' },
  detailsBtn: {
    backgroundColor: '#1565C0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  detailsBtnText: { fontSize: 13, color: '#FFFFFF', textAlign: 'center', lineHeight: 18 },

  // Bottom tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
    paddingBottom: 14,
  },
  tabBarItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabBarLabel: { fontSize: 10, marginTop: 2 },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const ic = StyleSheet.create({
  // Back arrow
  arrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  arrowStem: {
    position: 'absolute', width: 16, height: 2, borderRadius: 1,
    backgroundColor: '#1A1A2E', left: 0, top: 6,
  },
  arrowHead: {
    position: 'absolute', width: 0, height: 0,
    borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 8,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
    borderRightColor: '#1A1A2E', left: 0, top: 2,
  },

  // Info circle
  infoCircle: {
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 1.8, borderColor: '#424242',
    alignItems: 'center', justifyContent: 'center',
  },
  infoText: { fontSize: 13, color: '#424242', fontWeight: '700', lineHeight: 16 },

  // Search
  searchWrap: { width: 18, height: 18 },
  searchCircle: {
    position: 'absolute', top: 0, left: 0,
    width: 13, height: 13, borderRadius: 7,
    borderWidth: 2, borderColor: '#9E9E9E',
  },
  searchHandle: {
    position: 'absolute', bottom: 0, right: 0,
    width: 7, height: 2, borderRadius: 1,
    backgroundColor: '#9E9E9E',
    transform: [{ rotate: '45deg' }],
  },

  // Target / crosshair
  targetWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  targetRing: {
    position: 'absolute',
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#9E9E9E',
  },
  targetH: {
    position: 'absolute', width: 20, height: 1.5, borderRadius: 1,
    backgroundColor: '#9E9E9E',
  },
  targetV: {
    position: 'absolute', width: 1.5, height: 20, borderRadius: 1,
    backgroundColor: '#9E9E9E',
  },
  targetDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: '#9E9E9E',
  },

  // Plus
  plusWrap: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  plusH: { position: 'absolute', width: 14, height: 2, borderRadius: 1 },
  plusV: { position: 'absolute', width: 2, height: 14, borderRadius: 1 },

  // Layers
  layersWrap: { width: 18, height: 18, position: 'relative' },
  layerBar: {
    position: 'absolute',
    left: 0, right: 0,
    height: 4, borderRadius: 1,
    backgroundColor: '#424242',
  },

  // Bar chart
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 5, borderRadius: 2 },

  // Home tab
  homeWrap: { width: 22, height: 20, alignItems: 'center' },
  homeRoof: {
    width: 0, height: 0,
    borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeDoor: { width: 8, height: 8, borderWidth: 1.5, borderRadius: 1 },

  // Map tab (folded map)
  mapWrap: { width: 24, height: 20, position: 'relative' },
  mapOuter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5, borderRadius: 2,
  },
  mapFold: {
    position: 'absolute', top: 0, bottom: 0,
    borderLeftWidth: 1.2,
  },

  // Stats tab
  statsWrap: { width: 22, height: 20, position: 'relative' },
  statsFrame: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5, borderRadius: 2,
  },
  statsBar1: {
    position: 'absolute', bottom: 3, left: 3,
    width: 4, height: 6, borderRadius: 1,
  },
  statsBar2: {
    position: 'absolute', bottom: 3, left: 9,
    width: 4, height: 10, borderRadius: 1,
  },
  statsBar3: {
    position: 'absolute', bottom: 3, left: 15,
    width: 4, height: 7, borderRadius: 1,
  },

  // Profile tab
  profileWrap: { width: 20, height: 20, alignItems: 'center' },
  profileHead: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.5, marginBottom: 2,
  },
  profileShoulder: {
    width: 18, height: 8,
    borderTopLeftRadius: 9, borderTopRightRadius: 9,
    borderWidth: 1.5, borderBottomWidth: 0,
  },
});
