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

const DotsMenu = () => (
  <View style={ic.dotsWrap}>
    {[0, 1, 2].map((i) => <View key={i} style={ic.dot} />)}
  </View>
);

/** SIM card icon (white outline, for blue button) */
const SimCardIcon = () => (
  <View style={ic.simOuter}>
    <View style={ic.simNotch} />
    <View style={ic.simChip} />
  </View>
);

/** › chevron right (white) */
const ChevronRightWhite = () => (
  <View style={ic.chevWrap}>
    <View style={[ic.chevTop, { backgroundColor: '#FFFFFF' }]} />
    <View style={[ic.chevBot, { backgroundColor: '#FFFFFF' }]} />
  </View>
);

/** › chevron right (grey) */
const ChevronRightGrey = () => (
  <View style={ic.chevWrap}>
    <View style={[ic.chevTop, { backgroundColor: '#BDBDBD' }]} />
    <View style={[ic.chevBot, { backgroundColor: '#BDBDBD' }]} />
  </View>
);

/** ⚙ Settings gear icon */
const GearIcon = () => (
  <View style={ic.gearOuter}>
    <View style={ic.gearCenter} />
    {[0, 45, 90, 135].map((deg, i) => (
      <View
        key={i}
        style={[ic.gearTooth, { transform: [{ rotate: `${deg}deg` }] }]}
      />
    ))}
  </View>
);

/** ✓ checkmark circle (green) */
const CheckCircleGreen = () => (
  <View style={ic.checkCircle}>
    <View style={ic.checkStem} />
    <View style={ic.checkTick} />
  </View>
);

/** ◎ circle outline for Secondary label */
const CircleOutline = () => (
  <View style={ic.circleOutline} />
);

/** eSIM card download icon (grey, for inactive row) */
const SimDownloadIcon = () => (
  <View style={ic.simDlOuter}>
    <View style={ic.simDlBar} />
    <View style={ic.simDlArrow} />
    <View style={ic.simDlBase} />
  </View>
);

// ─── Bottom tab icons ─────────────────────────────────────────────────────────

const SimsTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={[ic.simTabOuter, { borderColor: c }]}>
      <View style={[ic.simTabNotch, { backgroundColor: c }]} />
      <View style={[ic.simTabChip, { backgroundColor: c }]} />
    </View>
  );
};

const UsageTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.barsRow}>
      <View style={[ic.usageBar, { height: 8,  backgroundColor: c }]} />
      <View style={[ic.usageBar, { height: 14, backgroundColor: c }]} />
      <View style={[ic.usageBar, { height: 10, backgroundColor: c }]} />
    </View>
  );
};

const SettingsTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.settGearOuter}>
      <View style={[ic.settGearCenter, { borderColor: c }]} />
      {[0, 45, 90, 135].map((deg, i) => (
        <View
          key={i}
          style={[ic.settGearTooth, { backgroundColor: c, transform: [{ rotate: `${deg}deg` }] }]}
        />
      ))}
    </View>
  );
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const BOTTOM_TABS = [
  { key: 'SIMs',     label: 'SIMs' },
  { key: 'Usage',    label: 'Usage' },
  { key: 'Settings', label: 'Settings' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SIMManagerScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('SIMs');

  const renderBottomIcon = (key, active) => {
    if (key === 'SIMs')     return <SimsTabIcon     active={active} />;
    if (key === 'Usage')    return <UsageTabIcon    active={active} />;
    if (key === 'Settings') return <SettingsTabIcon active={active} />;
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

        <Text style={[s.headerTitle, gilroy('bold')]}>SIM Manager</Text>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="More options">
          <DotsMenu />
        </TouchableOpacity>
      </View>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add new eSIM button */}
        <TouchableOpacity
          style={s.addEsimBtn}
          activeOpacity={0.85}
          accessibilityLabel="Add new eSIM"
        >
          <SimCardIcon />
          <Text style={[s.addEsimText, gilroy('bold')]}>Add new eSIM</Text>
          <ChevronRightWhite />
        </TouchableOpacity>

        {/* ── ACTIVE CONNECTIONS ─────────────────────────────────────────────── */}
        <View style={s.sectionHeaderRow}>
          <Text style={[s.sectionLabel, gilroy('600')]}>ACTIVE CONNECTIONS</Text>
          <View style={s.activePill}>
            <Text style={[s.activePillText, gilroy('500')]}>2 Active</Text>
          </View>
        </View>

        {/* MTN Row */}
        <View style={s.simCard}>
          <View style={s.simLogoWrap}>
            {/* MTN — dark teal square */}
            <View style={[s.simLogoBox, { backgroundColor: '#1B4F4A' }]}>
              <View style={s.mtnSlash} />
            </View>
            <View style={s.greenDot} />
          </View>

          <View style={s.simInfo}>
            <View style={s.simTitleRow}>
              <Text style={[s.simName, gilroy('bold')]}>MTN</Text>
              <View style={s.badgeGrey}>
                <Text style={[s.badgeGreyText, gilroy('600')]}>PHYSICAL</Text>
              </View>
            </View>
            <Text style={[s.simNumber, gilroy('400')]}>+234 (0) 803 123 4567</Text>
            <View style={s.simStatusRow}>
              <CheckCircleGreen />
              <Text style={[s.simPrimaryText, gilroy('600')]}>Primary Data</Text>
            </View>
          </View>

          <TouchableOpacity accessibilityLabel="MTN settings">
            <GearIcon />
          </TouchableOpacity>
        </View>

        {/* Airtel Row */}
        <View style={s.simCard}>
          <View style={s.simLogoWrap}>
            {/* Airtel — red square with T */}
            <View style={[s.simLogoBox, { backgroundColor: '#B71C1C' }]}>
              <Text style={[s.simLogoLetter, gilroy('bold')]}>T</Text>
            </View>
            <View style={s.greenDot} />
          </View>

          <View style={s.simInfo}>
            <View style={s.simTitleRow}>
              <Text style={[s.simName, gilroy('bold')]}>Airtel</Text>
              <View style={s.badgeBlue}>
                <Text style={[s.badgeBlueText, gilroy('600')]}>ESIM</Text>
              </View>
            </View>
            <Text style={[s.simNumber, gilroy('400')]}>+234 (0) 902 987 6543</Text>
            <View style={s.simStatusRow}>
              <CircleOutline />
              <Text style={[s.simSecondaryText, gilroy('500')]}>Secondary</Text>
            </View>
          </View>

          <TouchableOpacity accessibilityLabel="Airtel settings">
            <GearIcon />
          </TouchableOpacity>
        </View>

        {/* ── AVAILABLE FOR RE-ACTIVATION ────────────────────────────────────── */}
        <Text style={[s.sectionLabel, gilroy('600'), { marginTop: 10 }]}>
          AVAILABLE FOR RE-ACTIVATION
        </Text>

        {/* Glo inactive row */}
        <View style={s.inactiveCard}>
          <View style={s.simLogoWrap}>
            <View style={[s.simLogoBox, { backgroundColor: '#EEEEEE' }]}>
              <SimDownloadIcon />
            </View>
          </View>

          <View style={s.simInfo}>
            <Text style={[s.simNameInactive, gilroy('600')]}>Glo</Text>
            <Text style={[s.simNumberInactive, gilroy('400')]}>+234 (0) 805 900 1234</Text>
          </View>

          <TouchableOpacity accessibilityLabel="Activate Glo SIM">
            <Text style={[s.activateLink, gilroy('600')]}>Activate</Text>
          </TouchableOpacity>
        </View>

        {/* ── Data Usage card ─────────────────────────────────────────────────── */}
        <View style={s.dataCard}>
          <View style={s.dataCardHeader}>
            <Text style={[s.dataCardTitle, gilroy('bold')]}>Data Usage</Text>
            <Text style={[s.dataCardAmount, gilroy('bold')]}>12.4 GB / 20 GB</Text>
          </View>

          {/* Progress bar */}
          <View style={s.progressTrack}>
            <View style={s.progressFill} />
          </View>

          <Text style={[s.dataCardSub, gilroy('400')]}>
            Resetting in 8 days. Based on MTN Primary Data.
          </Text>
        </View>

        <View style={{ height: 16 }} />
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
              {renderBottomIcon(tab.key, isActive)}
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
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 19, color: '#1A1A2E', textAlign: 'center' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 6 },

  // Add eSIM button
  addEsimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 24,
    gap: 14,
    ...Platform.select({ android: { elevation: 3 } }),
  },
  addEsimText: { flex: 1, fontSize: 16, color: '#FFFFFF' },

  // Section header row
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#9E9E9E',
  },
  activePill: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  activePillText: { fontSize: 12, color: '#616161' },

  // SIM card row
  simCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    ...Platform.select({ android: { elevation: 1 } }),
  },
  simLogoWrap: { position: 'relative', marginRight: 14 },
  simLogoBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  simLogoLetter: { fontSize: 22, color: '#FFFFFF' },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#43A047',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  simInfo: { flex: 1 },
  simTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  simName: { fontSize: 16, color: '#1A1A2E' },
  simNumber: { fontSize: 12, color: '#757575', marginBottom: 5 },
  simStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  simPrimaryText: { fontSize: 13, color: '#2E7D32' },
  simSecondaryText: { fontSize: 13, color: '#424242' },

  // Badges
  badgeGrey: {
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeGreyText: { fontSize: 9, color: '#616161', letterSpacing: 0.4 },
  badgeBlue: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeBlueText: { fontSize: 9, color: '#1565C0', letterSpacing: 0.4 },

  // Inactive row
  inactiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  simNameInactive: { fontSize: 15, color: '#9E9E9E', marginBottom: 2 },
  simNumberInactive: { fontSize: 12, color: '#BDBDBD' },
  activateLink: { fontSize: 14, color: '#1565C0' },

  // Data usage card
  dataCard: {
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DCEEFB',
  },
  dataCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dataCardTitle: { fontSize: 15, color: '#1A1A2E' },
  dataCardAmount: { fontSize: 15, color: '#1565C0' },
  progressTrack: {
    height: 8,
    backgroundColor: '#C9DFFA',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    width: '62%',   // 12.4 / 20 ≈ 62%
    height: '100%',
    backgroundColor: '#1565C0',
    borderRadius: 4,
  },
  dataCardSub: { fontSize: 12, color: '#78909C' },

  // Bottom tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
    paddingBottom: 14,
  },
  tabBarItem: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4,
  },
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

  // Three dots
  dotsWrap: { gap: 4, alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#424242' },

  // SIM card icon (white, on blue button)
  simOuter: {
    width: 26, height: 22, borderRadius: 4,
    borderWidth: 2, borderColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  simNotch: {
    position: 'absolute', top: -1, right: -1,
    width: 8, height: 8,
    backgroundColor: '#1565C0',
    borderBottomLeftRadius: 4,
  },
  simChip: {
    width: 10, height: 8, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },

  // Chevron right
  chevWrap: { width: 10, height: 18, justifyContent: 'center' },
  chevTop: {
    position: 'absolute', top: 3,
    width: 9, height: 2, borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  chevBot: {
    position: 'absolute', bottom: 3,
    width: 9, height: 2, borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },

  // Gear icon
  gearOuter: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  gearCenter: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2, borderColor: '#BDBDBD',
  },
  gearTooth: {
    position: 'absolute',
    width: 4, height: 20,
    borderRadius: 2, backgroundColor: '#BDBDBD',
    opacity: 0.5,
  },

  // Check circle (green)
  checkCircle: {
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#2E7D32',
    alignItems: 'center', justifyContent: 'center',
  },
  checkStem: {
    position: 'absolute', bottom: 3, left: 3,
    width: 2, height: 5, borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '45deg' }],
  },
  checkTick: {
    position: 'absolute', bottom: 3, right: 2,
    width: 2, height: 8, borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '-45deg' }],
  },

  // Circle outline (secondary)
  circleOutline: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: '#9E9E9E',
  },

  // MTN slash mark
  mtnSlash: {
    width: 2, height: 28,
    backgroundColor: 'rgba(255,255,255,0.4)',
    transform: [{ rotate: '-30deg' }],
  },

  // eSIM download icon (grey, inactive)
  simDlOuter: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  simDlBar: {
    width: 2, height: 10, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    position: 'absolute', top: 1,
  },
  simDlArrow: {
    position: 'absolute', top: 8,
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#BDBDBD',
  },
  simDlBase: {
    position: 'absolute', bottom: 2,
    width: 14, height: 2, borderRadius: 1,
    backgroundColor: '#BDBDBD',
  },

  // SIMs tab icon
  simTabOuter: {
    width: 22, height: 18, borderRadius: 3,
    borderWidth: 1.5, overflow: 'hidden',
    alignItems: 'center',
  },
  simTabNotch: { position: 'absolute', top: 0, right: 0, width: 6, height: 6, borderBottomLeftRadius: 3 },
  simTabChip: {
    width: 9, height: 7, borderRadius: 1.5,
    marginTop: 6,
  },

  // Usage tab bars
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  usageBar: { width: 5, borderRadius: 2 },

  // Settings tab gear
  settGearOuter: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  settGearCenter: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.7,
  },
  settGearTooth: {
    position: 'absolute',
    width: 3, height: 20, borderRadius: 1.5,
    opacity: 0.45,
  },

  // Profile (unused but kept for completeness)
  profileWrap: { width: 20, height: 20, alignItems: 'center' },
  profileHead: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, marginBottom: 2 },
  profileShoulder: { width: 18, height: 8, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderWidth: 1.5, borderBottomWidth: 0 },
});
