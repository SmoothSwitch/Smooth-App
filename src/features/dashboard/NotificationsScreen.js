import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, StyleSheet, Platform,
} from 'react-native';

const gilroy = (w = '400') => ({
  fontFamily: w === 'bold' || w === '700' ? 'Gilroy-Bold'
    : w === '600' ? 'Gilroy-SemiBold'
    : w === '500' ? 'Gilroy-Medium'
    : 'Gilroy-Regular',
});

// ─── Icons ────────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <View style={ic.arrowWrap}>
    <View style={ic.arrowStem} />
    <View style={ic.arrowHead} />
  </View>
);

const ThreeDots = () => (
  <View style={{ gap: 4, alignItems: 'center', justifyContent: 'center' }}>
    {[0, 1, 2].map(i => (
      <View key={i} style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#1A1A2E' }} />
    ))}
  </View>
);

// Green checkmark
const CheckIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#2E7D32' }} />
    <View style={{ position: 'absolute', bottom: 6, left: 3, width: 6, height: 2, borderRadius: 1, backgroundColor: '#2E7D32', transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', bottom: 5, right: 3, width: 10, height: 2, borderRadius: 1, backgroundColor: '#2E7D32', transform: [{ rotate: '-50deg' }] }} />
  </View>
);

// Blue info icon
const InfoIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ position: 'absolute', width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#1565C0' }} />
    <View style={{ position: 'absolute', top: 4, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: '#1565C0' }} />
    <View style={{ position: 'absolute', bottom: 4, width: 2.5, height: 7, borderRadius: 1, backgroundColor: '#1565C0' }} />
  </View>
);

// Yellow warning triangle
const WarnIcon = () => (
  <View style={{ width: 22, height: 20, alignItems: 'center', justifyContent: 'flex-end' }}>
    <View style={{ width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#F57C00' }} />
    <View style={{ position: 'absolute', bottom: 7, width: 2.5, height: 7, borderRadius: 1, backgroundColor: '#FFFFFF' }} />
    <View style={{ position: 'absolute', bottom: 3.5, width: 2.5, height: 2.5, borderRadius: 1.25, backgroundColor: '#FFFFFF' }} />
  </View>
);

// Grey clock / history icon
const ClockIcon = () => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.8, borderColor: '#9E9E9E' }} />
    <View style={{ position: 'absolute', top: 4, width: 1.8, height: 6, borderRadius: 1, backgroundColor: '#9E9E9E' }} />
    <View style={{ position: 'absolute', left: 11, top: 9, width: 4, height: 1.8, borderRadius: 1, backgroundColor: '#9E9E9E' }} />
  </View>
);

// Large faded bell for empty state
const BellEmptyIcon = () => (
  <View style={{ width: 48, height: 52, alignItems: 'center' }}>
    <View style={{ width: 6, height: 6, borderRadius: 3, borderWidth: 2, borderColor: '#BDBDBD', marginBottom: 0 }} />
    <View style={{ width: 36, height: 24, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderWidth: 2.5, borderColor: '#BDBDBD', borderBottomWidth: 0 }} />
    <View style={{ width: 40, height: 6, borderLeftWidth: 2.5, borderRightWidth: 2.5, borderBottomWidth: 2.5, borderColor: '#BDBDBD', borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2.5, borderColor: '#BDBDBD', marginTop: 2 }} />
  </View>
);

// Bottom tab icons
const HomeTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 20, alignItems: 'center' }}>
    <View style={{ width: 0, height: 0, borderLeftWidth: 11, borderRightWidth: 11, borderBottomWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color }} />
    <View style={{ width: 16, height: 10, borderWidth: 1.5, borderTopWidth: 0, borderColor: color, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{ width: 6, height: 7, borderWidth: 1.5, borderBottomWidth: 0, borderColor: color }} />
    </View>
  </View>
);

const NetworkTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.8, borderColor: color }} />
    <View style={{ position: 'absolute', width: 20, height: 1.5, backgroundColor: color, opacity: 0.4 }} />
    <View style={{ position: 'absolute', width: 1.5, height: 20, backgroundColor: color, opacity: 0.4 }} />
    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color }} />
  </View>
);

const UsageTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 20, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
    {[8, 14, 10, 20].map((h, i) => (
      <View key={i} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: color }} />
    ))}
  </View>
);

const NotifTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 24, alignItems: 'center' }}>
    <View style={{ width: 4, height: 4, borderRadius: 2, borderWidth: 1.5, borderColor: color, marginBottom: 0 }} />
    <View style={{ width: 18, height: 12, borderTopLeftRadius: 9, borderTopRightRadius: 9, borderWidth: 1.8, borderColor: color, borderBottomWidth: 0 }} />
    <View style={{ width: 22, height: 4, borderLeftWidth: 1.8, borderRightWidth: 1.8, borderBottomWidth: 1.8, borderColor: color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1.8, borderColor: color, marginTop: 1 }} />
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

// ─── Notification item ────────────────────────────────────────────────────────
const NotifItem = ({ iconEl, iconBg, title, time, desc, action }) => (
  <View style={s.notifItem}>
    <View style={[s.notifIconBox, { backgroundColor: iconBg }]}>{iconEl}</View>
    <View style={s.notifBody}>
      <View style={s.notifTopRow}>
        <Text style={[s.notifTitle, gilroy('bold')]}>{title}</Text>
        <Text style={[s.notifTime, gilroy('400')]}>{time}</Text>
      </View>
      <Text style={[s.notifDesc, gilroy('400')]}>{desc}</Text>
      {action && (
        <View style={s.notifActionRow}>
          <TouchableOpacity style={s.topUpBtn} accessibilityLabel="Top Up">
            <Text style={[s.topUpBtnText, gilroy('bold')]}>Top Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const TABS = ['All', 'Unread', 'Important'];
const BOTTOM_TABS = [
  { key: 'Home',          label: 'Home',          Icon: HomeTabIcon },
  { key: 'Network',       label: 'Network',       Icon: NetworkTabIcon },
  { key: 'Usage',         label: 'Usage',         Icon: UsageTabIcon },
  { key: 'Notifications', label: 'Notifications', Icon: NotifTabIcon },
  { key: 'Settings',      label: 'Settings',      Icon: SettingsTabIcon },
];

export default function NotificationsScreen({ navigation }) {
  const [activeTab,    setActiveTab]    = useState('All');
  const [activeBottom, setActiveBottom] = useState('Notifications');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity style={s.hBtn} onPress={() => navigation?.goBack?.()} accessibilityLabel="Go back">
          <BackArrow />
        </TouchableOpacity>
        <Text style={[s.hTitle, gilroy('bold')]}>Notifications</Text>
        <TouchableOpacity style={s.hBtn} accessibilityLabel="More options">
          <ThreeDots />
        </TouchableOpacity>
      </View>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <View style={s.tabRow}>
        {TABS.map(t => {
          const on = activeTab === t;
          return (
            <TouchableOpacity key={t} style={[s.tabBtn, on && s.tabBtnOn]}
              onPress={() => setActiveTab(t)} accessibilityLabel={`Tab ${t}`}>
              <Text style={[s.tabBtnText, gilroy('600'), { color: on ? '#1565C0' : '#9E9E9E' }]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── List ─────────────────────────────────────────────────────────────── */}
      <ScrollView style={s.scroll} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>

        {/* TODAY */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionLabel, gilroy('bold')]}>TODAY</Text>
        </View>

        <View style={s.card}>
          <NotifItem
            iconEl={<CheckIcon />}
            iconBg="#E8F5E9"
            title="Switch Successful"
            time="2m ago"
            desc="Your connection has been moved to the fastest network available (5G+) for optimal performance."
          />
          <View style={s.divider} />
          <NotifItem
            iconEl={<InfoIcon />}
            iconBg="#EBF3FF"
            title="New Network Advisory"
            time="1h ago"
            desc="New high-speed coverage detected in your area. Update your preferences to prioritize this node."
          />
        </View>

        {/* YESTERDAY */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionLabel, gilroy('bold')]}>YESTERDAY</Text>
        </View>

        <View style={s.card}>
          <NotifItem
            iconEl={<WarnIcon />}
            iconBg="#FFF8E1"
            title="Low Balance"
            time="Yesterday"
            desc="Your data credit is below 500MB. Top up now to avoid automatic bandwidth throttling."
            action
          />
          <View style={s.divider} />
          <NotifItem
            iconEl={<ClockIcon />}
            iconBg="#F5F5F5"
            title="Usage Report Ready"
            time="Yesterday"
            desc="Your weekly connectivity and switch report is ready for viewing in the Usage tab."
          />
        </View>

        {/* THIS WEEK */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionLabel, gilroy('bold')]}>THIS WEEK</Text>
        </View>

        {/* Empty state */}
        <View style={s.emptyWrap}>
          <BellEmptyIcon />
          <Text style={[s.emptyText, gilroy('400')]}>No older notifications to show</Text>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom Tab Bar ───────────────────────────────────────────────────── */}
      <View style={s.bottomBar}>
        {BOTTOM_TABS.map(({ key, label, Icon }) => {
          const active = activeBottom === key;
          const c = active ? '#2196F3' : '#9E9E9E';
          return (
            <TouchableOpacity key={key} style={s.bottomItem}
              onPress={() => setActiveBottom(key)} accessibilityLabel={label}>
              <Icon color={c} />
              <Text style={[s.bottomLabel, gilroy('600'), { color: c }]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F5F5F5' },

  // Header
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#FFFFFF' },
  hBtn:    { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { flex: 1, fontSize: 19, color: '#1A1A2E', textAlign: 'center' },

  // Tabs
  tabRow:    { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabBtn:    { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnOn:  { borderBottomColor: '#1565C0' },
  tabBtnText:{ fontSize: 14 },

  // Scroll
  scroll:      { flex: 1 },
  listContent: { paddingBottom: 8 },

  // Section header
  sectionHeader: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#F0F2F5' },
  sectionLabel:  { fontSize: 11, color: '#9E9E9E', letterSpacing: 0.8 },

  // Card
  card:    { backgroundColor: '#FFFFFF', marginBottom: 2 },
  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },

  // Notification item
  notifItem:    { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, gap: 12, alignItems: 'flex-start' },
  notifIconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0. },
  notifBody:    { flex: 1 },
  notifTopRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle:   { fontSize: 14, color: '#1A1A2E', flex: 1, marginRight: 8 },
  notifTime:    { fontSize: 11, color: '#BDBDBD', flexShrink: 0 },
  notifDesc:    { fontSize: 12, color: '#757575', lineHeight: 18 },

  // Action row (Top Up)
  notifActionRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  topUpBtn:       { backgroundColor: '#1565C0', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7 },
  topUpBtnText:   { fontSize: 12, color: '#FFFFFF' },

  // Empty state
  emptyWrap: { backgroundColor: '#F0F2F5', alignItems: 'center', justifyContent: 'center', paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 13, color: '#BDBDBD' },

  // Bottom bar
  bottomBar:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEEEEE', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingBottom: Platform.OS === 'android' ? 8 : 14 },
  bottomItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  bottomLabel:{ fontSize: 9, letterSpacing: 0.2 },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const ic = StyleSheet.create({
  arrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  arrowStem: { position: 'absolute', width: 16, height: 2, borderRadius: 1, backgroundColor: '#1A1A2E', left: 0, top: 6 },
  arrowHead: { position: 'absolute', width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 8, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#1A1A2E', left: 0, top: 2 },
});
