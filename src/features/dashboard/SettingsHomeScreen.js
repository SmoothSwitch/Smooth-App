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

/** ↻ Sync / refresh icon (two curved arrows forming a circle) */
const SyncIcon = () => (
  <View style={ic.syncWrap}>
    {/* Outer ring arc — top-right quarter */}
    <View style={ic.syncArc1} />
    {/* Outer ring arc — bottom-left quarter */}
    <View style={ic.syncArc2} />
    {/* Arrow tips */}
    <View style={ic.syncTip1} />
    <View style={ic.syncTip2} />
  </View>
);

/** 👤 Person outline */
const PersonIcon = ({ color = '#1565C0' }) => (
  <View style={ic.personWrap}>
    <View style={[ic.personHead, { borderColor: color }]} />
    <View style={[ic.personBody, { borderColor: color }]} />
  </View>
);

/** 🛡 Shield icon */
const ShieldIcon = ({ color = '#1565C0' }) => (
  <View style={ic.shieldWrap}>
    <View style={[ic.shieldOuter, { borderColor: color }]} />
    <View style={[ic.shieldLock, { backgroundColor: color }]} />
  </View>
);

/** 🔔 Bell icon */
const BellIcon = ({ color = '#2E7D32' }) => (
  <View style={ic.bellWrap}>
    <View style={[ic.bellDome, { borderColor: color }]} />
    <View style={[ic.bellBase, { backgroundColor: color }]} />
    <View style={[ic.bellClapper, { backgroundColor: color }]} />
  </View>
);

/** 🎨 Palette icon */
const PaletteIcon = ({ color = '#1565C0' }) => (
  <View style={ic.palWrap}>
    <View style={[ic.palCircle, { borderColor: color }]} />
    {[
      { top: 2,  left: 5,  bg: '#E53935' },
      { top: 2,  right: 5, bg: '#1565C0' },
      { bottom: 4, left: 3, bg: '#2E7D32' },
    ].map((dot, i) => (
      <View key={i} style={[ic.palDot, dot, { backgroundColor: dot.bg }]} />
    ))}
    <View style={[ic.palThumb, { borderColor: color }]} />
  </View>
);

/** ? Question mark icon */
const QuestionIcon = ({ color = '#1565C0' }) => (
  <View style={[ic.qWrap, { borderColor: color }]}>
    <View style={[ic.qArc, { borderColor: color }]} />
    <View style={[ic.qDot, { backgroundColor: color }]} />
  </View>
);

/** › Chevron right */
const ChevronRight = () => (
  <View style={ic.chevWrap}>
    <View style={ic.chevTop} />
    <View style={ic.chevBot} />
  </View>
);

/** → Logout arrow */
const LogoutArrow = () => (
  <View style={ic.logoutWrap}>
    <View style={ic.logoutStem} />
    <View style={ic.logoutTip1} />
    <View style={ic.logoutTip2} />
    <View style={ic.logoutBracket} />
  </View>
);

// ─── Bottom-tab icon set ──────────────────────────────────────────────────────

const HomeIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.homeWrap}>
      <View style={[ic.homeRoof,   { borderBottomColor: c }]} />
      <View style={[ic.homeDoor,   { borderColor: c }]} />
    </View>
  );
};

const ActivityIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.actWrap}>
      <View style={[ic.actArrow1, { borderColor: c }]} />
      <View style={[ic.actArrow2, { borderColor: c }]} />
    </View>
  );
};

const SwitchIcon = ({ active }) => {
  const c = active ? '#1565C0' : '#9E9E9E';
  return (
    <View style={ic.swWrap}>
      <View style={[ic.swBolt1, { borderColor: c }]} />
      <View style={[ic.swBolt2, { backgroundColor: c }]} />
    </View>
  );
};

