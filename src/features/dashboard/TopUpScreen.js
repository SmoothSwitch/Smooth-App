import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

// ─── Icon primitives ─────────────────────────────────────────────────────────

/** ← back arrow */
const BackArrow = () => (
  <View style={icons.arrowWrap}>
    <View style={icons.arrowStem} />
    <View style={icons.arrowHead} />
  </View>
);

/** Wallet card icon (blue outline) */
const WalletCardIcon = ({ size = 20, color = '#1565C0' }) => (
  <View style={[icons.wCard, { width: size + 4, height: size, borderColor: color }]}>
    <View style={[icons.wStripe, { backgroundColor: color }]} />
    <View style={[icons.wChip, { backgroundColor: color }]} />
  </View>
);

/** Credit card icon (solid blue, for payment row) */
const CreditCardIcon = () => (
  <View style={icons.ccOuter}>
    <View style={icons.ccStripe} />
  </View>
);

/** Green shield with checkmark */
const ShieldCheckIcon = () => (
  <View style={icons.shieldOuter}>
    <View style={icons.shieldCheck} />
    <View style={icons.shieldCheckV} />
  </View>
);

/** → right arrow (white, for button) */
const ArrowRight = () => (
  <View style={icons.rightArrowWrap}>
    <View style={icons.rightStem} />
    <View style={icons.rightHead} />
  </View>
);

// ─── Tab bar icons ────────────────────────────────────────────────────────────
const HomeTabIcon = ({ active }) => (
  <View style={icons.homeWrap}>
    <View style={[icons.homeRoof, { borderBottomColor: active ? '#1565C0' : '#9E9E9E' }]} />
    <View style={[icons.homeDoor, { borderColor: active ? '#1565C0' : '#9E9E9E' }]} />
  </View>
);

const WalletTabIcon = ({ active }) => (
  <View style={[icons.tabWCard, { borderColor: active ? '#1565C0' : '#9E9E9E' }]}>
    <View style={[icons.tabWStripe, { backgroundColor: active ? '#1565C0' : '#9E9E9E' }]} />
  </View>
);

const HistoryTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={[icons.histCircle, { borderColor: c }]}>
      <View style={[icons.histHand, { backgroundColor: c }]} />
      <View style={[icons.histHandV, { backgroundColor: c }]} />
    </View>
  );
};

const ProfileTabIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={icons.profileWrap}>
      <View style={[icons.profileHead, { borderColor: c }]} />
      <View style={[icons.profileShoulder, { borderColor: c }]} />
    </View>
  );
};

// ─── Amount card data ─────────────────────────────────────────────────────────
const AMOUNTS = [
  { value: '$10', subtitle: 'Starter' },
  { value: '$25', subtitle: 'Popular' },
  { value: '$50', subtitle: 'Best Value' },
];

