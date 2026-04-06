import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, StyleSheet, Switch, Platform,
} from 'react-native';

const gilroy = (w = '400') => ({
  fontFamily: w === 'bold' || w === '700' ? 'Gilroy-Bold'
    : w === '600' ? 'Gilroy-SemiBold'
    : w === '500' ? 'Gilroy-Medium'
    : 'Gilroy-Regular',
});

// ─── Icons ────────────────────────────────────────────────────────────────────
const BlueArrow = () => (
  <View style={{ width: 20, height: 14, justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: 16, height: 2, borderRadius: 1, backgroundColor: '#1565C0', left: 0, top: 6 }} />
    <View style={{ position: 'absolute', width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 8, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#1565C0', left: 0, top: 2 }} />
  </View>
);

const SearchIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#9E9E9E' }} />
    <View style={{ position: 'absolute', bottom: 1, right: 1, width: 6, height: 2, borderRadius: 1, backgroundColor: '#9E9E9E', transform: [{ rotate: '45deg' }] }} />
  </View>
);

const ChevronRight = () => (
  <View style={{ width: 10, height: 18, justifyContent: 'center' }}>
    <View style={{ position: 'absolute', top: 4, width: 7, height: 1.8, borderRadius: 1, backgroundColor: '#BDBDBD', transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', bottom: 4, width: 7, height: 1.8, borderRadius: 1, backgroundColor: '#BDBDBD', transform: [{ rotate: '-45deg' }] }} />
  </View>
);

// Blue square icon wrappers
const IconBox = ({ children }) => (
  <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: '#EBF3FF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {children}
  </View>
);

// User icon
const UserIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: 'center' }}>
    <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.8, borderColor: '#1565C0', marginBottom: 1 }} />
    <View style={{ width: 18, height: 9, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderWidth: 1.8, borderBottomWidth: 0, borderColor: '#1565C0' }} />
  </View>
);

// Lock icon
const LockIcon = () => (
  <View style={{ width: 18, height: 22, alignItems: 'center' }}>
    <View style={{ width: 12, height: 7, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderWidth: 1.8, borderBottomWidth: 0, borderColor: '#1565C0', marginBottom: 0 }} />
    <View style={{ width: 16, height: 13, borderRadius: 3, borderWidth: 1.8, borderColor: '#1565C0', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 4, height: 6, borderRadius: 1, backgroundColor: '#1565C0' }} />
    </View>
  </View>
);

// Wifi/switch icon
const WifiSwitchIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' }}>
    <View style={{ width: 16, height: 16, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 2, borderBottomWidth: 0, borderColor: '#1565C0', opacity: 0.35, position: 'absolute', bottom: 4 }} />
    <View style={{ width: 10, height: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderWidth: 2, borderBottomWidth: 0, borderColor: '#1565C0', opacity: 0.6, position: 'absolute', bottom: 4 }} />
    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#1565C0', position: 'absolute', bottom: 4 }} />
    {/* switch indicator */}
    <View style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#1565C0', opacity: 0.8 }} />
  </View>
);

// Signal bars icon
const SignalIcon = () => (
  <View style={{ width: 22, height: 20, flexDirection: 'row', alignItems: 'flex-end', gap: 2 }}>
    {[5, 9, 13, 18].map((h, i) => (
      <View key={i} style={{ width: 4, height: h, borderRadius: 1, backgroundColor: '#1565C0' }} />
    ))}
  </View>
);

