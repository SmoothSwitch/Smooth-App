import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

/** QR code icon (white lines on grey bg) */
const QRCodeIcon = () => (
  <View style={ic.qrWrap}>
    {/* Top-left cell */}
    <View style={[ic.qrCornerBox, { top: 0, left: 0 }]}>
      <View style={ic.qrCornerInner} />
    </View>
    {/* Top-right cell */}
    <View style={[ic.qrCornerBox, { top: 0, right: 0 }]}>
      <View style={ic.qrCornerInner} />
    </View>
    {/* Bottom-left cell */}
    <View style={[ic.qrCornerBox, { bottom: 0, left: 0 }]}>
      <View style={ic.qrCornerInner} />
    </View>
    {/* Centre dots */}
    <View style={ic.qrDotGrid}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={ic.qrDot} />
      ))}
    </View>
  </View>
);

/** Image/gallery icon */
const GalleryIcon = () => (
  <View style={ic.galleryWrap}>
    <View style={ic.galleryFrame} />
    <View style={ic.galleryMountain} />
    <View style={ic.gallerySun} />
  </View>
);

/** Camera icon (white on blue) */
const CameraIcon = ({ white }) => {
  const c = white ? '#FFFFFF' : '#424242';
  return (
    <View style={ic.camWrap}>
      <View style={[ic.camBody, { borderColor: c }]}>
        <View style={[ic.camLens, { borderColor: c }]} />
      </View>
      <View style={[ic.camBump, { backgroundColor: c }]} />
    </View>
  );
};

/** Flashlight icon */
const FlashlightIcon = () => (
  <View style={ic.flashWrap}>
    <View style={ic.flashHead} />
    <View style={ic.flashBody} />
    <View style={ic.flashBeam} />
  </View>
);

/** Green shield checkmark */
const ShieldCheckGreen = () => (
  <View style={ic.shieldOuter}>
    <View style={ic.shieldCheck1} />
    <View style={ic.shieldCheck2} />
  </View>
);