const SettingsIcon = ({ active }) => {
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

// ─── Menu row data ────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    label: 'PERSONAL',
    items: [
      {
        key: 'account',
        title: 'Account',
        subtitle: 'Email, Phone, Password',
        iconBg: '#E3F2FD',
        icon: (c) => <PersonIcon color={c} />,
        iconColor: '#1565C0',
        badge: null,
      },
      {
        key: 'privacy',
        title: 'Privacy & Data',
        subtitle: 'Manage what you share',
        iconBg: '#E3F2FD',
        icon: (c) => <ShieldIcon color={c} />,
        iconColor: '#1565C0',
        badge: null,
      },
    ],
  },
  {
    label: 'PREFERENCES',
    items: [
      {
        key: 'notifications',
        title: 'Notifications',
        subtitle: 'Push, Email, and SMS',
        iconBg: '#E8F5E9',
        icon: (c) => <BellIcon color={c} />,
        iconColor: '#2E7D32',
        badge: { text: 'ON', color: '#2E7D32', bg: '#E8F5E9' },
      },
      {
        key: 'appearance',
        title: 'Appearance',
        subtitle: 'Theme, Fonts, Layout',
        iconBg: '#E3F2FD',
        icon: (c) => <PaletteIcon color={c} />,
        iconColor: '#1565C0',
        badge: null,
      },
    ],
  },
  {
    label: 'SUPPORT',
    items: [
      {
        key: 'help',
        title: 'Help & Support',
        subtitle: 'FAQs and Contact us',
        iconBg: '#E3F2FD',
        icon: (c) => <QuestionIcon color={c} />,
        iconColor: '#1565C0',
        badge: null,
      },
    ],
  },
];

