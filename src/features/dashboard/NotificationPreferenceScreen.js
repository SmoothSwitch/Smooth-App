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

// ─── Gilroy font helper ────────────────────────────────────────────────────────
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

// ─── Icon primitives ───────────────────────────────────────────────────────────

/** ← Back arrow */
const BackArrow = () => (
  <View style={ic.arrowWrap}>
    <View style={ic.arrowStem} />
    <View style={ic.arrowHead} />
  </View>
);

/** 🔔 Bell icon */
const BellIcon = ({ color = '#1565C0' }) => (
  <View style={ic.bellWrap}>
    {/* bell dome */}
    <View style={[ic.bellDome, { borderColor: color }]} />
    {/* bell body */}
    <View style={[ic.bellBody, { borderColor: color, borderTopWidth: 0 }]} />
    {/* clapper */}
    <View style={[ic.bellClapper, { backgroundColor: color }]} />
    {/* hanger */}
    <View style={[ic.bellHanger, { backgroundColor: color }]} />
  </View>
);

/** 💬 Chat bubble / SMS icon */
const ChatIcon = ({ color = '#2E7D32' }) => (
  <View style={ic.chatWrap}>
    <View style={[ic.chatBubble, { borderColor: color }]}>
      {/* dots inside */}
      {[0, 1, 2].map((i) => (
        <View key={i} style={[ic.chatDot, { backgroundColor: color }]} />
      ))}
    </View>
    {/* tail */}
    <View
      style={[
        ic.chatTail,
        { borderTopColor: color },
      ]}
    />
  </View>
);

/** ✉ Mail / envelope icon */
const MailIcon = ({ color = '#1565C0' }) => (
  <View style={ic.mailWrap}>
    {/* envelope body */}
    <View style={[ic.mailBody, { borderColor: color }]} />
    {/* V flap */}
    <View style={[ic.mailFlapL, { borderColor: color }]} />
    <View style={[ic.mailFlapR, { borderColor: color }]} />
  </View>
);

/** 💳 Wallet icon */
const WalletIcon = ({ color = '#2E7D32' }) => (
  <View style={ic.walletWrap}>
    {/* body */}
    <View style={[ic.walletBody, { borderColor: color }]}>
      {/* coin slot circle */}
      <View style={[ic.walletCoin, { borderColor: color }]} />
    </View>
    {/* flap / top fold */}
    <View style={[ic.walletFlap, { borderColor: color }]} />
  </View>
);

/** 🛡 Shield icon */
const ShieldIcon = ({ color = '#424242' }) => (
  <View style={ic.shWrap}>
    <View style={[ic.shOuter, { borderColor: color }]} />
    {/* check mark inside */}
    <View style={[ic.shCheckL, { backgroundColor: color }]} />
    <View style={[ic.shCheckR, { backgroundColor: color }]} />
  </View>
);

/** 📱 Smartphone icon */
const SmartphoneIcon = ({ color = '#424242' }) => (
  <View style={ic.phoneWrap}>
    <View style={[ic.phoneBody, { borderColor: color }]}>
      <View style={[ic.phoneScreen, { backgroundColor: color, opacity: 0.15 }]} />
      <View style={[ic.phoneBtn, { backgroundColor: color }]} />
    </View>
  </View>
);

