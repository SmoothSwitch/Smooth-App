import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

// ─── Icon primitives (pure RN, no third‑party icon lib) ─────────────────────

const WalletIcon = () => (
  <View style={styles.walletIconInner}>
    {/* card body */}
    <View style={styles.wiCard} />
    {/* mag stripe */}
    <View style={styles.wiStripe} />
    {/* chip */}
    <View style={styles.wiChip} />
  </View>
);

const BellIcon = () => (
  <View style={styles.bellWrap}>
    <View style={styles.bellBody} />
    <View style={styles.bellBottom} />
    <View style={styles.bellDot} />
  </View>
);

const PlusIcon = () => (
  <View style={styles.plusWrap}>
    <View style={styles.plusH} />
    <View style={styles.plusV} />
  </View>
);

const PlayIcon = () => (
  <View style={styles.playTriangle} />
);

const ReceiptIcon = () => (
  <View style={styles.receiptWrap}>
    <View style={styles.receiptLine} />
    <View style={[styles.receiptLine, { width: 10 }]} />
    <View style={styles.receiptLine} />
    <View style={styles.receiptNotch} />
  </View>
);

const GridIcon = () => (
  <View style={styles.gridWrap}>
    <View style={styles.gridRow}>
      <View style={styles.gridDot} />
      <View style={styles.gridDot} />
    </View>
    <View style={styles.gridRow}>
      <View style={styles.gridDot} />
      <View style={styles.gridDot} />
    </View>
  </View>
);

const TrendingUpIcon = () => (
  <View style={styles.trendWrap}>
    <View style={styles.trendLine1} />
    <View style={styles.trendLine2} />
    <View style={styles.trendArrow} />
  </View>
);

const BarChartIcon = ({ color }) => (
  <View style={styles.barWrap}>
    <View style={[styles.bar, { height: 8, backgroundColor: color }]} />
    <View style={[styles.bar, { height: 13, backgroundColor: color }]} />
    <View style={[styles.bar, { height: 10, backgroundColor: color }]} />
  </View>
);

const MoneyIcon = ({ color }) => (
  <View style={[styles.moneyCircle, { borderColor: color }]}>
    <Text style={[styles.moneyText, { color }]}>$</Text>
  </View>
);

const GlobeIcon = ({ color }) => (
  <View style={[styles.globeOuter, { borderColor: color }]}>
    <View style={[styles.globeH, { borderColor: color }]} />
    <View style={[styles.globeV, { borderColor: color }]} />
  </View>
);

// ─── Tab bar icons ────────────────────────────────────────────────────────────

const HomeTabIcon = ({ active }) => (
  <View style={styles.homeWrap}>
    <View style={[styles.homeRoof, { borderBottomColor: active ? '#1565C0' : '#9E9E9E' }]} />
    <View style={[styles.homeDoor, { borderColor: active ? '#1565C0' : '#9E9E9E' }]} />
  </View>
);

const WalletTabIcon = ({ active }) => (
  <View style={[styles.tabWalletCard, { borderColor: active ? '#1565C0' : '#9E9E9E' }]}>
    <View style={[styles.tabWalletStripe, { backgroundColor: active ? '#1565C0' : '#9E9E9E' }]} />
  </View>
);

const UsageTabIcon = ({ active }) => (
  <View style={styles.barWrap}>
    <View style={[styles.bar, { height: 8, backgroundColor: active ? '#1565C0' : '#9E9E9E' }]} />
    <View style={[styles.bar, { height: 14, backgroundColor: active ? '#1565C0' : '#9E9E9E' }]} />
    <View style={[styles.bar, { height: 10, backgroundColor: active ? '#1565C0' : '#9E9E9E' }]} />
  </View>
);