// Bell icon
const BellIcon = () => (
  <View style={{ width: 22, height: 24, alignItems: 'center' }}>
    <View style={{ width: 4, height: 4, borderRadius: 2, borderWidth: 1.5, borderColor: '#1565C0' }} />
    <View style={{ width: 18, height: 12, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderWidth: 1.8, borderColor: '#1565C0', borderBottomWidth: 0 }} />
    <View style={{ width: 22, height: 4, borderLeftWidth: 1.8, borderRightWidth: 1.8, borderBottomWidth: 1.8, borderColor: '#1565C0', borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    <View style={{ width: 7, height: 7, borderRadius: 3.5, borderWidth: 1.8, borderColor: '#1565C0', marginTop: 1 }} />
  </View>
);

// Phone vibrate icon
const VibrateIcon = () => (
  <View style={{ width: 26, height: 22, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
    {/* left waves */}
    <View style={{ gap: 3 }}>
      <View style={{ width: 3, height: 7, borderLeftWidth: 2, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#1565C0', borderRadius: 1 }} />
    </View>
    {/* phone body */}
    <View style={{ width: 14, height: 20, borderRadius: 3, borderWidth: 1.8, borderColor: '#1565C0', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 6, height: 1.5, borderRadius: 1, backgroundColor: '#1565C0', marginBottom: 3 }} />
      <View style={{ width: 4, height: 4, borderRadius: 2, borderWidth: 1.5, borderColor: '#1565C0' }} />
    </View>
    {/* right waves */}
    <View style={{ gap: 3 }}>
      <View style={{ width: 3, height: 7, borderRightWidth: 2, borderTopWidth: 2, borderBottomWidth: 2, borderColor: '#1565C0', borderRadius: 1 }} />
    </View>
  </View>
);

// Map pin icon
const MapPinIcon = () => (
  <View style={{ width: 18, height: 24, alignItems: 'center' }}>
    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.8, borderColor: '#1565C0', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#1565C0' }} />
    </View>
    <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#1565C0' }} />
  </View>
);

// Bluetooth icon
const BluetoothIcon = () => (
  <View style={{ width: 16, height: 24, alignItems: 'center', justifyContent: 'center' }}>
    {/* vertical line */}
    <View style={{ width: 2, height: 20, borderRadius: 1, backgroundColor: '#1565C0', position: 'absolute' }} />
    {/* top right diagonal */}
    <View style={{ position: 'absolute', top: 2, right: 1, width: 7, height: 1.8, borderRadius: 1, backgroundColor: '#1565C0', transform: [{ rotate: '30deg' }] }} />
    {/* meeting at center-right (top half) */}
    <View style={{ position: 'absolute', top: 7, right: 1, width: 7, height: 1.8, borderRadius: 1, backgroundColor: '#1565C0', transform: [{ rotate: '-30deg' }] }} />
    {/* bottom right diagonal */}
    <View style={{ position: 'absolute', bottom: 7, right: 1, width: 7, height: 1.8, borderRadius: 1, backgroundColor: '#1565C0', transform: [{ rotate: '30deg' }] }} />
    {/* meeting at center-right (bottom half) */}
    <View style={{ position: 'absolute', bottom: 2, right: 1, width: 7, height: 1.8, borderRadius: 1, backgroundColor: '#1565C0', transform: [{ rotate: '-30deg' }] }} />
  </View>
);

// ─── Bottom tab icons ─────────────────────────────────────────────────────────
const HomeTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 20, alignItems: 'center' }}>
    <View style={{ width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
    <View style={{ width: 16, height: 10, borderWidth: 1.5, borderTopWidth: 0, borderColor: color, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ width: 6, height: 7, borderWidth: 1.5, borderBottomWidth: 0, borderColor: color }} />
    </View>
  </View>
);

const UsageTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 20, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
    {[8, 14, 10, 20].map((h, i) => (
      <View key={i} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: color }} />
    ))}
  </View>
);

const SettingsTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 9, height: 9, borderRadius: 4.5, borderWidth: 2, borderColor: color }} />
    {[0, 60, 120].map((deg, i) => (
      <View key={i} style={{ position: 'absolute', width: 3, height: 20, borderRadius: 2, backgroundColor: color, opacity: 0.4, transform: [{ rotate: `${deg}deg` }] }} />
    ))}
  </View>
);

const ProfileTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center' }}>
    <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.8, borderColor: color, marginBottom: 2 }} />
    <View style={{ width: 18, height: 9, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderWidth: 1.8, borderBottomWidth: 0, borderColor: color }} />
  </View>
);

// ─── Row components ───────────────────────────────────────────────────────────
const ChevronRow = ({ iconEl, title, subtitle }) => (
  <TouchableOpacity style={s.row} activeOpacity={0.7}>
    <IconBox>{iconEl}</IconBox>
    <View style={s.rowText}>
      <Text style={[s.rowTitle, gilroy('500')]}>{title}</Text>
      {subtitle ? <Text style={[s.rowSub, gilroy('400')]}>{subtitle}</Text> : null}
    </View>
    <ChevronRight />
  </TouchableOpacity>
);

const ToggleRow = ({ iconEl, title, subtitle, value, onChange }) => (
  <View style={s.row}>
    <IconBox>{iconEl}</IconBox>
    <View style={s.rowText}>
      <Text style={[s.rowTitle, gilroy('500')]}>{title}</Text>
      {subtitle ? <Text style={[s.rowSub, gilroy('400')]}>{subtitle}</Text> : null}
    </View>
    <Switch
      value={value} onValueChange={onChange}
      trackColor={{ false: '#D1D1D6', true: '#43A047' }}
      thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
      ios_backgroundColor="#D1D1D6"
    />
  </View>
);

