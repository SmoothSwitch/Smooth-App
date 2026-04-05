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
  Dimensions,
} from 'react-native';

const { width: SCREEN_W } = Dimensions.get('window');

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

const StarIcon = ({ filled = false }) => (
  <View style={ic.starWrap}>
    {/* Five-pointed star drawn with two triangles and clipping illusion */}
    <View style={[ic.starBody, filled && { borderBottomColor: '#1565C0' }]} />
    <View style={[ic.starBodyInv, filled && { borderTopColor: '#1565C0' }]} />
  </View>
);

/** ✓ Solid green check-circle */
const CheckCircleFilled = () => (
  <View style={ic.checkFilled}>
    <View style={ic.checkStemFat} />
    <View style={ic.checkTickFat} />
  </View>
);

/** 💡 Bulb icon */
const BulbIcon = () => (
  <View style={ic.bulbWrap}>
    <View style={ic.bulbGlass} />
    <View style={ic.bulbBase1} />
    <View style={ic.bulbBase2} />
  </View>
);

// ─── Bottom-tab icon set ──────────────────────────────────────────────────────

const MapTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.mapWrap}>
      <View style={[ic.mapOuter, { borderColor: c }]} />
      <View style={[ic.mapFold, { left: 5, borderColor: c }]} />
      <View style={[ic.mapFold, { left: 11, borderColor: c }]} />
    </View>
  );
};

const AnalysisTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.anWrap}>
      <View style={[ic.anFrame, { borderColor: c }]} />
      <View style={[ic.anBar1, { backgroundColor: c }]} />
      <View style={[ic.anBar2, { backgroundColor: c }]} />
      <View style={[ic.anBar3, { backgroundColor: c }]} />
    </View>
  );
};

const FavTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.starBigWrap}>
      <View style={[ic.starBigBody, { borderBottomColor: c }]} />
      <View style={[ic.starBigInv, { borderTopColor: c }]} />
    </View>
  );
};

const SettingsTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.settWrap}>
      <View style={[ic.settCenter, { borderColor: c }]} />
      {[0, 45, 90, 135].map((deg, i) => (
        <View
          key={i}
          style={[ic.settTooth, { backgroundColor: c, transform: [{ rotate: `${deg}deg` }] }]}
        />
      ))}
    </View>
  );
};

// ─── Bar chart data ───────────────────────────────────────────────────────────
const BAR_DATA = [38, 55, 62, 48, 71, 65, 80, 58, 72, 50, 42, 35];
const MAX_BAR  = 80;
const CHART_H  = 80;

// ─── Carrier data ─────────────────────────────────────────────────────────────
const CARRIERS = [
  { key: 'A', name: 'Carrier Alpha',   color: '#2E7D32', score: 9.2, pct: 0.92, rating: 'EXCELLENT', ratingColor: '#2E7D32', barColor: '#2E7D32' },
  { key: 'B', name: 'Carrier Bravo',   color: '#1565C0', score: 7.4, pct: 0.74, rating: 'GOOD',      ratingColor: '#1565C0', barColor: '#1565C0' },
  { key: 'C', name: 'Carrier Charlie', color: '#E65100', score: 4.5, pct: 0.45, rating: 'FAIR',      ratingColor: '#E65100', barColor: '#E65100' },
];

const BOTTOM_TABS = [
  { key: 'Map',      label: 'MAP' },
  { key: 'Analysis', label: 'ANALYSIS' },
  { key: 'Favorites',label: 'FAVORITES' },
  { key: 'Settings', label: 'SETTINGS' },
];