/** Download icon (white, for button) */
const DownloadIcon = () => (
  <View style={ic.dlWrap}>
    <View style={ic.dlBar} />
    <View style={ic.dlArrow} />
    <View style={ic.dlBase} />
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ActivateESIMScreen({ navigation }) {
  const [address, setAddress]    = useState('');
  const [code, setCode]          = useState('');
  const [activeCamera, setActiveCamera] = useState(true);

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
        <Text style={[s.headerTitle, gilroy('bold')]}>Add eSIM</Text>
        <View style={s.headerBtn} />
      </View>

      {/* ── Progress dots ───────────────────────────────────────────────────── */}
      <View style={s.dotsRow}>
        <View style={s.dotActive} />
        <View style={s.dotInactive} />
        <View style={s.dotInactive} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title & subtitle ──────────────────────────────────────────────── */}
        <Text style={[s.title, gilroy('bold')]}>Activate your eSIM</Text>
        <Text style={[s.subtitle, gilroy('400')]}>
          Scan the QR code provided by SmoothSwitch{'\n'}
          or enter the activation code manually to get{'\n'}
          connected instantly.
        </Text>

        {/* ── QR Scanner area ───────────────────────────────────────────────── */}
        <View style={s.scannerOuter}>
          {/* Grey background */}
          <View style={s.scannerBg}>
            {/* Blue border frame corners */}
            <View style={[s.corner, s.cornerTL]} />
            <View style={[s.corner, s.cornerTR]} />
            <View style={[s.corner, s.cornerBL]} />
            <View style={[s.corner, s.cornerBR]} />

            {/* Centre QR icon */}
            <QRCodeIcon />

            {/* Blue scanning line */}
            <View style={s.scanLine} />
          </View>
        </View>

        {/* ── Camera control buttons ────────────────────────────────────────── */}
        <View style={s.cameraControls}>
          {/* Gallery */}
          <TouchableOpacity
            style={s.camBtnGrey}
            accessibilityLabel="Open image gallery"
            onPress={() => setActiveCamera(false)}
          >
            <GalleryIcon />
          </TouchableOpacity>

          {/* Camera — active blue */}
          <TouchableOpacity
            style={s.camBtnBlue}
            accessibilityLabel="Use camera"
            onPress={() => setActiveCamera(true)}
          >
            <CameraIcon white />
          </TouchableOpacity>

          {/* Flashlight */}
          <TouchableOpacity
            style={s.camBtnGrey}
            accessibilityLabel="Toggle flashlight"
          >
            <FlashlightIcon />
          </TouchableOpacity>
        </View>

        {/* ── OR ENTER MANUALLY divider ─────────────────────────────────────── */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={[s.dividerText, gilroy('600')]}>OR ENTER MANUALLY</Text>
          <View style={s.dividerLine} />
        </View>

        {/* ── SM-DP+ Address ────────────────────────────────────────────────── */}
        <Text style={[s.inputLabel, gilroy('600')]}>SM-DP+ Address</Text>
        <TextInput
          style={[s.input, gilroy('400')]}
          placeholder="e.g. rsp.smoothswitch.com"
          placeholderTextColor="#BDBDBD"
          value={address}
          onChangeText={setAddress}
          autoCapitalize="none"
          keyboardType="url"
          accessibilityLabel="SM-DP+ Address input"
        />

        {/* ── Activation Code ───────────────────────────────────────────────── */}
        <Text style={[s.inputLabel, gilroy('600')]}>Activation Code</Text>
        <TextInput
          style={[s.input, gilroy('400')]}
          placeholder="Enter your unique code"
          placeholderTextColor="#BDBDBD"
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          accessibilityLabel="Activation Code input"
        />

        {/* ── Security info card ────────────────────────────────────────────── */}
        <View style={s.infoCard}>
          <ShieldCheckGreen />
          <Text style={[s.infoText, gilroy('400')]}>
            SmoothSwitch uses secure encryption to protect your network credentials during activation.
          </Text>
        </View>

        {/* ── Download eSIM button ──────────────────────────────────────────── */}
        <TouchableOpacity
          style={s.downloadBtn}
          activeOpacity={0.85}
          accessibilityLabel="Download eSIM"
        >
          <Text style={[s.downloadText, gilroy('bold')]}>Download eSIM</Text>
          <DownloadIcon />
        </TouchableOpacity>

        {/* ── Help link ─────────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.helpWrap} accessibilityLabel="Contact support">
          <Text style={[s.helpText, gilroy('500')]}>Need help? Contact support</Text>
        </TouchableOpacity>

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
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 19, color: '#1A1A2E', textAlign: 'center' },

  // Progress dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1565C0',
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 22 },

  // Title & subtitle
  title: {
    fontSize: 24,
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  // Scanner
  scannerOuter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scannerBg: {
    width: '90%',
    aspectRatio: 1,
    backgroundColor: '#BDBDBD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Blue border corners
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#1565C0',
  },
  cornerTL: {
    top: 18, left: 18,
    borderTopWidth: 4, borderLeftWidth: 4,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 18, right: 18,
    borderTopWidth: 4, borderRightWidth: 4,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 18, left: 18,
    borderBottomWidth: 4, borderLeftWidth: 4,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 18, right: 18,
    borderBottomWidth: 4, borderRightWidth: 4,
    borderBottomRightRadius: 4,
  },

  // Scanning line
  scanLine: {
    position: 'absolute',
    left: 18, right: 18,
    top: '50%',
    height: 2,
    backgroundColor: 'rgba(21, 101, 192, 0.7)',
    borderRadius: 1,
  },

  // Camera controls
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    marginBottom: 24,
  },
  camBtnGrey: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camBtnBlue: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({ android: { elevation: 4 } }),
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0E0' },
  dividerText: { fontSize: 11, color: '#9E9E9E', letterSpacing: 1 },

  // Inputs
  inputLabel: { fontSize: 13, color: '#424242', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1A1A2E',
    backgroundColor: '#FAFAFA',
    marginBottom: 14,
  },

  // Info card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0FFF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8F0D5',
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 20,
  },

  // Download button
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    marginBottom: 16,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  downloadText: { fontSize: 17, color: '#FFFFFF' },

  // Help link
  helpWrap: { alignItems: 'center', paddingVertical: 4 },
  helpText: { fontSize: 14, color: '#757575' },
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

  // QR code icon
  qrWrap: {
    width: 60, height: 60,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCornerBox: {
    position: 'absolute',
    width: 18, height: 18,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCornerInner: {
    width: 8, height: 8,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 1,
  },
  qrDotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 16, gap: 3,
  },
  qrDot: { width: 5, height: 5, borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.6)' },

  // Gallery icon
  galleryWrap: { width: 22, height: 20, position: 'relative' },
  galleryFrame: {
    position: 'absolute',
    width: 20, height: 18,
    borderWidth: 1.8, borderColor: '#616161',
    borderRadius: 3,
  },
  galleryMountain: {
    position: 'absolute',
    bottom: 2, left: 1,
    width: 0, height: 0,
    borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: '#9E9E9E',
  },
  gallerySun: {
    position: 'absolute',
    top: 3, right: 4,
    width: 5, height: 5, borderRadius: 3,
    backgroundColor: '#9E9E9E',
  },

  // Camera icon
  camWrap: { width: 24, height: 20, alignItems: 'center' },
  camBody: {
    width: 22, height: 16, borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },
  camLens: {
    width: 9, height: 9, borderRadius: 5,
    borderWidth: 1.8,
  },
  camBump: {
    position: 'absolute',
    top: 0,
    width: 8, height: 4,
    borderRadius: 2,
  },

  // Flashlight
  flashWrap: { width: 14, height: 22, alignItems: 'center' },
  flashHead: {
    width: 10, height: 5,
    borderTopLeftRadius: 3, borderTopRightRadius: 3,
    backgroundColor: '#616161',
  },
  flashBody: {
    width: 14, height: 12,
    borderBottomLeftRadius: 3, borderBottomRightRadius: 3,
    backgroundColor: '#9E9E9E',
  },
  flashBeam: {
    width: 6, height: 4,
    backgroundColor: '#BDBDBD',
    borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
  },

  // Shield check (green)
  shieldOuter: {
    width: 20, height: 22,
    borderRadius: 4,
    borderWidth: 2, borderColor: '#2E7D32',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  shieldCheck1: {
    position: 'absolute',
    bottom: 5, left: 3,
    width: 5, height: 2, borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '45deg' }],
  },
  shieldCheck2: {
    position: 'absolute',
    bottom: 4, left: 6,
    width: 2, height: 9, borderRadius: 1,
    backgroundColor: '#2E7D32',
    transform: [{ rotate: '-45deg' }],
  },

  // Download icon (white)
  dlWrap: { width: 18, height: 18, alignItems: 'center' },
  dlBar: {
    width: 2, height: 9, borderRadius: 1,
    backgroundColor: '#FFFFFF',
    position: 'absolute', top: 0,
  },
  dlArrow: {
    position: 'absolute', top: 7,
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 7,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  dlBase: {
    position: 'absolute', bottom: 0,
    width: 14, height: 2, borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});
