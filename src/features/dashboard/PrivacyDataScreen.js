import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Platform,
  Linking,
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

/** › Chevron right */
const ChevronRight = () => (
  <View style={ic.chevWrap}>
    <View style={ic.chevTop} />
    <View style={ic.chevBot} />
  </View>
);

/** ⬇ Download icon (arrow pointing into tray) */
const DownloadIcon = () => (
  <View style={ic.dlWrap}>
    {/* vertical stem */}
    <View style={ic.dlStem} />
    {/* arrowhead pointing down */}
    <View style={ic.dlHead} />
    {/* tray base */}
    <View style={ic.dlTray} />
  </View>
);

/** 🗑 Trash icon */
const TrashIcon = () => (
  <View style={ic.trashWrap}>
    {/* lid */}
    <View style={ic.trashLid} />
    {/* handle on lid */}
    <View style={ic.trashHandle} />
    {/* body */}
    <View style={ic.trashBody}>
      {/* three vertical lines */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={ic.trashLine} />
      ))}
    </View>
  </View>
);

// ─── Reusable row components ──────────────────────────────────────────────────

/** Toggle row */
const ToggleRow = ({ title, description, value, onValueChange, isLast = false }) => (
  <View>
    <View style={s.row}>
      <View style={s.rowText}>
        <Text style={[s.rowTitle, gilroy('500')]}>{title}</Text>
        <Text style={[s.rowDesc, gilroy('400')]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D1D6', true: '#1565C0' }}
        thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
        ios_backgroundColor="#D1D1D6"
      />
    </View>
    {!isLast && <View style={s.divider} />}
  </View>
);

/** Chevron row (no icon) */
const ChevronRow = ({ title, description, isLast = false }) => (
  <View>
    <TouchableOpacity style={s.row} activeOpacity={0.7}>
      <View style={s.rowText}>
        <Text style={[s.rowTitle, gilroy('500')]}>{title}</Text>
        <Text style={[s.rowDesc, gilroy('400')]}>{description}</Text>
      </View>
      <ChevronRight />
    </TouchableOpacity>
    {!isLast && <View style={s.divider} />}
  </View>
);

/** Chevron row with a coloured icon square */
const IconChevronRow = ({
  icon,
  iconBg,
  title,
  titleColor = '#1A1A2E',
  description,
  isLast = false,
}) => (
  <View>
    <TouchableOpacity style={s.row} activeOpacity={0.7}>
      {/* Coloured icon square */}
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={s.rowText}>
        <Text style={[s.rowTitle, gilroy('500'), { color: titleColor }]}>{title}</Text>
        <Text style={[s.rowDesc, gilroy('400')]}>{description}</Text>
      </View>
      <ChevronRight />
    </TouchableOpacity>
    {!isLast && <View style={s.divider} />}
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PrivacyDataScreen({ navigation }) {
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [locationHistory, setLocationHistory] = useState(true);

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

        <Text style={[s.headerTitle, gilroy('bold')]}>Privacy &amp; Data</Text>

        {/* Placeholder to keep title centred */}
        <View style={s.headerBtn} />
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── DATA SHARING ────────────────────────────────────────────────── */}
        <Text style={[s.sectionLabel, gilroy('bold')]}>DATA SHARING</Text>

        <View style={s.card}>
          <ToggleRow
            title="Share Usage Analytics"
            description="Help us improve SmoothSwitch by sharing anonymous usage data."
            value={shareAnalytics}
            onValueChange={setShareAnalytics}
          />
          <ToggleRow
            title="Personalized Ads"
            description="Allow us to show you ads based on your interests and activity."
            value={personalizedAds}
            onValueChange={setPersonalizedAds}
            isLast
          />
        </View>

        {/* ── LOCATION & PRIVACY ──────────────────────────────────────────── */}
        <Text style={[s.sectionLabel, gilroy('bold')]}>LOCATION &amp; PRIVACY</Text>

        <View style={s.card}>
          <ToggleRow
            title="Location History"
            description="Keep track of places you visit for personalized travel advice."
            value={locationHistory}
            onValueChange={setLocationHistory}
          />
          <ChevronRow
            title="Precise Location Access"
            description="Manage which features can access your GPS data."
            isLast
          />
        </View>

        {/* ── ACCOUNT CONTROL ─────────────────────────────────────────────── */}
        <Text style={[s.sectionLabel, gilroy('bold')]}>ACCOUNT CONTROL</Text>

        <View style={s.card}>
          <IconChevronRow
            icon={<DownloadIcon />}
            iconBg="#EBF3FF"
            title="Download Your Data"
            description="Request a copy of your personal archive."
          />
          <IconChevronRow
            icon={<TrashIcon />}
            iconBg="#FFEBEE"
            title="Delete Account"
            titleColor="#D32F2F"
            description="Permanently remove your account and data."
            isLast
          />
        </View>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <View style={s.footer}>
          <Text style={[s.footerText, gilroy('400')]}>
            {'Your privacy is important to us. SmoothSwitch uses industry-standard encryption to protect your data. Read our '}
            <Text
              style={[s.footerLink, gilroy('500')]}
              onPress={() => Linking.openURL('https://smoothswitch.io/privacy')}
              accessibilityRole="link"
              accessibilityLabel="Privacy Policy"
            >
              Privacy Policy
            </Text>
            {' to learn more.'}
          </Text>
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
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 19,
    color: '#1A1A2E',
    textAlign: 'center',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },

  // Section label
  sectionLabel: {
    fontSize: 12,
    color: '#1A1A2E',
    letterSpacing: 0.6,
    marginBottom: 12,
    marginTop: 22,
  },

  // Card group
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    ...Platform.select({ android: { elevation: 1 } }),
  },

  // Generic row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, color: '#1A1A2E', marginBottom: 3 },
  rowDesc: { fontSize: 13, color: '#9E9E9E', lineHeight: 18 },

  // Icon square (Account Control rows)
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },

  // Footer
  footer: {
    marginTop: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 19,
  },
  footerLink: {
    fontSize: 12,
    color: '#1565C0',
  },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const ic = StyleSheet.create({
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

  // Chevron right
  chevWrap: { width: 10, height: 20, justifyContent: 'center' },
  chevTop: {
    position: 'absolute',
    top: 5,
    width: 8,
    height: 1.8,
    borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '45deg' }],
  },
  chevBot: {
    position: 'absolute',
    bottom: 5,
    width: 8,
    height: 1.8,
    borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },

  // Download icon
  dlWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  dlStem: {
    position: 'absolute',
    top: 1,
    width: 2.5,
    height: 10,
    borderRadius: 1,
    backgroundColor: '#1565C0',
  },
  dlHead: {
    position: 'absolute',
    top: 9,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1565C0',
  },
  dlTray: {
    position: 'absolute',
    bottom: 1,
    width: 16,
    height: 2.5,
    borderRadius: 1,
    backgroundColor: '#1565C0',
  },

  // Trash icon
  trashWrap: {
    width: 20,
    height: 22,
    alignItems: 'center',
  },
  trashLid: {
    width: 18,
    height: 2.5,
    borderRadius: 1,
    backgroundColor: '#D32F2F',
    marginBottom: 2,
  },
  trashHandle: {
    position: 'absolute',
    top: 0,
    width: 8,
    height: 2.5,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 1.5,
    borderColor: '#D32F2F',
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  trashBody: {
    width: 16,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#D32F2F',
    borderTopWidth: 0,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingTop: 2,
    paddingBottom: 2,
  },
  trashLine: {
    width: 1.5,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#D32F2F',
  },
});