const BadgeChevronRow = ({ iconEl, title, badge }) => (
  <TouchableOpacity style={s.row} activeOpacity={0.7}>
    <IconBox>{iconEl}</IconBox>
    <View style={s.rowText}>
      <Text style={[s.rowTitle, gilroy('500')]}>{title}</Text>
    </View>
    <Text style={[s.badge, gilroy('600')]}>{badge}</Text>
    <ChevronRight />
  </TouchableOpacity>
);

// ─── Bottom tabs ──────────────────────────────────────────────────────────────
const BOTTOM_TABS = [
  { key: 'Home',     label: 'Home',     Icon: HomeTabIcon },
  { key: 'Usage',    label: 'Usage',    Icon: UsageTabIcon },
  { key: 'Settings', label: 'Settings', Icon: SettingsTabIcon },
  { key: 'Profile',  label: 'Profile',  Icon: ProfileTabIcon },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function SettingsScreen({ navigation }) {
  const [adaptiveSw,    setAdaptiveSw]    = useState(true);
  const [pushNotif,     setPushNotif]     = useState(true);
  const [soundHaptics,  setSoundHaptics]  = useState(false);
  const [activeTab,     setActiveTab]     = useState('Settings');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation?.goBack?.()} accessibilityLabel="Go back">
          <BlueArrow />
        </TouchableOpacity>
        <Text style={[s.hTitle, gilroy('bold')]}>Settings</Text>
        <TouchableOpacity style={s.hBtn} accessibilityLabel="Search">
          <SearchIcon />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable content ───────────────────────────────────────────────── */}
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ACCOUNT */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>ACCOUNT</Text>
        <View style={s.group}>
          <ChevronRow iconEl={<UserIcon />} title="Profile Details" subtitle="Manage your personal info" />
          <View style={s.divider} />
          <ChevronRow iconEl={<LockIcon />} title="Security & Password" />
        </View>

        {/* NETWORK SENSITIVITY */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>NETWORK SENSITIVITY</Text>
        <View style={s.group}>
          <ToggleRow iconEl={<WifiSwitchIcon />} title="Adaptive Switching" subtitle="Optimize for low latency" value={adaptiveSw} onChange={setAdaptiveSw} />
          <View style={s.divider} />
          <BadgeChevronRow iconEl={<SignalIcon />} title="Sensitivity Threshold" badge="High" />
        </View>

        {/* NOTIFICATIONS */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>NOTIFICATIONS</Text>
        <View style={s.group}>
          <ToggleRow iconEl={<BellIcon />} title="Push Notifications" value={pushNotif} onChange={setPushNotif} />
          <View style={s.divider} />
          <ToggleRow iconEl={<VibrateIcon />} title="Sound & Haptics" value={soundHaptics} onChange={setSoundHaptics} />
        </View>

        {/* SYSTEM PERMISSIONS */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>SYSTEM PERMISSIONS</Text>
        <View style={s.group}>
          <ChevronRow iconEl={<MapPinIcon />} title="Location Access" subtitle="While using the app" />
          <View style={s.divider} />
          <ChevronRow iconEl={<BluetoothIcon />} title="Bluetooth" />
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={[s.footerV, gilroy('400')]}>SmoothSwitch v2.4.0</Text>
          <Text style={[s.footerTag, gilroy('400')]}>Made with precision for connectivity</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Tab Bar ───────────────────────────────────────────────────── */}
      <View style={s.bottomBar}>
        {BOTTOM_TABS.map(({ key, label, Icon }) => {
          const active = activeTab === key;
          const c = active ? '#2196F3' : '#9E9E9E';
          return (
            <TouchableOpacity key={key} style={s.bottomItem}
              onPress={() => setActiveTab(key)} accessibilityLabel={label}>
              <Icon color={c} />
              <Text style={[s.bottomLbl, gilroy('600'), { color: c }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#FFFFFF' },
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  hTitle:  { flex: 1, fontSize: 20, color: '#1A1A2E' },
  hBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },

  sectionLbl: { fontSize: 11, color: '#BDBDBD', letterSpacing: 0.8, marginTop: 24, marginBottom: 12 },

  group:   { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0', overflow: 'hidden', ...Platform.select({ android: { elevation: 1 } }) },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },

  row:     { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  rowText: { flex: 1 },
  rowTitle:{ fontSize: 15, color: '#1A1A2E' },
  rowSub:  { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
  badge:   { fontSize: 14, color: '#1565C0', marginRight: 4 },

  footer:    { marginTop: 36, alignItems: 'center', gap: 5 },
  footerV:   { fontSize: 12, color: '#BDBDBD' },
  footerTag: { fontSize: 11, color: '#D9D9D9' },

  bottomBar:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEEEEE', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingBottom: Platform.OS === 'android' ? 8 : 14 },
  bottomItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  bottomLbl:  { fontSize: 10, letterSpacing: 0.2 },
});
