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

/** ← Back arrow */
const BackArrow = () => (
  <View style={ic.arrowWrap}>
    <View style={ic.arrowStem} />
    <View style={ic.arrowHead} />
  </View>
);

/** ⚙ Settings gear */
const GearIcon = ({ color = '#1A1A2E' }) => (
  <View style={ic.gearWrap}>
    <View style={[ic.gearCenter, { borderColor: color }]} />
    {[0, 45, 90, 135].map((deg, i) => (
      <View
        key={i}
        style={[ic.gearTooth, { backgroundColor: color, transform: [{ rotate: `${deg}deg` }] }]}
      />
    ))}
  </View>
);

/** ✏ Pencil / edit icon (small, white) */
const PencilIcon = ({ color = '#FFFFFF', size = 12 }) => (
  <View style={{ width: size + 4, height: size + 4, alignItems: 'center', justifyContent: 'center' }}>
    <View style={[ic.pencilBody, { borderColor: color, width: size * 0.5, height: size }]} />
    <View style={[ic.pencilTip, { borderTopColor: color }]} />
  </View>
);

/** 🛡 Shield icon (for account level card) */
const ShieldIconBlue = () => (
  <View style={ic.bigShieldWrap}>
    <View style={ic.bigShieldOuter} />
    <View style={ic.bigShieldInner} />
  </View>
);

/** 💳 Credit card icon */
const CardIcon = () => (
  <View style={ic.cardWrap}>
    <View style={ic.cardBody}>
      <View style={ic.cardStripe} />
      <View style={ic.cardChip} />
    </View>
  </View>
);

/** 🧾 Receipt / billing icon */
const ReceiptIcon = () => (
  <View style={ic.receiptWrap}>
    <View style={ic.receiptBody}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[ic.receiptLine, { width: i === 2 ? '60%' : '85%' }]} />
      ))}
      <View style={ic.receiptZigZag} />
    </View>
  </View>
);

/** ✦ Sparkle / upgrade icon */
const SparkleIcon = () => (
  <View style={ic.sparkWrap}>
    {/* Main star burst */}
    <View style={ic.sparkH} />
    <View style={ic.sparkV} />
    <View style={[ic.sparkDiag, { transform: [{ rotate: '45deg' }] }]} />
    <View style={[ic.sparkDiag, { transform: [{ rotate: '-45deg' }] }]} />
    {/* Small dots */}
    <View style={[ic.sparkDot, { top: 2, right: 2 }]} />
    <View style={[ic.sparkDot, { bottom: 2, left: 2 }]} />
  </View>
);

/** 🔒 Shield + lock (security) */
const SecurityIcon = () => (
  <View style={ic.secWrap}>
    <View style={ic.secShield} />
    <View style={ic.secLock} />
  </View>
);

/** › Chevron right */
const ChevronRight = () => (
  <View style={ic.chevWrap}>
    <View style={ic.chevTop} />
    <View style={ic.chevBot} />
  </View>
);

/** ✏ Edit icon (white, for button) */
const EditBtnIcon = () => (
  <View style={ic.editBtnWrap}>
    <View style={ic.editBtnBody} />
    <View style={ic.editBtnTip} />
    <View style={ic.editBtnBase} />
  </View>
);

// ─── Bottom-tab icon set ──────────────────────────────────────────────────────
const HomeIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.homeWrap}>
      <View style={[ic.homeRoof, { borderBottomColor: c }]} />
      <View style={[ic.homeDoor, { borderColor: c }]} />
    </View>
  );
};

const ActivityIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.actWrap}>
      {/* Two arrows ⇄ */}
      <View style={[ic.actTopRow]}>
        <View style={[ic.actLine, { backgroundColor: c }]} />
        <View style={[ic.actArrowRight, { borderLeftColor: c }]} />
      </View>
      <View style={[ic.actBotRow]}>
        <View style={[ic.actArrowLeft, { borderRightColor: c }]} />
        <View style={[ic.actLine, { backgroundColor: c }]} />
      </View>
    </View>
  );
};

const AnalysisIcon = ({ active }) => {
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

const ProfileIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.profWrap}>
      <View style={[ic.profHead, { borderColor: c }]} />
      <View style={[ic.profBody, { borderColor: c }]} />
    </View>
  );
};

