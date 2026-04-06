import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, StyleSheet, Platform, PanResponder,
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

const SunIcon = ({ color = '#FFA000' }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    {[0, 45, 90, 135].map((deg, i) => (
      <View key={i} style={{ position: 'absolute', width: 2, height: 18, borderRadius: 1, backgroundColor: color, opacity: 0.7, transform: [{ rotate: `${deg}deg` }] }} />
    ))}
    <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: color }} />
  </View>
);

const MoonIcon = ({ color = '#607D8B' }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 2.2, borderColor: color, borderRightColor: 'transparent', transform: [{ rotate: '140deg' }] }} />
  </View>
);

const MonitorIcon = ({ color = '#607D8B' }) => (
  <View style={{ width: 24, height: 20, alignItems: 'center' }}>
    <View style={{ width: 22, height: 14, borderWidth: 1.8, borderRadius: 2, borderColor: color }} />
    <View style={{ width: 1.8, height: 3, backgroundColor: color }} />
    <View style={{ width: 10, height: 1.8, borderRadius: 1, backgroundColor: color }} />
  </View>
);

const Grid2x2 = ({ color, filled = false, thick = false }) => (
  <View style={{ width: 26, height: 26, flexDirection: 'row', flexWrap: 'wrap', gap: 3, alignContent: 'flex-start' }}>
    {[0, 1, 2, 3].map(i => (
      <View key={i} style={{ width: 10, height: 10, borderRadius: 2, ...(filled ? { backgroundColor: color } : { borderWidth: thick ? 2.5 : 1.5, borderColor: color }) }} />
    ))}
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

const DevicesTabIcon = ({ color }) => (
  <View style={{ width: 26, height: 20, alignItems: 'center' }}>
    <View style={{ width: 24, height: 15, borderWidth: 1.5, borderRadius: 2, borderColor: color }} />
    <View style={{ width: 1.5, height: 3, backgroundColor: color }} />
    <View style={{ width: 10, height: 1.8, borderRadius: 1, backgroundColor: color }} />
  </View>
);

const ActivityTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.8, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ position: 'absolute', top: 2.5, width: 1.5, height: 5, borderRadius: 1, backgroundColor: color }} />
      <View style={{ position: 'absolute', left: 8, top: 7, width: 4, height: 1.5, borderRadius: 1, backgroundColor: color }} />
    </View>
  </View>
);

const SettingsTabIcon = ({ color }) => (
  <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ width: 9, height: 9, borderRadius: 4.5, borderWidth: 2, borderColor: color }} />
    {[0, 60, 120].map((deg, i) => (
      <View key={i} style={{ position: 'absolute', width: 3, height: 20, borderRadius: 2, backgroundColor: color, opacity: 0.45, transform: [{ rotate: `${deg}deg` }] }} />
    ))}
  </View>
);

// ─── Font size slider ─────────────────────────────────────────────────────────
const getLabel = v => v < 0.2 ? 'Small' : v < 0.4 ? 'Medium' : v < 0.6 ? 'Standard' : v < 0.8 ? 'Large' : 'X-Large';

const FontSizeSlider = ({ value, onChange }) => {
  const trackW = useRef(0);
  const valRef = useRef(value);
  valRef.current = value;
  const startVal = useRef(value);

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { startVal.current = valRef.current; },
    onPanResponderMove: (_, gs) => {
      if (trackW.current > 0) onChange(Math.max(0, Math.min(1, startVal.current + gs.dx / trackW.current)));
    },
  })).current;

  const fill = value * (trackW.current || 200);
  const thumbL = Math.max(0, Math.min((trackW.current || 200) - 18, fill - 9));

  return (
    <View style={s.sliderCard}>
      <Text style={[s.sliderLbl, gilroy('600')]}>{getLabel(value)}</Text>
      <View style={s.sliderRow}>
        <Text style={[s.sliderSm, gilroy('400')]}>A</Text>
        <View style={s.sliderTrackWrap}
          onLayout={e => { trackW.current = e.nativeEvent.layout.width; }}
          {...pan.panHandlers}>
          <View style={s.sliderTrack}>
            <View style={[s.sliderFill, { width: fill }]} />
          </View>
          <View style={[s.sliderThumb, { left: thumbL }]} />
        </View>
        <Text style={[s.sliderLg, gilroy('bold')]}>A</Text>
      </View>
    </View>
  );
};