const BOTTOM_TABS = [
  { key: 'Home',     label: 'HOME' },
  { key: 'Activity', label: 'ACTIVITY' },
  { key: 'Switch',   label: 'SWITCH' },
  { key: 'Settings', label: 'SETTINGS' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function SettingsHomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Settings');

  const renderTabIcon = (key, active) => {
    if (key === 'Home')     return <HomeIcon     active={active} />;
    if (key === 'Activity') return <ActivityIcon active={active} />;
    if (key === 'Switch')   return <SwitchIcon   active={active} />;
    if (key === 'Settings') return <SettingsIcon active={active} />;
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

        <Text style={[s.headerTitle, gilroy('bold')]}>Settings</Text>

        <TouchableOpacity style={s.syncBtn} accessibilityLabel="Sync account">
          <SyncIcon />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card ─────────────────────────────────────────────────── */}
        <View style={s.profileCard}>
          {/* Avatar */}
          <View style={s.avatarWrap}>
            {/* Avatar circle with phone silhouette */}
            <View style={s.avatar}>
              <View style={s.avatarPhone} />
            </View>
            {/* Online dot */}
            <View style={s.onlineDot} />
          </View>

          {/* Name + subtitle */}
          <View style={s.profileInfo}>
            <Text style={[s.profileName, gilroy('bold')]}>Alex Johnson</Text>
            <Text style={[s.profileSub,  gilroy('400')]}>Premium Member</Text>
          </View>

          {/* Edit button */}
          <TouchableOpacity style={s.editBtn} accessibilityLabel="Edit profile">
            <Text style={[s.editBtnText, gilroy('bold')]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Settings sections ─────────────────────────────────────────────── */}
        {SECTIONS.map((section) => (
          <View key={section.label}>
            {/* Section label */}
            <Text style={[s.sectionLabel, gilroy('600')]}>{section.label}</Text>

            {/* Menu rows */}
            <View style={s.menuGroup}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    s.menuRow,
                    idx < section.items.length - 1 && s.menuRowBorder,
                  ]}
                  activeOpacity={0.7}
                  accessibilityLabel={item.title}
                >
                  {/* Icon square */}
                  <View style={[s.iconBox, { backgroundColor: item.iconBg }]}>
                    {item.icon(item.iconColor)}
                  </View>

                  {/* Text */}
                  <View style={s.menuText}>
                    <View style={s.menuTitleRow}>
                      <Text style={[s.menuTitle, gilroy('600')]}>{item.title}</Text>
                      {item.badge && (
                        <View style={[s.badge, { backgroundColor: item.badge.bg }]}>
                          <Text style={[s.badgeText, { color: item.badge.color }, gilroy('bold')]}>
                            {item.badge.text}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[s.menuSub, gilroy('400')]}>{item.subtitle}</Text>
                  </View>

                  <ChevronRight />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* ── Log Out button ─────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={s.logoutBtn}
          activeOpacity={0.7}
          accessibilityLabel="Log out"
        >
          <LogoutArrow />
          <Text style={[s.logoutText, gilroy('bold')]}>Log Out</Text>
        </TouchableOpacity>

        {/* ── Version string ────────────────────────────────────────────────── */}
        <Text style={[s.versionText, gilroy('400')]}>SmoothSwitch v2.4.0 (S27)</Text>

        <View style={{ height: 12 }} />
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
  headerBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    color: '#1A1A2E',
    marginLeft: 6,
  },
  syncBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 8 },

  // ── Profile card ────────────────────────────────────────────────────────────
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
    gap: 14,
  },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatar: {
    width: 66, height: 66, borderRadius: 33,
    backgroundColor: '#FFCDD2',
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarPhone: {
    width: 22, height: 36,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#43A047',
    borderWidth: 2.5, borderColor: '#FFFFFF',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, color: '#1A1A2E', marginBottom: 3 },
  profileSub:  { fontSize: 13, color: '#9E9E9E' },
  editBtn: {
    backgroundColor: '#1565C0',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 9,
    flexShrink: 0,
  },
  editBtnText: { fontSize: 14, color: '#FFFFFF' },

  // ── Section label ────────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    letterSpacing: 1.4,
    marginTop: 20,
    marginBottom: 10,
  },

  // ── Menu group ───────────────────────────────────────────────────────────────
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  iconBox: {
    width: 46, height: 46, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  menuText: { flex: 1 },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  menuTitle: { fontSize: 15, color: '#1A1A2E' },
  menuSub:   { fontSize: 12, color: '#9E9E9E' },

  // ON badge
  badge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, letterSpacing: 0.5 },

  // ── Log Out ──────────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 28,
    marginBottom: 14,
    gap: 10,
  },
  logoutText: { fontSize: 16, color: '#E53935' },

  // Version
  versionText: {
    fontSize: 12,
    color: '#BDBDBD',
    textAlign: 'center',
    marginBottom: 6,
  },

  // ── Bottom tab bar ───────────────────────────────────────────────────────────
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

  // Sync icon
  syncWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  syncArc1: {
    position: 'absolute',
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 2.5, borderColor: '#1565C0',
    borderBottomColor: 'transparent', borderLeftColor: 'transparent',
    transform: [{ rotate: '30deg' }],
  },
  syncArc2: {
    position: 'absolute',
    width: 16, height: 16, borderRadius: 8,
    borderWidth: 2.5, borderColor: '#1565C0',
    borderTopColor: 'transparent', borderRightColor: 'transparent',
    transform: [{ rotate: '30deg' }],
  },
  syncTip1: {
    position: 'absolute', top: 1, right: 1,
    width: 0, height: 0,
    borderLeftWidth: 4, borderRightWidth: 4, borderBottomWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: '#1565C0',
    transform: [{ rotate: '60deg' }],
  },
  syncTip2: {
    position: 'absolute', bottom: 1, left: 1,
    width: 0, height: 0,
    borderLeftWidth: 4, borderRightWidth: 4, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#1565C0',
    transform: [{ rotate: '60deg' }],
  },

  // Person icon
  personWrap: { width: 22, height: 22, alignItems: 'center' },
  personHead: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.8, marginBottom: 2,
  },
  personBody: {
    width: 18, height: 9,
    borderTopLeftRadius: 9, borderTopRightRadius: 9,
    borderWidth: 1.8, borderBottomWidth: 0,
  },

  // Shield icon
  shieldWrap: { width: 22, height: 24, alignItems: 'center', justifyContent: 'center' },
  shieldOuter: {
    position: 'absolute',
    width: 18, height: 22,
    borderTopLeftRadius: 9, borderTopRightRadius: 9,
    borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
    borderWidth: 1.8,
    top: 0,
  },
  shieldLock: {
    width: 7, height: 8, borderRadius: 1,
    marginTop: 3,
    opacity: 0.75,
  },

  // Bell icon
  bellWrap: { width: 22, height: 24, alignItems: 'center', justifyContent: 'center' },
  bellDome: {
    width: 16, height: 13,
    borderTopLeftRadius: 8, borderTopRightRadius: 8,
    borderWidth: 1.8, borderBottomWidth: 0,
    marginBottom: 1,
  },
  bellBase: { width: 18, height: 3, borderRadius: 1 },
  bellClapper: { width: 6, height: 4, borderRadius: 3, marginTop: 1 },

  // Palette icon
  palWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  palCircle: {
    position: 'absolute',
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1.8,
  },
  palDot: {
    position: 'absolute',
    width: 5, height: 5, borderRadius: 2.5,
  },
  palThumb: {
    position: 'absolute', bottom: 0, right: 0,
    width: 8, height: 8, borderRadius: 4,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },

  // Question mark icon
  qWrap: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 1.8,
    alignItems: 'center', justifyContent: 'center',
  },
  qArc: {
    width: 8, height: 5,
    borderTopLeftRadius: 4, borderTopRightRadius: 4,
    borderWidth: 1.8, borderBottomWidth: 0,
    marginBottom: 2,
  },
  qDot: { width: 3, height: 3, borderRadius: 1.5 },

  // Chevron right
  chevWrap:  { width: 10, height: 18, justifyContent: 'center' },
  chevTop: {
    position: 'absolute', top: 4,
    width: 8, height: 1.8, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '45deg' }],
  },
  chevBot: {
    position: 'absolute', bottom: 4,
    width: 8, height: 1.8, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },

  // Logout arrow (→ with bracket)
  logoutWrap: { width: 22, height: 18, justifyContent: 'center' },
  logoutStem: {
    position: 'absolute', left: 6, top: 8,
    width: 14, height: 2, borderRadius: 1,
    backgroundColor: '#E53935',
  },
  logoutTip1: {
    position: 'absolute', right: 0, top: 4,
    width: 8, height: 2, borderRadius: 1,
    backgroundColor: '#E53935',
    transform: [{ rotate: '45deg' }],
  },
  logoutTip2: {
    position: 'absolute', right: 0, bottom: 4,
    width: 8, height: 2, borderRadius: 1,
    backgroundColor: '#E53935',
    transform: [{ rotate: '-45deg' }],
  },
  logoutBracket: {
    position: 'absolute', left: 0,
    width: 2, height: 18, borderRadius: 1,
    backgroundColor: '#E53935',
  },

  // ── Bottom tab icon styles ─────────────────────────────────────────────────

  // Home
  homeWrap: { width: 22, height: 20, alignItems: 'center' },
  homeRoof: {
    width: 0, height: 0,
    borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 10,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginBottom: 1,
  },
  homeDoor: { width: 8, height: 8, borderWidth: 1.5, borderRadius: 1 },

  // Activity (two arrows ⇄)
  actWrap: { width: 24, height: 18, justifyContent: 'center' },
  actArrow1: {
    position: 'absolute', top: 1,
    width: 18, height: 6,
    borderTopWidth: 1.8, borderRightWidth: 1.8,
    borderTopRightRadius: 3,
    borderTopColor: 'transparent', borderRightColor: 'transparent',
  },
  actArrow2: {
    position: 'absolute', bottom: 1,
    width: 18, height: 6,
    borderBottomWidth: 1.8, borderLeftWidth: 1.8,
    borderBottomLeftRadius: 3,
    borderBottomColor: 'transparent', borderLeftColor: 'transparent',
  },

  // Switch (lightning bolt)
  swWrap: { width: 18, height: 22, alignItems: 'center', justifyContent: 'center' },
  swBolt1: {
    position: 'absolute',
    width: 10, height: 22,
    borderTopWidth: 0, borderBottomWidth: 0,
    borderLeftWidth: 2, borderRightWidth: 2,
    borderColor: 'transparent',
  },
  swBolt2: {
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 14,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
  },

  // Settings gear
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