// ─── Menu items data ──────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { key: 'payment',   title: 'Payment Methods',   icon: <CardIcon /> },
  { key: 'billing',   title: 'Billing History',    icon: <ReceiptIcon /> },
  { key: 'plan',      title: 'Change Plan',        icon: <SparkleIcon /> },
  { key: 'security',  title: 'Security & Password',icon: <SecurityIcon /> },
];

const BOTTOM_TABS = [
  { key: 'Home',     label: 'HOME' },
  { key: 'Activity', label: 'ACTIVITY' },
  { key: 'Analysis', label: 'ANALYSIS' },
  { key: 'Profile',  label: 'PROFILE' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AccountProfileScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Profile');

  const renderTabIcon = (key, active) => {
    if (key === 'Home')     return <HomeIcon     active={active} />;
    if (key === 'Activity') return <ActivityIcon active={active} />;
    if (key === 'Analysis') return <AnalysisIcon active={active} />;
    if (key === 'Profile')  return <ProfileIcon  active={active} />;
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

        <Text style={[s.headerTitle, gilroy('bold')]}>Account Profile</Text>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="Settings">
          <GearIcon />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar section ─────────────────────────────────────────────────── */}
        <View style={s.avatarSection}>
          {/* Avatar circle */}
          <View style={s.avatarOuter}>
            {/* Warm beige avatar placeholder with person silhouette */}
            <View style={s.avatar}>
              {/* Head */}
              <View style={s.avatarHead} />
              {/* Shoulders */}
              <View style={s.avatarShoulders} />
              {/* Collar (v-neck) */}
              <View style={s.avatarCollar} />
            </View>

            {/* Blue edit badge */}
            <TouchableOpacity
              style={s.editBadge}
              accessibilityLabel="Change avatar"
            >
              <EditBtnIcon />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={[s.profileName, gilroy('bold')]}>Alexander Pierce</Text>

          {/* Email */}
          <Text style={[s.profileEmail, gilroy('400')]}>alex.pierce@smoothswitch.io</Text>

          {/* Phone */}
          <Text style={[s.profilePhone, gilroy('400')]}>+1 (555) 482-9012</Text>

          {/* Edit Profile button */}
          <TouchableOpacity
            style={s.editProfileBtn}
            activeOpacity={0.85}
            accessibilityLabel="Edit profile"
          >
            <PencilIcon color="#FFFFFF" size={14} />
            <Text style={[s.editProfileBtnText, gilroy('bold')]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Account Level card ─────────────────────────────────────────────── */}
        <View style={s.accountCard}>
          <View style={s.accountCardLeft}>
            <View style={s.shieldIconBox}>
              <ShieldIconBlue />
            </View>
            <View style={s.accountCardText}>
              <Text style={[s.accountCardLabel, gilroy('600')]}>ACCOUNT LEVEL</Text>
              <Text style={[s.accountCardTitle, gilroy('bold')]}>Pro Member</Text>
              <View style={s.activePill}>
                <View style={s.activeDot} />
                <Text style={[s.activePillText, gilroy('bold')]}>ACTIVE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Subscription Management ──────────────────────────────────────────── */}
        <Text style={[s.subLabel, gilroy('bold')]}>SUBSCRIPTION MANAGEMENT</Text>

        <View style={s.menuGroup}>
          {MENU_ITEMS.map((item, idx) => (
            <View key={item.key}>
              <TouchableOpacity
                style={s.menuRow}
                activeOpacity={0.7}
                accessibilityLabel={item.title}
              >
                <View style={s.menuIconBox}>{item.icon}</View>
                <Text style={[s.menuTitle, gilroy('500')]}>{item.title}</Text>
                <ChevronRight />
              </TouchableOpacity>
              {idx < MENU_ITEMS.length - 1 && <View style={s.divider} />}
            </View>
          ))}
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },

  // ── Avatar section ────────────────────────────────────────────────────────
  avatarSection: { alignItems: 'center', marginBottom: 24 },

  avatarOuter: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100, height: 100,
    borderRadius: 50,
    backgroundColor: '#C8A882',         // warm beige skin tone
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...Platform.select({ android: { elevation: 3 } }),
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarHead: {
    position: 'absolute',
    top: 18,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#D4A574',
    borderWidth: 2, borderColor: '#BC8C5A',
  },
  avatarShoulders: {
    width: 80, height: 45,
    borderTopLeftRadius: 40, borderTopRightRadius: 40,
    backgroundColor: '#2C3E72',          // dark jacket colour
    marginBottom: 0,
  },
  avatarCollar: {
    position: 'absolute',
    bottom: 42,
    width: 0, height: 0,
    borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 18,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },

  editBadge: {
    position: 'absolute',
    bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1565C0',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#FFFFFF',
    ...Platform.select({ android: { elevation: 4 } }),
  },

  profileName:  { fontSize: 24, color: '#1A1A2E', marginBottom: 5 },
  profileEmail: { fontSize: 13, color: '#9E9E9E', marginBottom: 3 },
  profilePhone: { fontSize: 13, color: '#9E9E9E', marginBottom: 20 },

  // Edit Profile button
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
    gap: 10,
    ...Platform.select({ android: { elevation: 2 } }),
  },
  editProfileBtnText: { fontSize: 16, color: '#FFFFFF' },

  // ── Account Level card ────────────────────────────────────────────────────
  accountCard: {
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  accountCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  shieldIconBox: {
    width: 50, height: 50, borderRadius: 14,
    backgroundColor: '#EBF3FF',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  accountCardText: { gap: 4 },
  accountCardLabel: { fontSize: 10, color: '#9E9E9E', letterSpacing: 1 },
  accountCardTitle: { fontSize: 17, color: '#1A1A2E' },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  activeDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#43A047' },
  activePillText: { fontSize: 11, color: '#2E7D32', letterSpacing: 0.5 },

  // ── Subscription Management ───────────────────────────────────────────────
  subLabel: {
    fontSize: 13,
    color: '#1A1A2E',
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    ...Platform.select({ android: { elevation: 1 } }),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 14,
  },
  menuIconBox: {
    width: 40, height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  menuTitle: { flex: 1, fontSize: 15, color: '#1A1A2E' },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },

  // ── Bottom tab bar ────────────────────────────────────────────────────────
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'android' ? 10 : 14,
  },
  tabBarItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabBarLabel: { fontSize: 9, letterSpacing: 0.4, marginTop: 2 },
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

  // Gear
  gearWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  gearCenter: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 2,
  },
  gearTooth: {
    position: 'absolute',
    width: 3.5, height: 22, borderRadius: 2,
    opacity: 0.45,
  },

  // Pencil (edit badge)
  pencilBody: {
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'absolute',
    top: 1,
  },
  pencilTip: {
    position: 'absolute', bottom: 0,
    width: 0, height: 0,
    borderLeftWidth: 3, borderRightWidth: 3, borderTopWidth: 5,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },

  // Edit button icon (inside blue button)
  editBtnWrap: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  editBtnBody: {
    position: 'absolute',
    width: 6, height: 10,
    borderWidth: 1.5, borderRadius: 1,
    borderColor: '#FFFFFF',
    top: 0,
  },
  editBtnTip: {
    position: 'absolute', bottom: 1,
    width: 0, height: 0,
    borderLeftWidth: 3, borderRightWidth: 3, borderTopWidth: 4,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  editBtnBase: {
    position: 'absolute', bottom: 0,
    width: 10, height: 2, borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },

  // Big shield (account level)
  bigShieldWrap: { width: 28, height: 30, alignItems: 'center', justifyContent: 'center' },
  bigShieldOuter: {
    position: 'absolute',
    width: 26, height: 28,
    borderTopLeftRadius: 13, borderTopRightRadius: 13,
    borderBottomLeftRadius: 3, borderBottomRightRadius: 3,
    borderWidth: 2.5, borderColor: '#1565C0',
    top: 0,
  },
  bigShieldInner: {
    width: 8, height: 10, borderRadius: 1,
    backgroundColor: '#1565C0',
    marginTop: 3,
    opacity: 0.7,
  },

  // Credit card
  cardWrap: { width: 26, height: 20, alignItems: 'center', justifyContent: 'center' },
  cardBody: {
    width: 24, height: 18, borderRadius: 3,
    borderWidth: 1.8, borderColor: '#424242',
    overflow: 'hidden',
  },
  cardStripe: {
    position: 'absolute', top: 4, left: 0, right: 0,
    height: 5, backgroundColor: '#424242',
  },
  cardChip: {
    position: 'absolute', bottom: 4, left: 4,
    width: 7, height: 6, borderRadius: 1.5,
    borderWidth: 1, borderColor: '#424242',
  },

  // Receipt
  receiptWrap: { width: 22, height: 26, alignItems: 'center' },
  receiptBody: {
    width: 20, height: 24,
    borderWidth: 1.8, borderColor: '#424242',
    borderRadius: 3,
    paddingHorizontal: 3,
    paddingTop: 5,
    gap: 3,
    overflow: 'hidden',
  },
  receiptLine: {
    height: 2, borderRadius: 1,
    backgroundColor: '#424242',
    alignSelf: 'center',
  },
  receiptZigZag: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 4, backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5, borderTopColor: '#424242',
  },

  // Sparkle / upgrade
  sparkWrap: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  sparkH: {
    position: 'absolute',
    width: 18, height: 2, borderRadius: 1,
    backgroundColor: '#424242',
  },
  sparkV: {
    position: 'absolute',
    width: 2, height: 18, borderRadius: 1,
    backgroundColor: '#424242',
  },
  sparkDiag: {
    position: 'absolute',
    width: 13, height: 2, borderRadius: 1,
    backgroundColor: '#424242',
  },
  sparkDot: {
    position: 'absolute',
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: '#424242',
  },

  // Security / shield + lock
  secWrap: { width: 22, height: 24, alignItems: 'center', justifyContent: 'center' },
  secShield: {
    position: 'absolute',
    width: 20, height: 22,
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    borderBottomLeftRadius: 3, borderBottomRightRadius: 3,
    borderWidth: 1.8, borderColor: '#424242',
    top: 0,
  },
  secLock: {
    width: 6, height: 8, borderRadius: 1,
    backgroundColor: '#424242',
    marginTop: 2,
    opacity: 0.7,
  },

  // Chevron right
  chevWrap: { width: 10, height: 20, justifyContent: 'center' },
  chevTop: {
    position: 'absolute', top: 5,
    width: 8, height: 1.8, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '45deg' }],
  },
  chevBot: {
    position: 'absolute', bottom: 5,
    width: 8, height: 1.8, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },

  // Bottom tab — Home
  homeWrap: { width: 22, height: 20, alignItems: 'center' },
  homeRoof: {
    width: 0, height: 0,
    borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeDoor: { width: 8, height: 8, borderWidth: 1.5, borderRadius: 1 },

  // Bottom tab — Activity (⇄)
  actWrap: { width: 26, height: 18, justifyContent: 'center', gap: 4 },
  actTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  actBotRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  actLine: { flex: 1, height: 1.8, borderRadius: 1 },
  actArrowRight: {
    width: 0, height: 0,
    borderTopWidth: 4, borderBottomWidth: 4, borderLeftWidth: 5,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
  },
  actArrowLeft: {
    width: 0, height: 0,
    borderTopWidth: 4, borderBottomWidth: 4, borderRightWidth: 5,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
  },

  // Bottom tab — Analysis
  anWrap: { width: 22, height: 20, position: 'relative' },
  anFrame: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 1.5, borderRadius: 2,
  },
  anBar1: { position: 'absolute', bottom: 3, left: 3,  width: 3, height: 6,  borderRadius: 1 },
  anBar2: { position: 'absolute', bottom: 3, left: 8,  width: 3, height: 11, borderRadius: 1 },
  anBar3: { position: 'absolute', bottom: 3, left: 13, width: 3, height: 7,  borderRadius: 1 },

  // Bottom tab — Profile
  profWrap: { width: 22, height: 22, alignItems: 'center' },
  profHead: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.8, marginBottom: 2,
  },
  profBody: {
    width: 18, height: 9,
    borderTopLeftRadius: 9, borderTopRightRadius: 9,
    borderWidth: 1.8, borderBottomWidth: 0,
  },
});