const TABS = [
  { key: 'Home',    label: 'Home' },
  { key: 'Wallet',  label: 'Wallet' },
  { key: 'History', label: 'History' },
  { key: 'Profile', label: 'Profile' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function TopUpScreen({ navigation }) {
  const [selectedAmount, setSelectedAmount] = useState('$10');
  const [customAmount, setCustomAmount]     = useState('');
  const [activeTab, setActiveTab]           = useState('Wallet');

  const renderTabIcon = (key, active) => {
    if (key === 'Home')    return <HomeTabIcon    active={active} />;
    if (key === 'Wallet')  return <WalletTabIcon  active={active} />;
    if (key === 'History') return <HistoryTabIcon active={active} />;
    if (key === 'Profile') return <ProfileTabIcon active={active} />;
    return null;
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F4F8" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack?.()}
          accessibilityLabel="Go back"
        >
          <BackArrow />
        </TouchableOpacity>
        <Text style={[s.headerTitle, gilroy('bold')]}>Top Up Wallet</Text>
      </View>

      {/* ── Scrollable body ──────────────────────────────────────────────────── */}
      <View style={s.body}>

        {/* Balance card */}
        <View style={s.balanceCard}>
          <View style={s.balanceCardTop}>
            <WalletCardIcon size={18} color="#1565C0" />
            <Text style={[s.balanceLabel, gilroy('500')]}>Current Balance</Text>
          </View>
          <Text style={[s.balanceAmount, gilroy('bold')]}>$45.00</Text>
        </View>

        {/* Quick Select */}
        <Text style={[s.sectionLabel, gilroy('600')]}>QUICK SELECT</Text>

        <View style={s.amountRow}>
          {AMOUNTS.map((item) => {
            const isActive = selectedAmount === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[s.amountCard, isActive && s.amountCardActive]}
                onPress={() => setSelectedAmount(item.value)}
                accessibilityLabel={`Select ${item.value} ${item.subtitle}`}
              >
                <Text style={[s.amountValue, gilroy('bold'), isActive && s.amountValueActive]}>
                  {item.value}
                </Text>
                <Text style={[s.amountSub, gilroy('500'), isActive && s.amountSubActive]}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Amount */}
        <Text style={[s.sectionLabel, gilroy('600')]}>CUSTOM AMOUNT</Text>

        <View style={s.inputCard}>
          <Text style={[s.inputPrefix, gilroy('500')]}>$</Text>
          <TextInput
            style={[s.input, gilroy('500')]}
            placeholder="0.00"
            placeholderTextColor="#BDBDBD"
            keyboardType="decimal-pad"
            value={customAmount}
            onChangeText={setCustomAmount}
            accessibilityLabel="Enter custom top-up amount"
          />
        </View>

        {/* Security note */}
        <View style={s.secureRow}>
          <ShieldCheckIcon />
          <Text style={[s.secureText, gilroy('500')]}>Safe &amp; encrypted transaction</Text>
        </View>

        {/* Payment method */}
        <View style={s.paymentRow}>
          <CreditCardIcon />
          <View style={s.paymentInfo}>
            <Text style={[s.paymentTitle, gilroy('600')]}>Visa Ending in 4242</Text>
            <Text style={[s.paymentExpiry, gilroy('400')]}>Expires 12/26</Text>
          </View>
          <TouchableOpacity accessibilityLabel="Change payment method">
            <Text style={[s.changeLink, gilroy('600')]}>Change</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Proceed button ───────────────────────────────────────────────────── */}
      <View style={s.proceedWrap}>
        <TouchableOpacity
          style={s.proceedBtn}
          activeOpacity={0.85}
          accessibilityLabel="Proceed to Pay"
        >
          <Text style={[s.proceedText, gilroy('bold')]}>Proceed to Pay</Text>
          <ArrowRight />
        </TouchableOpacity>
      </View>

      {/* ── Bottom Tab Bar ───────────────────────────────────────────────────── */}
      <View style={s.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={s.tabItem}
              onPress={() => setActiveTab(tab.key)}
              accessibilityLabel={tab.label}
            >
              {renderTabIcon(tab.key, isActive)}
              <Text style={[s.tabLabel, gilroy('500'), { color: isActive ? '#1565C0' : '#9E9E9E' }]}>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F4F8',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#F2F4F8',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 19,
    color: '#1A1A2E',
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 6,
  },

  // Balance card
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 22,
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },
  balanceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 36,
    color: '#1A1A2E',
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    letterSpacing: 1.3,
    color: '#757575',
    marginBottom: 12,
  },

  // Amount cards
  amountRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  amountCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  amountCardActive: {
    borderColor: '#1565C0',
    backgroundColor: '#FFFFFF',
  },
  amountValue: {
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 4,
  },
  amountValueActive: {
    color: '#1565C0',
  },
  amountSub: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  amountSubActive: {
    color: '#1565C0',
  },

  // Custom amount input
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  inputPrefix: {
    fontSize: 22,
    color: '#9E9E9E',
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontSize: 22,
    color: '#1A1A2E',
    padding: 0,
  },

  // Secure row
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 7,
  },
  secureText: {
    fontSize: 13,
    color: '#2E7D32',
  },

  // Payment row
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Platform.select({
      android: { elevation: 1 },
    }),
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 14,
    color: '#1A1A2E',
    marginBottom: 2,
  },
  paymentExpiry: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  changeLink: {
    fontSize: 14,
    color: '#1565C0',
  },

  // Proceed button
  proceedWrap: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#F2F4F8',
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    ...Platform.select({
      android: { elevation: 4 },
    }),
  },
  proceedText: {
    fontSize: 17,
    color: '#FFFFFF',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
    paddingBottom: 14,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const icons = StyleSheet.create({
  // Back arrow
  arrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  arrowStem: {
    position: 'absolute',
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#1A1A2E',
    left: 0,
    top: 6,
  },
  arrowHead: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#1A1A2E',
    left: 0,
    top: 2,
  },

  // Wallet card icon
  wCard: {
    borderRadius: 3,
    borderWidth: 1.5,
    height: 18,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  wStripe: { height: 4, marginTop: 4, opacity: 0.4 },
  wChip: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    width: 6,
    height: 4,
    borderRadius: 1,
    opacity: 0.7,
  },

  // Credit card (solid)
  ccOuter: {
    width: 34,
    height: 24,
    borderRadius: 5,
    backgroundColor: '#1565C0',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  ccStripe: {
    marginTop: 8,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  // Shield check
  shieldOuter: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldCheck: {
    position: 'absolute',
    bottom: 4,
    left: 2,
    width: 5,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '45deg' }],
  },
  shieldCheckV: {
    position: 'absolute',
    bottom: 3,
    left: 5,
    width: 2,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '45deg' }],
  },

  // Right arrow (white)
  rightArrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  rightStem: {
    position: 'absolute',
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
    right: 0,
    top: 6,
  },
  rightHead: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#FFFFFF',
    right: 0,
    top: 2,
  },

  // Home tab
  homeWrap: { width: 22, height: 20, alignItems: 'center' },
  homeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeDoor: {
    width: 8,
    height: 8,
    borderWidth: 1.5,
    borderRadius: 1,
  },

  // Wallet tab
  tabWCard: {
    width: 24,
    height: 17,
    borderWidth: 1.5,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  tabWStripe: { height: 4, marginTop: 4 },

  // History (clock) tab
  histCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  histHand: {
    position: 'absolute',
    width: 1.5,
    height: 6,
    borderRadius: 1,
    top: 2,
    left: 8.5,
  },
  histHandV: {
    position: 'absolute',
    width: 4,
    height: 1.5,
    borderRadius: 1,
    top: 7.5,
    left: 8.5,
  },

  // Profile tab
  profileWrap: { width: 20, height: 20, alignItems: 'center' },
  profileHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    marginBottom: 2,
  },
  profileShoulder: {
    width: 18,
    height: 8,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
  },
});
