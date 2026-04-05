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
  Switch,
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

/** ⓘ blue circle question mark */
const HelpIcon = () => (
  <View style={ic.helpCircle}>
    <Text style={ic.helpText}>?</Text>
  </View>
);

/** SIM card placeholder image */
const SimCardImage = () => (
  <View style={ic.simImageOuter}>
    {/* dark body */}
    <View style={ic.simImageBody}>
      {/* chip */}
      <View style={ic.simChip} />
      {/* notch */}
      <View style={ic.simNotch} />
    </View>
  </View>
);

/** Bar chart icon — for Use SIM / Preferred network */
const BarChartIcon = ({ color = '#1565C0' }) => (
  <View style={ic.barsRow}>
    <View style={[ic.bar, { height: 7,  backgroundColor: color }]} />
    <View style={[ic.bar, { height: 12, backgroundColor: color }]} />
    <View style={[ic.bar, { height: 9,  backgroundColor: color }]} />
  </View>
);

/** Globe icon — for Data roaming */
const GlobeIcon = ({ color = '#2E7D32' }) => (
  <View style={[ic.globeOuter, { borderColor: color }]}>
    <View style={[ic.globeH, { bordercolor: color, borderTopColor: color }]} />
    <View style={[ic.globeV, { borderColor: color }]} />
  </View>
);

/** WiFi / APN icon */
const WifiIcon = ({ color = '#546E7A' }) => (
  <View style={ic.wifiWrap}>
    <View style={[ic.wifiArc1, { borderColor: color }]} />
    <View style={[ic.wifiArc2, { borderColor: color }]} />
    <View style={[ic.wifiArc3, { borderColor: color }]} />
    <View style={[ic.wifiDot, { backgroundColor: color }]} />
  </View>
);

/** Antenna / network operators icon */
const AntennaIcon = ({ color = '#546E7A' }) => (
  <View style={ic.antennaWrap}>
    <View style={[ic.antennaArc1, { borderColor: color }]} />
    <View style={[ic.antennaArc2, { borderColor: color }]} />
    <View style={[ic.antennaPole, { backgroundColor: color }]} />
    <View style={[ic.antennaBase, { backgroundColor: color }]} />
  </View>
);

/** Lock icon */
const LockIcon = ({ color = '#546E7A' }) => (
  <View style={ic.lockWrap}>
    <View style={[ic.lockShackle, { borderColor: color }]} />
    <View style={[ic.lockBody, { borderColor: color }]}>
      <View style={[ic.lockKeyhole, { backgroundColor: color }]} />
    </View>
  </View>
);

/** Trash / bin icon */
const TrashIcon = ({ color = '#9E9E9E' }) => (
  <View style={ic.trashWrap}>
    <View style={[ic.trashLid, { backgroundColor: color }]} />
    <View style={[ic.trashBody, { borderColor: color }]}>
      <View style={[ic.trashLine, { backgroundColor: color }]} />
      <View style={[ic.trashLine, { backgroundColor: color }]} />
      <View style={[ic.trashLine, { backgroundColor: color }]} />
    </View>
  </View>
);