// ─── Map placeholder grid lines ───────────────────────────────────────────────
const MapPlaceholder = () => (
  <View style={s.mapBox}>
    {/* Grid background */}
    <View style={s.mapGrid}>
      {/* Horizontal grid lines */}
      {[0.25, 0.5, 0.75].map((r, i) => (
        <View
          key={`h${i}`}
          style={[s.gridLineH, { top: `${r * 100}%` }]}
        />
      ))}
      {/* Vertical grid lines */}
      {[0.2, 0.4, 0.6, 0.8].map((c, i) => (
        <View
          key={`v${i}`}
          style={[s.gridLineV, { left: `${c * 100}%` }]}
        />
      ))}

      {/* Water blob */}
      <View style={s.mapWater} />

      {/* Road lines */}
      <View style={[s.road, { top: '42%', left: 0, right: 0, height: 3 }]} />
      <View style={[s.road, { top: 0, bottom: 0, left: '35%', width: 3 }]} />
      <View style={[s.road, { top: '65%', left: '20%', right: 0, height: 2 }]} />

      {/* Map pins */}
      <View style={[s.mapPin, { top: '30%', left: '25%', backgroundColor: '#2E7D32' }]} />
      <View style={[s.mapPin, { top: '50%', left: '55%', backgroundColor: '#1565C0' }]} />
      <View style={[s.mapPin, { top: '60%', left: '70%', backgroundColor: '#E65100' }]} />
    </View>

    {/* LIVE badge */}
    <View style={s.liveBadge}>
      <View style={s.liveDot} />
      <Text style={[s.liveText, gilroy('bold')]}>LIVE</Text>
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AreaAnalysisScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Analysis');

  const renderTabIcon = (key, active) => {
    if (key === 'Map')       return <MapTabIcon      active={active} />;
    if (key === 'Analysis')  return <AnalysisTabIcon active={active} />;
    if (key === 'Favorites') return <FavTabIcon      active={active} />;
    if (key === 'Settings')  return <SettingsTabIcon active={active} />;
    return null;
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.headerBtn}
          onPress={() => navigation?.goBack?.()}
          accessibilityLabel="Go back"
        >
          <BackArrow />
        </TouchableOpacity>

        <Text style={[s.headerTitle, gilroy('bold')]}>Area Analysis</Text>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="Bookmark area">
          <StarIcon />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map image placeholder */}
        <MapPlaceholder />

        {/* Location title row */}
        <View style={s.locationRow}>
          <Text style={[s.locationTitle, gilroy('bold')]}>Ikorodu, Lagos</Text>
          <TouchableOpacity style={s.favBtn} accessibilityLabel="Add to favorites">
            <StarIcon />
            <Text style={[s.favBtnText, gilroy('600')]}>Favorite</Text>
          </TouchableOpacity>
        </View>

        {/* Performance badge row */}
        <View style={s.perfRow}>
          <CheckCircleFilled />
          <Text style={[s.perfLabel, gilroy('600')]}>High Performance</Text>
          <Text style={[s.perfTime, gilroy('400')]}>  •  5 mins ago</Text>
        </View>

        {/* ── Stat cards row ─────────────────────────────────────────────────── */}
        <View style={s.statRow}>
          {/* Avg. Latency */}
          <View style={[s.statCard, { flex: 1, marginRight: 8 }]}>
            <Text style={[s.statLabel, gilroy('400')]}>Avg. Latency</Text>
            <View style={s.statValueRow}>
              <Text style={[s.statValue, gilroy('bold')]}>24ms</Text>
              <Text style={[s.statDelta, { color: '#E53935' }, gilroy('600')]}> -5%</Text>
            </View>
          </View>

          {/* Signal Strength */}
          <View style={[s.statCard, s.statCardGreen, { flex: 1 }]}>
            <Text style={[s.statLabel, gilroy('400')]}>Signal Strength</Text>
            <View style={s.statValueRow}>
              <Text style={[s.statValueLarge, gilroy('bold')]}>-85{'\n'}dBm</Text>
              <Text style={[s.statDelta, { color: '#2E7D32' }, gilroy('600')]}> +12%</Text>
            </View>
          </View>
        </View>

        {/* ── Historical Stability ─────────────────────────────────────────── */}
        <View style={s.sectionHeaderRow}>
          <Text style={[s.sectionTitle, gilroy('bold')]}>Historical Stability</Text>
          <Text style={[s.sectionSub, gilroy('400')]}>Last 24 Hours</Text>
        </View>

        {/* Bar chart */}
        <View style={s.chartContainer}>
          <View style={s.barsRow}>
            {BAR_DATA.map((val, idx) => {
              const barH  = (val / MAX_BAR) * CHART_H;
              const isActive = idx === 6; // tallest — highlight
              return (
                <View key={idx} style={[s.barWrap, { height: CHART_H }]}>
                  <View
                    style={[
                      s.bar,
                      {
                        height: barH,
                        backgroundColor: isActive ? '#1565C0' : '#90CAF9',
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>

          {/* Time labels */}
          <View style={s.timeLabels}>
            <Text style={[s.timeLabel, gilroy('400')]}>00:00</Text>
            <Text style={[s.timeLabel, gilroy('400')]}>12:00</Text>
            <Text style={[s.timeLabel, gilroy('400')]}>23:59</Text>
          </View>
        </View>

        {/* ── Carrier Performance ──────────────────────────────────────────── */}
        <Text style={[s.sectionTitle, gilroy('bold'), { marginBottom: 14 }]}>
          Carrier Performance
        </Text>

        {CARRIERS.map((carrier) => (
          <View key={carrier.key} style={s.carrierRow}>
            {/* Avatar */}
            <View style={[s.carrierAvatar, { backgroundColor: carrier.color }]}>
              <Text style={[s.carrierAvatarLetter, gilroy('bold')]}>{carrier.key}</Text>
            </View>

            {/* Name + progress */}
            <View style={s.carrierInfo}>
              <Text style={[s.carrierName, gilroy('600')]}>{carrier.name}</Text>
              <View style={s.progressTrack}>
                <View
                  style={[
                    s.progressFill,
                    {
                      width: `${carrier.pct * 100}%`,
                      backgroundColor: carrier.barColor,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Score + rating */}
            <View style={s.carrierScoreBox}>
              <Text style={[s.carrierScore, { color: carrier.ratingColor }, gilroy('bold')]}>
                {carrier.score.toFixed(1)}
              </Text>
              <Text style={[s.carrierRating, { color: carrier.ratingColor }, gilroy('600')]}>
                {carrier.rating}
              </Text>
            </View>
          </View>
        ))}

        {/* ── User Tip card ─────────────────────────────────────────────────── */}
        <View style={s.tipCard}>
          <View style={s.tipHeader}>
            <BulbIcon />
            <Text style={[s.tipTitle, gilroy('bold')]}>User Tip</Text>
          </View>
          <Text style={[s.tipBody, gilroy('400')]}>
            Carrier Alpha has the lowest jitter in this sector.{' '}
            <Text style={[gilroy('bold'), { color: '#1565C0' }]}>
              Switch to Carrier A
            </Text>{' '}
            for better high-definition video calls and gaming.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

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
              <Text
                style={[
                  s.tabBarLabel,
                  gilroy('500'),
                  { color: isActive ? '#1565C0' : '#9E9E9E' },
                ]}
              >
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
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 19, color: '#1A1A2E', textAlign: 'center' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 4 },

  // ── Map placeholder ────────────────────────────────────────────────────────
  mapBox: {
    height: 190,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    backgroundColor: '#D6E8F5',
    ...Platform.select({ android: { elevation: 2 } }),
  },
  mapGrid: { flex: 1, position: 'relative', overflow: 'hidden' },
  gridLineH: {
    position: 'absolute', left: 0, right: 0, height: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  gridLineV: {
    position: 'absolute', top: 0, bottom: 0, width: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  mapWater: {
    position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%',
    backgroundColor: '#A8CBEC',
  },
  road: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.6)' },
  mapPin: {
    position: 'absolute',
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: '#FFFFFF',
    ...Platform.select({ android: { elevation: 3 } }),
  },
  liveBadge: {
    position: 'absolute',
    bottom: 12, left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  liveDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#FFFFFF' },
  liveText: { fontSize: 11, color: '#FFFFFF', letterSpacing: 1 },

  // ── Location + Favorite ───────────────────────────────────────────────────
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationTitle: { fontSize: 24, color: '#1A1A2E', flexShrink: 1, marginRight: 10 },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#90CAF9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
  },
  favBtnText: { fontSize: 13, color: '#1565C0' },

  // ── Performance row ───────────────────────────────────────────────────────
  perfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  perfLabel: { fontSize: 14, color: '#2E7D32', marginLeft: 6 },
  perfTime:  { fontSize: 13, color: '#9E9E9E' },

  // ── Stat cards ────────────────────────────────────────────────────────────
  statRow: { flexDirection: 'row', marginBottom: 24 },
  statCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  statCardGreen: {
    backgroundColor: '#F0FBF1',
    borderColor: '#C8E6C9',
  },
  statLabel: { fontSize: 12, color: '#9E9E9E', marginBottom: 8 },
  statValueRow: { flexDirection: 'row', alignItems: 'flex-end' },
  statValue: { fontSize: 28, color: '#1A1A2E' },
  statValueLarge: { fontSize: 24, color: '#1A1A2E', lineHeight: 28 },
  statDelta: { fontSize: 13, marginBottom: 4 },

  // ── Historical Stability ─────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, color: '#1A1A2E' },
  sectionSub:   { fontSize: 12, color: '#9E9E9E' },

  // Bar chart
  chartContainer: { marginBottom: 26 },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: CHART_H,
    marginBottom: 8,
  },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 2 },
  bar:     { width: '100%', borderRadius: 4 },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  timeLabel: { fontSize: 11, color: '#9E9E9E' },

  // ── Carrier Performance ───────────────────────────────────────────────────
  carrierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  carrierAvatar: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  carrierAvatarLetter: { fontSize: 18, color: '#FFFFFF' },
  carrierInfo:  { flex: 1 },
  carrierName:  { fontSize: 14, color: '#1A1A2E', marginBottom: 6 },
  progressTrack: {
    height: 6, borderRadius: 3,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  carrierScoreBox: { alignItems: 'flex-end', flexShrink: 0 },
  carrierScore:  { fontSize: 18 },
  carrierRating: { fontSize: 10, letterSpacing: 0.5, marginTop: 2 },

  // ── User Tip card ─────────────────────────────────────────────────────────
  tipCard: {
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: { fontSize: 15, color: '#1565C0' },
  tipBody:  { fontSize: 13, color: '#424242', lineHeight: 20 },

  // ── Bottom Tab Bar ────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'android' ? 10 : 14,
  },
  tabBarItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabBarLabel: { fontSize: 9, letterSpacing: 0.3, marginTop: 2 },
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

  // Star (header)
  starWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  starBody: {
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 14,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: '#9E9E9E',
    position: 'absolute', top: 2,
  },
  starBodyInv: {
    width: 0, height: 0,
    borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#9E9E9E',
    position: 'absolute', top: 10,
  },

  // Check circle (solid green)
  checkFilled: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center', justifyContent: 'center',
  },
  checkStemFat: {
    position: 'absolute', bottom: 5, left: 5,
    width: 2.5, height: 6, borderRadius: 1,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  checkTickFat: {
    position: 'absolute', bottom: 5, right: 4,
    width: 2.5, height: 10, borderRadius: 1,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },

  // Bulb icon
  bulbWrap: { width: 20, height: 22, alignItems: 'center' },
  bulbGlass: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2, borderColor: '#1565C0',
    marginBottom: 1,
  },
  bulbBase1: {
    width: 10, height: 3,
    backgroundColor: '#1565C0',
    borderRadius: 1,
    marginBottom: 2,
  },
  bulbBase2: {
    width: 8, height: 2,
    backgroundColor: '#1565C0',
    borderRadius: 1,
  },

  // Map tab icon
  mapWrap: { width: 24, height: 20, position: 'relative' },
  mapOuter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5, borderRadius: 3,
  },
  mapFold: {
    position: 'absolute', top: 0, bottom: 0,
    width: 0, borderLeftWidth: 1.2,
  },

  // Analysis tab icon (bar chart in frame)
  anWrap: { width: 22, height: 20, position: 'relative' },
  anFrame: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5, borderRadius: 2,
  },
  anBar1: { position: 'absolute', bottom: 3, left: 3,  width: 3, height: 6,  borderRadius: 1 },
  anBar2: { position: 'absolute', bottom: 3, left: 8,  width: 3, height: 11, borderRadius: 1 },
  anBar3: { position: 'absolute', bottom: 3, left: 13, width: 3, height: 7,  borderRadius: 1 },

  // Favorites tab star (larger)
  starBigWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  starBigBody: {
    width: 0, height: 0,
    borderLeftWidth: 9, borderRightWidth: 9, borderBottomWidth: 16,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    position: 'absolute', top: 2,
  },
  starBigInv: {
    width: 0, height: 0,
    borderLeftWidth: 11, borderRightWidth: 11, borderTopWidth: 11,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    position: 'absolute', top: 11,
  },

  // Settings tab gear
  settWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  settCenter: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.7,
  },
  settTooth: {
    position: 'absolute',
    width: 3, height: 20, borderRadius: 1.5,
    opacity: 0.45,
  },
});