// ─── Reusable toggle row ───────────────────────────────────────────────────────
const ToggleRow = ({
  icon,
  iconBg,
  title,
  description,
  value,
  onValueChange,
  isLast = false,
}) => (
  <View>
    <View style={s.row}>
      <View style={[s.iconBox, { backgroundColor: iconBg }]}>{icon}</View>
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

// ─── Section block ─────────────────────────────────────────────────────────────
const Section = ({ label, subtitle, children }) => (
  <View style={s.section}>
    <Text style={[s.sectionLabel, gilroy('bold')]}>{label}</Text>
    <Text style={[s.sectionSub, gilroy('400')]}>{subtitle}</Text>
    <View style={s.card}>{children}</View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function NotificationPreferenceScreen({ navigation }) {
  const [pushNotif, setPushNotif]     = useState(true);
  const [smsUpdates, setSmsUpdates]   = useState(false);
  const [emailSum, setEmailSum]       = useState(true);
  const [lowBalance, setLowBalance]   = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [twoFactor, setTwoFactor]     = useState(true);

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

        <Text style={[s.headerTitle, gilroy('bold')]}>Notification Preferences</Text>

        <TouchableOpacity
          style={s.headerBtn}
          accessibilityLabel="Save preferences"
          onPress={() => {}}
        >
          <Text style={[s.saveBtn, gilroy('600')]}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── NETWORK STATUS ──────────────────────────────────────────────── */}
        <Section
          label="NETWORK STATUS"
          subtitle="Stay updated on the SmoothSwitch grid performance."
        >
          <ToggleRow
            icon={<BellIcon color="#1565C0" />}
            iconBg="#EBF3FF"
            title="Push Notifications"
            description="Real-time switching alerts"
            value={pushNotif}
            onValueChange={setPushNotif}
          />
          <ToggleRow
            icon={<ChatIcon color="#2E7D32" />}
            iconBg="#E8F5E9"
            title="SMS Updates"
            description="Critical network outages"
            value={smsUpdates}
            onValueChange={setSmsUpdates}
            isLast
          />
        </Section>

        {/* ── WALLET & BALANCE ────────────────────────────────────────────── */}
        <Section
          label="WALLET &amp; BALANCE"
          subtitle="Manage financial activity and usage alerts."
        >
          <ToggleRow
            icon={<MailIcon color="#1565C0" />}
            iconBg="#EBF3FF"
            title="Email Summaries"
            description="Monthly usage and billing"
            value={emailSum}
            onValueChange={setEmailSum}
          />
          <ToggleRow
            icon={<WalletIcon color="#2E7D32" />}
            iconBg="#E8F5E9"
            title="Low Balance Alert"
            description="When balance is below $10.00"
            value={lowBalance}
            onValueChange={setLowBalance}
            isLast
          />
        </Section>

        {/* ── SECURITY ────────────────────────────────────────────────────── */}
        <Section
          label="SECURITY"
          subtitle="Protect your account and connection."
        >
          <ToggleRow
            icon={<ShieldIcon color="#424242" />}
            iconBg="#F5F5F5"
            title="New Login Alerts"
            description="Email and Push for new devices"
            value={loginAlerts}
            onValueChange={setLoginAlerts}
          />
          <ToggleRow
            icon={<SmartphoneIcon color="#424242" />}
            iconBg="#F5F5F5"
            title="Two-Factor SMS"
            description="Required for all withdrawals"
            value={twoFactor}
            onValueChange={setTwoFactor}
            isLast
          />
        </Section>

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <View style={s.footer}>
          <Text style={[s.footerText, gilroy('400')]}>
            Need help with your notification settings?
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://smoothswitch.io/support')}
            accessibilityRole="link"
            accessibilityLabel="Visit Support Center"
          >
            <Text style={[s.footerLink, gilroy('600')]}>Visit Support Center</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
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
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerBtn: {
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    color: '#1A1A2E',
    textAlign: 'center',
  },
  saveBtn: {
    fontSize: 15,
    color: '#1565C0',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  // Section
  section: { marginTop: 24 },
  sectionLabel: {
    fontSize: 12,
    color: '#1A1A2E',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  sectionSub: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 14,
    lineHeight: 17,
  },

  // Card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    ...Platform.select({ android: { elevation: 1 } }),
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, color: '#1A1A2E', marginBottom: 3 },
  rowDesc:  { fontSize: 12, color: '#9E9E9E' },

  // Icon square
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  divider: { height: 1, backgroundColor: '#F5F5F5', marginHorizontal: 16 },

  // Footer
  footer: {
    marginTop: 36,
    alignItems: 'center',
    gap: 6,
  },
  footerText: { fontSize: 13, color: '#9E9E9E' },
  footerLink: { fontSize: 13, color: '#1565C0' },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const ic = StyleSheet.create({
  // Back arrow
  arrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  arrowStem: {
    position: 'absolute',
    width: 16, height: 2, borderRadius: 1,
    backgroundColor: '#1A1A2E',
    left: 0, top: 6,
  },
  arrowHead: {
    position: 'absolute',
    width: 0, height: 0,
    borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 8,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
    borderRightColor: '#1A1A2E',
    left: 0, top: 2,
  },

  // Bell
  bellWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'flex-end' },
  bellHanger: {
    position: 'absolute', top: 0,
    width: 4, height: 4, borderRadius: 2,
  },
  bellDome: {
    position: 'absolute', top: 3,
    width: 14, height: 9,
    borderTopLeftRadius: 7, borderTopRightRadius: 7,
    borderWidth: 1.8,
  },
  bellBody: {
    position: 'absolute', top: 11,
    width: 16, height: 6,
    borderLeftWidth: 1.8, borderRightWidth: 1.8, borderBottomWidth: 1.8,
    borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
  },
  bellClapper: {
    position: 'absolute', bottom: 0,
    width: 5, height: 5, borderRadius: 2.5,
  },

  // Chat bubble
  chatWrap: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  chatBubble: {
    width: 20, height: 15,
    borderRadius: 5,
    borderWidth: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2.5,
    paddingHorizontal: 3,
    marginBottom: 3,
  },
  chatDot: { width: 3, height: 3, borderRadius: 1.5 },
  chatTail: {
    position: 'absolute', bottom: 0, left: 4,
    width: 0, height: 0,
    borderTopWidth: 5, borderRightWidth: 5,
    borderRightColor: 'transparent',
  },

  // Mail envelope
  mailWrap: { width: 24, height: 18, alignItems: 'center', justifyContent: 'center' },
  mailBody: {
    width: 22, height: 16,
    borderWidth: 1.8, borderRadius: 3,
    position: 'absolute',
  },
  mailFlapL: {
    position: 'absolute', top: 1, left: 1,
    width: 11, height: 8,
    borderRightWidth: 1.8,
    transform: [{ rotate: '25deg' }, { translateX: -2 }],
  },
  mailFlapR: {
    position: 'absolute', top: 1, right: 1,
    width: 11, height: 8,
    borderLeftWidth: 1.8,
    transform: [{ rotate: '-25deg' }, { translateX: 2 }],
  },

  // Wallet
  walletWrap: { width: 24, height: 20, alignItems: 'center', justifyContent: 'center' },
  walletFlap: {
    position: 'absolute', top: 0,
    width: 20, height: 5,
    borderTopLeftRadius: 3, borderTopRightRadius: 3,
    borderWidth: 1.8,
    borderBottomWidth: 0,
  },
  walletBody: {
    position: 'absolute', bottom: 0,
    width: 22, height: 15,
    borderRadius: 4,
    borderWidth: 1.8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 5,
  },
  walletCoin: {
    width: 7, height: 7, borderRadius: 3.5,
    borderWidth: 1.5,
  },

  // Shield
  shWrap: { width: 22, height: 24, alignItems: 'center', justifyContent: 'center' },
  shOuter: {
    position: 'absolute', top: 0,
    width: 20, height: 22,
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
    borderWidth: 1.8,
  },
  shCheckL: {
    position: 'absolute', top: 12, left: 4,
    width: 5, height: 1.8, borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  shCheckR: {
    position: 'absolute', top: 10, right: 3,
    width: 8, height: 1.8, borderRadius: 1,
    transform: [{ rotate: '-50deg' }],
  },

  // Smartphone
  phoneWrap: { width: 16, height: 24, alignItems: 'center' },
  phoneBody: {
    width: 15, height: 22,
    borderWidth: 1.8, borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 3,
    overflow: 'hidden',
  },
  phoneScreen: {
    width: 9, height: 12, borderRadius: 1,
  },
  phoneBtn: {
    width: 5, height: 2, borderRadius: 1,
  },
});