// ─── Radio button ──────────────────────────────────────────────────────────────
const Radio = ({ on }) => (
  <View style={[ic.radioOuter, on && ic.radioOuterOn]}>
    {on && <View style={ic.radioInner} />}
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────────────────
const THEMES = [
  { key: 'Light',  Icon: SunIcon,     desc: 'Classic clean look' },
  { key: 'Dark',   Icon: MoonIcon,    desc: 'Easier on the eyes' },
  { key: 'System', Icon: MonitorIcon, desc: 'Follow device settings' },
];

const ICON_STYLES = [
  { key: 'Outline', render: c => <Grid2x2 color={c} /> },
  { key: 'Filled',  render: c => <Grid2x2 color={c} filled /> },
  { key: 'Bold',    render: c => <Grid2x2 color={c} thick /> },
];

const COLORS = ['#2196F3', '#9C27B0', '#388E3C', '#E91E63', '#FFA000'];

const TABS = [
  { key: 'Home',     label: 'Home',     Icon: HomeTabIcon },
  { key: 'Devices',  label: 'Devices',  Icon: DevicesTabIcon },
  { key: 'Activity', label: 'Activity', Icon: ActivityTabIcon },
  { key: 'Settings', label: 'Settings', Icon: SettingsTabIcon },
];

export default function AppearanceScreen({ navigation }) {
  const [theme,       setTheme]       = useState('Light');
  const [fontSize,    setFontSize]    = useState(0.4);
  const [iconStyle,   setIconStyle]   = useState('Outline');
  const [accentColor, setAccentColor] = useState('#2196F3');
  const [activeTab,   setActiveTab]   = useState('Settings');

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.hBtn} onPress={() => navigation?.goBack?.()} accessibilityLabel="Go back">
          <BackArrow />
        </TouchableOpacity>
        <Text style={[s.hTitle, gilroy('bold')]}>Appearance</Text>
        <View style={s.hBtn} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* THEME MODE */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>THEME MODE</Text>
        <View style={s.group}>
          {THEMES.map(({ key, Icon, desc }) => {
            const sel = theme === key;
            return (
              <TouchableOpacity key={key} style={[s.themeRow, sel && s.themeRowSel]}
                onPress={() => setTheme(key)} activeOpacity={0.8} accessibilityLabel={`Theme ${key}`}>
                <View style={[s.themeIconBox, sel && s.themeIconBoxSel]}>
                  <Icon color={sel ? '#1565C0' : '#607D8B'} />
                </View>
                <View style={s.themeText}>
                  <Text style={[s.themeTitle, gilroy('600'), sel && { color: '#1565C0' }]}>{key}</Text>
                  <Text style={[s.themeDesc, gilroy('400')]}>{desc}</Text>
                </View>
                <Radio on={sel} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FONT SIZE */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>FONT SIZE</Text>
        <FontSizeSlider value={fontSize} onChange={setFontSize} />

        {/* ICON STYLE */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>ICON STYLE</Text>
        <View style={s.iconRow}>
          {ICON_STYLES.map(({ key, render }) => {
            const sel = iconStyle === key;
            const color = sel ? '#1565C0' : '#9E9E9E';
            return (
              <TouchableOpacity key={key} style={[s.iconCard, sel && s.iconCardSel]}
                onPress={() => setIconStyle(key)} activeOpacity={0.8} accessibilityLabel={`Icon style ${key}`}>
                {render(color)}
                <Text style={[s.iconCardLbl, gilroy('500'), { color }]}>{key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ACCENT COLOR */}
        <Text style={[s.sectionLbl, gilroy('bold')]}>ACCENT COLOR</Text>
        <View style={s.colorRow}>
          {COLORS.map(c => {
            const sel = accentColor === c;
            return (
              <TouchableOpacity key={c}
                style={[s.swatchWrap, sel && { borderColor: c, borderWidth: 2.5 }]}
                onPress={() => setAccentColor(c)} activeOpacity={0.85} accessibilityLabel={`Color ${c}`}>
                <View style={[s.swatch, { backgroundColor: c }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={s.tabBar}>
        {TABS.map(({ key, label, Icon }) => {
          const active = activeTab === key;
          const c = active ? '#2196F3' : '#9E9E9E';
          return (
            <TouchableOpacity key={key} style={s.tabItem} onPress={() => setActiveTab(key)} accessibilityLabel={label}>
              <Icon color={c} />
              <Text style={[s.tabLbl, gilroy('600'), { color: c }]}>{label}</Text>
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
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  hBtn:    { width: 40, height: 36, alignItems: 'center', justifyContent: 'center' },
  hTitle:  { flex: 1, fontSize: 19, color: '#1A1A2E', textAlign: 'center' },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 6 },

  sectionLbl: { fontSize: 11, color: '#9E9E9E', letterSpacing: 0.8, marginBottom: 12, marginTop: 20 },

  // Theme rows
  group:        { gap: 10 },
  themeRow:     { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 14, gap: 12, backgroundColor: '#FFFFFF' },
  themeRowSel:  { borderColor: '#1565C0', backgroundColor: '#F0F7FF' },
  themeIconBox: { width: 42, height: 42, borderRadius: 10, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  themeIconBoxSel: { backgroundColor: '#E3F0FF' },
  themeText:    { flex: 1 },
  themeTitle:   { fontSize: 15, color: '#1A1A2E', marginBottom: 2 },
  themeDesc:    { fontSize: 12, color: '#9E9E9E' },

  // Slider
  sliderCard:     { borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 14, padding: 16, backgroundColor: '#FAFAFA' },
  sliderLbl:      { fontSize: 14, color: '#1A1A2E', textAlign: 'center', marginBottom: 12 },
  sliderRow:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sliderSm:       { fontSize: 13, color: '#BDBDBD', width: 16, textAlign: 'center' },
  sliderLg:       { fontSize: 22, color: '#1A1A2E', width: 24, textAlign: 'center' },
  sliderTrackWrap:{ flex: 1, height: 28, justifyContent: 'center' },
  sliderTrack:    { height: 4, borderRadius: 2, backgroundColor: '#EEEEEE', overflow: 'visible' },
  sliderFill:     { height: 4, borderRadius: 2, backgroundColor: '#1565C0' },
  sliderThumb:    { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', borderWidth: 2.5, borderColor: '#1565C0', top: -7, ...Platform.select({ android: { elevation: 3 } }) },

  // Icon style
  iconRow:      { flexDirection: 'row', gap: 10 },
  iconCard:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 14, backgroundColor: '#FFFFFF' },
  iconCardSel:  { borderColor: '#1565C0', backgroundColor: '#F0F7FF' },
  iconCardLbl:  { fontSize: 12 },

  // Color swatches
  colorRow:    { flexDirection: 'row', gap: 12 },
  swatchWrap:  { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 0, borderColor: 'transparent', padding: 3 },
  swatch:      { width: 36, height: 36, borderRadius: 18 },

  // Bottom tab bar
  tabBar:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEEEEE', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingBottom: Platform.OS === 'android' ? 8 : 12 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabLbl:  { fontSize: 10, letterSpacing: 0.2 },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const ic = StyleSheet.create({
  arrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  arrowStem: { position: 'absolute', width: 16, height: 2, borderRadius: 1, backgroundColor: '#1A1A2E', left: 0, top: 6 },
  arrowHead: { position: 'absolute', width: 0, height: 0, borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 8, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#1A1A2E', left: 0, top: 2 },

  radioOuter:   { width: 22, height: 22, borderRadius: 11, borderWidth: 1.8, borderColor: '#BDBDBD', alignItems: 'center', justifyContent: 'center' },
  radioOuterOn: { borderColor: '#1565C0', borderWidth: 2 },
  radioInner:   { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1565C0' },
});