const ProfileTabIcon = ({ active }) => (
  <View style={styles.profileWrap}>
    <View style={[styles.profileHead, { borderColor: active ? '#1565C0' : '#9E9E9E', backgroundColor: 'transparent' }]} />
    <View style={[styles.profileShoulder, { borderColor: active ? '#1565C0' : '#9E9E9E' }]} />
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const QUICK_AMOUNTS = ['$10.00', '$25.00', '$50.00'];

const TRANSACTIONS = [
  {
    id: '1',
    icon: 'bar',
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    title: '5GB Monthly Pack',
    date: '24 Oct, 2023 • 2:45 PM',
    amount: '-$15.00',
    amountColor: '#212121',
  },
  {
    id: '2',
    icon: 'money',
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    title: 'Wallet Top-up',
    date: '22 Oct, 2023 • 10:15 AM',
    amount: '+$50.00',
    amountColor: '#2E7D32',
  },
  {
    id: '3',
    icon: 'globe',
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    title: 'Global Roaming 1GB',
    date: '20 Oct, 2023 • 9:30 PM',
    amount: '-$25.00',
    amountColor: '#212121',
  },
];

const gilroy = (weight = '400') => ({
  fontFamily: weight === 'bold' || weight === '700' ? 'Gilroy-Bold' : weight === '600' ? 'Gilroy-SemiBold' : weight === '500' ? 'Gilroy-Medium' : 'Gilroy-Regular',
});

export default function WalletScreen() {
  const [activeAmount, setActiveAmount] = useState('$10.00');
  const [activeTab, setActiveTab] = useState('Wallet');

  const tabs = [
    { key: 'Home', label: 'HOME' },
    { key: 'Wallet', label: 'WALLET' },
    { key: 'Usage', label: 'USAGE' },
    { key: 'Profile', label: 'PROFILE' },
  ];

  const renderTransactionIcon = (tx) => {
    if (tx.icon === 'bar') return <BarChartIcon color={tx.iconColor} />;
    if (tx.icon === 'money') return <MoneyIcon color={tx.iconColor} />;
    if (tx.icon === 'globe') return <GlobeIcon color={tx.iconColor} />;
    return null;
  };

  const renderTabIcon = (key, active) => {
    if (key === 'Home') return <HomeTabIcon active={active} />;
    if (key === 'Wallet') return <WalletTabIcon active={active} />;
    if (key === 'Usage') return <UsageTabIcon active={active} />;
    if (key === 'Profile') return <ProfileTabIcon active={active} />;
    return null;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        {/* Wallet icon square */}
        <View style={styles.headerIconBox}>
          <WalletIcon />
        </View>

        <Text style={[styles.headerTitle, gilroy('bold')]}>My Wallet</Text>

        <TouchableOpacity style={styles.bellButton} accessibilityLabel="Notifications">
          <BellIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Balance Card ───────────────────────────────────────────────────── */}
        <View style={styles.balanceSection}>
          <Text style={[styles.balanceLabel, gilroy('500')]}>TOTAL BALANCE</Text>
          <Text style={[styles.balanceAmount, gilroy('bold')]}>$2,450.00</Text>

          {/* Green pill badge */}
          <View style={styles.badgePill}>
            <TrendingUpIcon />
            <Text style={[styles.badgeText, gilroy('600')]}>+$120.50 this week</Text>
          </View>
        </View>

        {/* ── Action Buttons ─────────────────────────────────────────────────── */}
        <View style={styles.actionsRow}>
          {/* Top Up – filled blue */}
          <TouchableOpacity style={styles.actionItem} accessibilityLabel="Top Up">
            <View style={styles.actionBtnBlue}>
              <PlusIcon />
            </View>
            <Text style={[styles.actionLabel, gilroy('500')]}>Top Up</Text>
          </TouchableOpacity>

          {/* Transfer */}
          <TouchableOpacity style={styles.actionItem} accessibilityLabel="Transfer">
            <View style={styles.actionBtnLight}>
              <PlayIcon />
            </View>
            <Text style={[styles.actionLabel, gilroy('500')]}>Transfer</Text>
          </TouchableOpacity>

          {/* Bills */}
          <TouchableOpacity style={styles.actionItem} accessibilityLabel="Bills">
            <View style={styles.actionBtnLight}>
              <ReceiptIcon />
            </View>
            <Text style={[styles.actionLabel, gilroy('500')]}>Bills</Text>
          </TouchableOpacity>

          {/* More */}
          <TouchableOpacity style={styles.actionItem} accessibilityLabel="More">
            <View style={styles.actionBtnLight}>
              <GridIcon />
            </View>
            <Text style={[styles.actionLabel, gilroy('500')]}>More</Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Top-Up ───────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, gilroy('600')]}>QUICK TOP-UP</Text>

          <View style={styles.amountRow}>
            {QUICK_AMOUNTS.map((amt) => {
              const isActive = activeAmount === amt;
              return (
                <TouchableOpacity
                  key={amt}
                  style={[styles.amountPill, isActive && styles.amountPillActive]}
                  onPress={() => setActiveAmount(amt)}
                  accessibilityLabel={`Quick top-up ${amt}`}
                >
                  <Text
                    style={[
                      styles.amountPillText,
                      gilroy('600'),
                      isActive && styles.amountPillTextActive,
                    ]}
                  >
                    {amt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Recent Purchases ───────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.recentTitle, gilroy('bold')]}>Recent Purchases</Text>
            <TouchableOpacity accessibilityLabel="See all recent purchases">
              <Text style={[styles.seeAll, gilroy('600')]}>See All</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.txCard}>
              <View style={[styles.txIconCircle, { backgroundColor: tx.iconBg }]}>
                {renderTransactionIcon(tx)}
              </View>

              <View style={styles.txInfo}>
                <Text style={[styles.txTitle, gilroy('600')]}>{tx.title}</Text>
                <Text style={[styles.txDate, gilroy('400')]}>{tx.date}</Text>
              </View>

              <Text style={[styles.txAmount, gilroy('700'), { color: tx.amountColor }]}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* bottom spacing so content doesn't hide behind tab bar */}
        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Tab Bar ─────────────────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
              accessibilityLabel={tab.label}
            >
              {renderTabIcon(tab.key, isActive)}
              <Text
                style={[
                  styles.tabLabel,
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

// ─── StyleSheet ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  headerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: '#212121',
    marginLeft: 10,
  },
  bellButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 8 },

  // ── Balance
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#757575',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 40,
    color: '#212121',
    marginBottom: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 13,
    color: '#2E7D32',
    marginLeft: 4,
  },

  // ── Actions
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionBtnBlue: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  actionBtnLight: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  actionLabel: {
    fontSize: 12,
    color: '#424242',
  },

  // ── Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: '#757575',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 17,
    color: '#212121',
  },
  seeAll: {
    fontSize: 13,
    color: '#1565C0',
  },

  // ── Quick Top-Up pills
  amountRow: {
    flexDirection: 'row',
    gap: 10,
  },
  amountPill: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  amountPillActive: {
    borderColor: '#1565C0',
  },
  amountPillText: {
    fontSize: 14,
    color: '#757575',
  },
  amountPillTextActive: {
    color: '#1565C0',
  },

  // ── Transaction rows
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  txIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 3,
  },
  txDate: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  txAmount: {
    fontSize: 14,
  },

  // ── Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingVertical: 10,
    paddingBottom: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 9,
    letterSpacing: 0.6,
    marginTop: 3,
  },

  // ── Wallet icon (header)
  walletIconInner: { width: 22, height: 16, position: 'relative' },
  wiCard: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1565C0',
  },
  wiStripe: {
    position: 'absolute',
    top: 5, left: 0, right: 0,
    height: 3,
    backgroundColor: '#1565C0',
    opacity: 0.4,
  },
  wiChip: {
    position: 'absolute',
    top: 9, left: 4,
    width: 6, height: 4,
    borderRadius: 1,
    backgroundColor: '#1565C0',
    opacity: 0.7,
  },

  // ── Bell icon
  bellWrap: { width: 20, height: 22, alignItems: 'center' },
  bellBody: {
    width: 16,
    height: 14,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: '#424242',
    marginTop: 3,
  },
  bellBottom: {
    width: 10,
    height: 4,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 1.8,
    borderTopWidth: 0,
    borderColor: '#424242',
    marginTop: -2,
  },
  bellDot: {
    position: 'absolute',
    top: 0, right: 2,
    width: 5, height: 5,
    borderRadius: 3,
    backgroundColor: '#F44336',
  },

  // ── Plus icon
  plusWrap: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  plusH: { position: 'absolute', width: 18, height: 2.5, borderRadius: 2, backgroundColor: '#FFFFFF' },
  plusV: { position: 'absolute', width: 2.5, height: 18, borderRadius: 2, backgroundColor: '#FFFFFF' },

  // ── Play icon
  playTriangle: {
    width: 0, height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#1565C0',
  },

  // ── Receipt icon
  receiptWrap: { alignItems: 'flex-start', gap: 3 },
  receiptLine: { width: 14, height: 2, borderRadius: 1, backgroundColor: '#1565C0' },
  receiptNotch: {
    width: 14, height: 6,
    borderBottomLeftRadius: 3, borderBottomRightRadius: 3,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#1565C0',
    marginTop: -2,
  },

  // ── Grid icon
  gridWrap: { gap: 3 },
  gridRow: { flexDirection: 'row', gap: 3 },
  gridDot: { width: 7, height: 7, borderRadius: 1.5, backgroundColor: '#1565C0' },

  // ── Trending up icon
  trendWrap: { width: 16, height: 12, justifyContent: 'flex-end' },
  trendLine1: {
    position: 'absolute',
    bottom: 0, left: 0,
    width: 8, height: 1.5,
    borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '-35deg' }],
    transformOrigin: 'left bottom',
  },
  trendLine2: {
    position: 'absolute',
    bottom: 4, left: 6,
    width: 8, height: 1.5,
    borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '-35deg' }],
    transformOrigin: 'left bottom',
  },
  trendArrow: {
    position: 'absolute',
    top: 0, right: 0,
    width: 0, height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#2E7D32',
    transform: [{ rotate: '45deg' }],
  },

  // ── Bar chart
  barWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1.5 },

  // ── Money circle
  moneyCircle: {
    width: 22, height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moneyText: { fontSize: 11, fontWeight: '700' },

  // ── Globe
  globeOuter: {
    width: 22, height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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

  // ── Home tab icon
  homeWrap: { width: 20, height: 18, alignItems: 'center' },
  homeRoof: {
    width: 0, height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeDoor: {
    width: 8, height: 8,
    borderWidth: 1.5,
    borderRadius: 1,
  },

  // ── Wallet tab icon
  tabWalletCard: {
    width: 22, height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  tabWalletStripe: {
    height: 4,
    marginTop: 4,
  },

  // ── Profile tab icon
  profileWrap: { width: 20, height: 20, alignItems: 'center' },
  profileHead: {
    width: 10, height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    marginBottom: 2,
  },
  profileShoulder: {
    width: 18, height: 8,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
});
