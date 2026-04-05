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

/** ← back arrow */
const BackArrow = () => (
  <View style={ic.arrowWrap}>
    <View style={ic.arrowStem} />
    <View style={ic.arrowHead} />
  </View>
);

/** 🔍 search icon */
const SearchIcon = () => (
  <View style={ic.searchWrap}>
    <View style={ic.searchCircle} />
    <View style={ic.searchHandle} />
  </View>
);

/** ⊕ circle with plus — green, top-up success */
const CirclePlusIcon = ({ bg, color }) => (
  <View style={[ic.txCircle, { backgroundColor: bg }]}>
    <View style={[ic.cplusH, { backgroundColor: color }]} />
    <View style={[ic.cplusV, { backgroundColor: color }]} />
    <View style={[ic.cplusRing, { borderColor: color }]} />
  </View>
);

/** Bar chart icon — blue, data pack */
const BarIcon = ({ bg, color }) => (
  <View style={[ic.txCircle, { backgroundColor: bg }]}>
    <View style={ic.barsWrap}>
      <View style={[ic.bar, { height: 7, backgroundColor: color }]} />
      <View style={[ic.bar, { height: 11, backgroundColor: color }]} />
      <View style={[ic.bar, { height: 9, backgroundColor: color }]} />
    </View>
  </View>
);

/** Globe icon — orange/amber, roaming */
const GlobeIcon = ({ bg, color }) => (
  <View style={[ic.txCircle, { backgroundColor: bg }]}>
    <View style={[ic.globeOuter, { borderColor: color }]}>
      <View style={[ic.globeH, { borderColor: color }]} />
      <View style={[ic.globeV, { borderColor: color }]} />
    </View>
  </View>
);

/** Alert / exclamation icon — red, failed */
const AlertIcon = ({ bg, color }) => (
  <View style={[ic.txCircle, { backgroundColor: bg }]}>
    <View style={[ic.alertRing, { borderColor: color }]}>
      <View style={[ic.alertBar, { backgroundColor: color }]} />
      <View style={[ic.alertDot, { backgroundColor: color }]} />
    </View>
  </View>
);

/** Refresh / arrows icon — blue, auto-renew */
const RefreshIcon = ({ bg, color }) => (
  <View style={[ic.txCircle, { backgroundColor: bg }]}>
    <View style={[ic.refreshRing, { borderColor: color, borderTopColor: 'transparent' }]} />
    <View style={[ic.refreshArrow, { borderLeftColor: color }]} />
  </View>
);

// ─── Tab-bar icons ────────────────────────────────────────────────────────────
const HomeTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.homeWrap}>
      <View style={[ic.homeRoof, { borderBottomColor: c }]} />
      <View style={[ic.homeDoor, { borderColor: c }]} />
    </View>
  );
};

const PlansTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.plansGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={[ic.plansDot, { backgroundColor: c }]} />
      ))}
    </View>
  );
};

const WalletTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={[ic.tabWCard, { borderColor: c }]}>
      <View style={[ic.tabWStripe, { backgroundColor: c }]} />
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

// ─── Data ─────────────────────────────────────────────────────────────────────
const TABS = ['All', 'Top ups', 'Data', 'Roaming', 'Bills'];

const RECENT = [
  {
    id: '1',
    icon: 'plus',
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    title: 'Wallet Top-up',
    date: 'Oct 24, 2023 • 10:30 AM',
    amount: '+$50.00',
    amountColor: '#2E7D32',
    badge: 'SUCCESS',
    badgeStyle: 'success',
    strikethrough: false,
  },
  {
    id: '2',
    icon: 'bar',
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    title: '10GB Monthly Data Pack',
    date: 'Oct 22, 2023 • 02:15 PM',
    amount: '-$15.00',
    amountColor: '#1A1A2E',
    badge: 'COMPLETED',
    badgeStyle: 'completed',
    strikethrough: false,
  },
  {
    id: '3',
    icon: 'globe',
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
    title: 'EU Roaming Daily Pass',
    date: 'Oct 21, 2023 • 09:00 AM',
    amount: '-$4.99',
    amountColor: '#1A1A2E',
    badge: 'COMPLETED',
    badgeStyle: 'completed',
    strikethrough: false,
  },
];