/** › chevron right */
const ChevronRight = () => (
  <View style={ic.chevWrap}>
    <View style={ic.chevTop} />
    <View style={ic.chevBot} />
  </View>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Section heading */
const SectionLabel = ({ label, style }) => (
  <Text style={[s.sectionLabel, gilroy('600'), style]}>{label}</Text>
);

/** Toggle row */
const ToggleRow = ({ icon, title, subtitle, value, onValueChange }) => (
  <View style={s.row}>
    <View style={s.rowIconWrap}>{icon}</View>
    <View style={s.rowBody}>
      <Text style={[s.rowTitle, gilroy('600')]}>{title}</Text>
      <Text style={[s.rowSub, gilroy('400')]}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#D9D9D9', true: '#1565C0' }}
      thumbColor="#FFFFFF"
      ios_backgroundColor="#D9D9D9"
    />
  </View>
);

/** Chevron (nav) row */
const NavRow = ({ icon, title, subtitle, subtitleBlue }) => (
  <TouchableOpacity style={s.row} activeOpacity={0.7}>
    <View style={s.rowIconWrap}>{icon}</View>
    <View style={s.rowBody}>
      <Text style={[s.rowTitle, gilroy('600')]}>{title}</Text>
      <Text style={[s.rowSub, gilroy('400'), subtitleBlue && { color: '#1565C0' }]}>
        {subtitle}
      </Text>
    </View>
    <ChevronRight />
  </TouchableOpacity>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SIMSettingsScreen({ navigation }) {
  const [useSIM, setUseSIM]       = useState(true);
  const [roaming, setRoaming]     = useState(false);
  const [lockSIM, setLockSIM]     = useState(false);

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

        <Text style={[s.headerTitle, gilroy('bold')]}>SIM settings</Text>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="Help">
          <HelpIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── SIM info card ────────────────────────────────────────────────── */}
        <View style={s.simCard}>
          <SimCardImage />
          <View style={s.simCardInfo}>
            <Text style={[s.simCardName, gilroy('bold')]}>SmoothSwitch SIM</Text>
            <View style={s.activeRow}>
              <View style={s.greenDot} />
              <Text style={[s.activeText, gilroy('600')]}>ACTIVE</Text>
            </View>
            <Text style={[s.simPhone, gilroy('400')]}>+1 (555) 012-3456</Text>
          </View>
        </View>

        {/* ── NETWORK STATUS ───────────────────────────────────────────────── */}
        <SectionLabel label="NETWORK STATUS" style={{ marginTop: 8 }} />

        <View style={s.card}>
          <ToggleRow
            icon={
              <View style={[s.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <BarChartIcon color="#1565C0" />
              </View>
            }
            title="Use SIM"
            subtitle="Enable or disable this cellular line"
            value={useSIM}
            onValueChange={setUseSIM}
          />

          <View style={s.divider} />

          <ToggleRow
            icon={
              <View style={[s.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <GlobeIcon color="#2E7D32" />
              </View>
            }
            title="Data roaming"
            subtitle="Connect to data services when roaming"
            value={roaming}
            onValueChange={setRoaming}
          />
        </View>

        {/* ── ADVANCED SETTINGS ────────────────────────────────────────────── */}
        <SectionLabel label="ADVANCED SETTINGS" />

        <View style={s.card}>
          <NavRow
            icon={
              <View style={[s.iconBox, { backgroundColor: '#F5F5F5' }]}>
                <BarChartIcon color="#546E7A" />
              </View>
            }
            title="Preferred network type"
            subtitle="5G (Recommended)"
            subtitleBlue
          />

          <View style={s.divider} />

          <NavRow
            icon={
              <View style={[s.iconBox, { backgroundColor: '#F5F5F5' }]}>
                <WifiIcon />
              </View>
            }
            title="Access Point Names"
            subtitle="APN settings for mobile data"
          />

          <View style={s.divider} />

          <NavRow
            icon={
              <View style={[s.iconBox, { backgroundColor: '#F5F5F5' }]}>
                <AntennaIcon />
              </View>
            }
            title="Network operators"
            subtitle="Automatically select network"
          />
        </View>

        {/* ── SECURITY ─────────────────────────────────────────────────────── */}
        <SectionLabel label="SECURITY" />

        <View style={s.card}>
          <ToggleRow
            icon={
              <View style={[s.iconBox, { backgroundColor: '#F5F5F5' }]}>
                <LockIcon />
              </View>
            }
            title="Lock SIM card"
            subtitle="Require PIN to use SIM"
            value={lockSIM}
            onValueChange={setLockSIM}
          />
        </View>

        {/* ── Remove eSIM button ───────────────────────────────────────────── */}
        <TouchableOpacity
          style={s.removeBtn}
          activeOpacity={0.75}
          accessibilityLabel="Remove eSIM"
        >
          <TrashIcon color="#9E9E9E" />
          <Text style={[s.removeText, gilroy('600')]}>Remove eSIM</Text>
        </TouchableOpacity>

        {/* ── Footer text ──────────────────────────────────────────────────── */}
        <View style={s.footer}>
          <Text style={[s.footerText, gilroy('400')]}>SIM ID: 89014103211100293458</Text>
          <Text style={[s.footerText, gilroy('400')]}>SmoothSwitch Network © 2024</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
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
  headerTitle: { flex: 1, fontSize: 19, color: '#1A1A2E' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 4 },

  // SIM info card
  simCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 16,
    ...Platform.select({ android: { elevation: 1 } }),
  },
  simCardInfo: { flex: 1 },
  simCardName: { fontSize: 18, color: '#1A1A2E', marginBottom: 4 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#43A047' },
  activeText: { fontSize: 12, color: '#2E7D32', letterSpacing: 0.5 },
  simPhone: { fontSize: 13, color: '#546E7A' },

  // Section label
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#9E9E9E',
    marginBottom: 10,
  },

  // Settings card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 22,
    overflow: 'hidden',
    ...Platform.select({ android: { elevation: 1 } }),
  },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginLeft: 70 },

  // Row (shared)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowIconWrap: { flexShrink: 0 },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, color: '#1A1A2E', marginBottom: 2 },
  rowSub: { fontSize: 12, color: '#9E9E9E', lineHeight: 17 },

  // Icon box (square bg for row icons)
  iconBox: {
    width: 40, height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Remove eSIM button
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 10,
    marginBottom: 20,
  },
  removeText: { fontSize: 15, color: '#9E9E9E' },

  // Footer
  footer: { alignItems: 'center', gap: 4, marginBottom: 8 },
  footerText: { fontSize: 11, color: '#BDBDBD' },
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

  // Help
  helpCircle: {
    width: 28, height: 28, borderRadius: 14,
    borderWidth: 1.8, borderColor: '#1565C0',
    alignItems: 'center', justifyContent: 'center',
  },
  helpText: {
    fontSize: 14, color: '#1565C0', fontWeight: '700', lineHeight: 18,
  },

  // SIM card image
  simImageOuter: {
    width: 60, height: 60, borderRadius: 12, overflow: 'hidden',
    ...Platform.select({ android: { elevation: 2 } }),
  },
  simImageBody: {
    flex: 1,
    backgroundColor: '#1A237E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simChip: {
    width: 28, height: 22, borderRadius: 4,
    backgroundColor: '#C9A84C',
    borderWidth: 1, borderColor: '#A0842E',
  },
  simNotch: {
    position: 'absolute', top: 0, right: 0,
    width: 14, height: 14,
    backgroundColor: '#0D47A1',
    borderBottomLeftRadius: 8,
  },

  // Bar chart
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1.5 },

  // Globe
  globeOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 1.8, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  globeH: { position: 'absolute', width: 20, height: 0, borderTopWidth: 1.2 },
  globeV: { position: 'absolute', width: 0, height: 20, borderLeftWidth: 1.2 },

  // Wifi
  wifiWrap: { width: 22, height: 18, alignItems: 'center', justifyContent: 'flex-end' },
  wifiArc1: {
    position: 'absolute', bottom: 4,
    width: 20, height: 14, borderRadius: 10,
    borderWidth: 2, borderBottomColor: 'transparent',
  },
  wifiArc2: {
    position: 'absolute', bottom: 4,
    width: 13, height: 9, borderRadius: 7,
    borderWidth: 2, borderBottomColor: 'transparent',
  },
  wifiArc3: {
    position: 'absolute', bottom: 4,
    width: 6, height: 5, borderRadius: 4,
    borderWidth: 2, borderBottomColor: 'transparent',
  },
  wifiDot: { width: 4, height: 4, borderRadius: 2, marginBottom: 0 },

  // Antenna
  antennaWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' },
  antennaArc1: {
    position: 'absolute', top: 0,
    width: 20, height: 14, borderRadius: 10,
    borderWidth: 1.8, borderBottomColor: 'transparent',
  },
  antennaArc2: {
    position: 'absolute', top: 4,
    width: 13, height: 9, borderRadius: 7,
    borderWidth: 1.8, borderBottomColor: 'transparent',
  },
  antennaPole: { width: 2, height: 10, borderRadius: 1, marginBottom: 0 },
  antennaBase: { width: 10, height: 2, borderRadius: 1 },

  // Lock
  lockWrap: { width: 18, height: 22, alignItems: 'center' },
  lockShackle: {
    width: 12, height: 8,
    borderTopLeftRadius: 6, borderTopRightRadius: 6,
    borderWidth: 2.5, borderBottomWidth: 0,
    marginBottom: -1,
  },
  lockBody: {
    width: 18, height: 13, borderRadius: 3,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  lockKeyhole: { width: 4, height: 6, borderRadius: 2 },

  // Trash
  trashWrap: { width: 18, height: 20, alignItems: 'center' },
  trashLid: {
    width: 18, height: 3, borderRadius: 1.5,
    marginBottom: 2,
  },
  trashBody: {
    width: 14, height: 14,
    borderWidth: 1.8, borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 2,
  },
  trashLine: { width: 1.5, height: 7, borderRadius: 1 },

  // Chevron right
  chevWrap: { width: 10, height: 18, justifyContent: 'center' },
  chevTop: {
    position: 'absolute', top: 3,
    width: 9, height: 2, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '45deg' }],
  },
  chevBot: {
    position: 'absolute', bottom: 3,
    width: 9, height: 2, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },
});