const EARLIER = [
  {
    id: '4',
    icon: 'alert',
    iconBg: '#FFEBEE',
    iconColor: '#C62828',
    title: 'Wallet Top-up (Visa *4242)',
    date: 'Oct 15, 2023 • 11:20 PM',
    amount: '$25.00',
    amountColor: '#9E9E9E',
    badge: 'FAILED',
    badgeStyle: 'failed',
    strikethrough: true,
  },
  {
    id: '5',
    icon: 'refresh',
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    title: 'Auto-renew: Pro Plan',
    date: 'Oct 01, 2023 • 12:00 AM',
    amount: '-$29.00',
    amountColor: '#1A1A2E',
    badge: 'COMPLETED',
    badgeStyle: 'completed',
    strikethrough: false,
  },
];

const BOTTOM_TABS = [
  { key: 'Home',    label: 'Home' },
  { key: 'Plans',   label: 'Plans' },
  { key: 'Wallet',  label: 'Wallet' },
  { key: 'Profile', label: 'Profile' },
];

// ─── Badge styles ─────────────────────────────────────────────────────────────
const badgeConfig = {
  success:   { bg: '#E8F5E9', text: '#2E7D32' },
  completed: { bg: '#F5F5F5', text: '#757575' },
  failed:    { bg: '#FFEBEE', text: '#C62828' },
};

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function TransactionHistoryScreen({ navigation }) {
  const [activeTab, setActiveTab]       = useState('All');
  const [activeBottom, setActiveBottom] = useState('Wallet');

  const renderTxIcon = (tx) => {
    const { icon, iconBg, iconColor } = tx;
    if (icon === 'plus')    return <CirclePlusIcon bg={iconBg} color={iconColor} />;
    if (icon === 'bar')     return <BarIcon        bg={iconBg} color={iconColor} />;
    if (icon === 'globe')   return <GlobeIcon      bg={iconBg} color={iconColor} />;
    if (icon === 'alert')   return <AlertIcon      bg={iconBg} color={iconColor} />;
    if (icon === 'refresh') return <RefreshIcon    bg={iconBg} color={iconColor} />;
    return null;
  };

  const renderBottomIcon = (key, active) => {
    if (key === 'Home')    return <HomeTabIcon    active={active} />;
    if (key === 'Plans')   return <PlansTabIcon   active={active} />;
    if (key === 'Wallet')  return <WalletTabIcon  active={active} />;
    if (key === 'Profile') return <ProfileTabIcon active={active} />;
    return null;
  };

  const TxRow = ({ tx }) => {
    const badge = badgeConfig[tx.badgeStyle];
    return (
      <View style={s.txRow}>
        {renderTxIcon(tx)}
        <View style={s.txBody}>
          <Text style={[s.txTitle, gilroy('600')]}>{tx.title}</Text>
          <Text style={[s.txDate,  gilroy('400')]}>{tx.date}</Text>
        </View>
        <View style={s.txRight}>
          <Text
            style={[
              s.txAmount,
              gilroy('700'),
              { color: tx.amountColor },
              tx.strikethrough && s.strikethrough,
            ]}
          >
            {tx.amount}
          </Text>
          <View style={[s.badge, { backgroundColor: badge.bg }]}>
            <Text style={[s.badgeText, gilroy('600'), { color: badge.text }]}>
              {tx.badge}
            </Text>
          </View>
        </View>
      </View>
    );
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

        <Text style={[s.headerTitle, gilroy('bold')]}>Transaction History</Text>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="Search transactions">
          <SearchIcon />
        </TouchableOpacity>
      </View>

      {/* ── Filter tabs ─────────────────────────────────────────────────────── */}
      <View style={s.tabsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsContent}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={s.tabBtn}
                onPress={() => setActiveTab(tab)}
                accessibilityLabel={`Filter by ${tab}`}
              >
                <Text style={[s.tabText, gilroy('600'), isActive && s.tabTextActive]}>
                  {tab}
                </Text>
                {isActive && <View style={s.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance card */}
        <View style={s.balanceCard}>
          <Text style={[s.balanceLabel, gilroy('600')]}>CURRENT BALANCE</Text>
          <View style={s.balanceAmountRow}>
            <Text style={[s.balanceAmount, gilroy('bold')]}>$1,248.50</Text>
            <Text style={[s.balanceCurrency, gilroy('500')]}>USD</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <Text style={[s.sectionLabel, gilroy('600')]}>RECENT TRANSACTIONS</Text>

        {RECENT.map((tx) => (
          <TxRow key={tx.id} tx={tx} />
        ))}

        {/* Earlier This Month */}
        <Text style={[s.sectionLabel, gilroy('600'), { marginTop: 8 }]}>
          EARLIER THIS MONTH
        </Text>

        {EARLIER.map((tx) => (
          <TxRow key={tx.id} tx={tx} />
        ))}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Tab Bar ───────────────────────────────────────────────────── */}
      <View style={s.tabBar}>
        {BOTTOM_TABS.map((tab) => {
          const isActive = activeBottom === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={s.tabBarItem}
              onPress={() => setActiveBottom(tab.key)}
              accessibilityLabel={tab.label}
            >
              {renderBottomIcon(tab.key, isActive)}
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

// ─── Styles ───────────────────────────────────────────────────────────────────
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
  headerTitle: { flex: 1, fontSize: 19, color: '#1A1A2E', marginLeft: 4 },

  // Filter tabs
  tabsRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabsContent: { paddingHorizontal: 14 },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabText: { fontSize: 14, color: '#9E9E9E' },
  tabTextActive: { color: '#1565C0' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0, right: 0,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: '#1565C0',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 16 },

  // Balance card
  balanceCard: {
    backgroundColor: '#1565C0',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 20,
    marginBottom: 24,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  balanceLabel: {
    fontSize: 11,
    letterSpacing: 1.3,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 8,
  },
  balanceAmountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  balanceAmount: { fontSize: 38, color: '#FFFFFF' },
  balanceCurrency: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 6 },

  // Section label
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#9E9E9E',
    marginBottom: 10,
  },

  // Transaction row
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 2,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  txBody: { flex: 1, marginLeft: 14 },
  txTitle: { fontSize: 14, color: '#1A1A2E', marginBottom: 3 },
  txDate:  { fontSize: 11, color: '#9E9E9E' },
  txRight: { alignItems: 'flex-end', gap: 5 },
  txAmount: { fontSize: 14 },
  strikethrough: { textDecorationLine: 'line-through', color: '#9E9E9E' },

  // Badge
  badge: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 9, letterSpacing: 0.5 },

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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabBarLabel: { fontSize: 10, marginTop: 2, letterSpacing: 0.2 },
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

  // Search
  searchWrap: { width: 20, height: 20 },
  searchCircle: {
    position: 'absolute', top: 0, left: 0,
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 2, borderColor: '#424242',
  },
  searchHandle: {
    position: 'absolute', bottom: 0, right: 0,
    width: 7, height: 2, borderRadius: 1,
    backgroundColor: '#424242',
    transform: [{ rotate: '45deg' }],
  },

  // Transaction icon circle
  txCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },

  // Circle + plus
  cplusRing: {
    position: 'absolute',
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.8,
  },
  cplusH: {
    position: 'absolute', width: 12, height: 2, borderRadius: 1,
  },
  cplusV: {
    position: 'absolute', width: 2, height: 12, borderRadius: 1,
  },

  // Bar chart
  barsWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1.5 },

  // Globe
  globeOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.8, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  globeH: {
    position: 'absolute',
    width: 22, height: 0,
    borderTopWidth: 1.2,
  },
  globeV: {
    position: 'absolute',
    width: 0, height: 22,
    borderLeftWidth: 1.2,
  },

  // Alert
  alertRing: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 1.8, alignItems: 'center', justifyContent: 'center',
  },
  alertBar: { width: 2, height: 8, borderRadius: 1, marginBottom: 2 },
  alertDot: { width: 3, height: 3, borderRadius: 1.5 },

  // Refresh
  refreshRing: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  refreshArrow: {
    position: 'absolute', top: 4, right: 4,
    width: 0, height: 0,
    borderTopWidth: 4, borderBottomWidth: 4, borderLeftWidth: 7,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
  },

  // Home tab
  homeWrap: { width: 22, height: 20, alignItems: 'center' },
  homeRoof: {
    width: 0, height: 0,
    borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeDoor: { width: 8, height: 8, borderWidth: 1.5, borderRadius: 1 },

  // Plans (2×2 grid)
  plansGrid: {
    width: 20, height: 20,
    flexDirection: 'row', flexWrap: 'wrap', gap: 3,
    alignContent: 'center', justifyContent: 'center',
  },
  plansDot: { width: 7, height: 7, borderRadius: 2 },

  // Wallet tab
  tabWCard: {
    width: 24, height: 17, borderWidth: 1.5, borderRadius: 3,
    overflow: 'hidden', justifyContent: 'flex-start',
  },
  tabWStripe: { height: 4, marginTop: 4 },

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
