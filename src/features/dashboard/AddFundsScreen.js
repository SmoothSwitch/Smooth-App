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
import { LinearGradient } from 'expo-linear-gradient';

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

// ─── Icon primitives (pure RN) ────────────────────────────────────────────────

/** ← back arrow */
const BackArrow = () => (
  <View style={ic.arrowWrap}>
    <View style={ic.arrowStem} />
    <View style={ic.arrowHead} />
  </View>
);

/** ⋮ three-dot menu */
const DotsMenu = () => (
  <View style={ic.dotsWrap}>
    {[0, 1, 2].map((i) => (
      <View key={i} style={ic.dot} />
    ))}
  </View>
);

/** Wallet icon (white outline, for gradient card) */
const WalletIconWhite = () => (
  <View style={ic.wCardOuter}>
    <View style={ic.wCardStripe} />
    <View style={ic.wCardChip} />
  </View>
);

/** Generic card logo placeholder (light grey) */
const CardLogoVisa = () => (
  <View style={ic.cardLogoBox}>
    <View style={ic.visaBar1} />
    <View style={ic.visaBar2} />
  </View>
);

/** Mastercard logo (two overlapping circles) */
const CardLogoMC = () => (
  <View style={ic.mcWrap}>
    <View style={[ic.mcCircle, { backgroundColor: '#EB001B', left: 0 }]} />
    <View style={[ic.mcCircle, { backgroundColor: '#F79E1B', right: 0 }]} />
  </View>
);

/** Filled checkbox (blue ✓) */
const CheckboxFilled = () => (
  <View style={ic.cbFilled}>
    <View style={ic.checkStem} />
    <View style={ic.checkTick} />
  </View>
);

/** Empty checkbox */
const CheckboxEmpty = () => <View style={ic.cbEmpty} />;

/** Credit card icon (blue square with stripe) */
const CreditCardIconBlue = () => (
  <View style={ic.methodIconBox}>
    <View style={ic.methodCard}>
      <View style={ic.methodStripe} />
    </View>
  </View>
);

/** Bank/building icon (green) */
const BankIconGreen = () => (
  <View style={ic.methodIconBoxGreen}>
    <View style={ic.bankBase} />
    <View style={ic.bankRoof} />
    <View style={ic.bankColumns}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={ic.bankCol} />
      ))}
    </View>
  </View>
);

/** › chevron right */
const ChevronRight = () => (
  <View style={ic.chevWrap}>
    <View style={ic.chevTop} />
    <View style={ic.chevBot} />
  </View>
);

/** + plus icon (white) */
const PlusWhite = () => (
  <View style={ic.plusWrap}>
    <View style={ic.plusH} />
    <View style={ic.plusV} />
  </View>
);

/** Apple logo (simple  shape) */
const AppleMark = () => (
  <Text style={ic.appleText}></Text>
);

/** Google "Goo" coloured text mark */
const GoogleMark = () => (
  <Text style={ic.googleText}>
    <Text style={{ color: '#4285F4' }}>G</Text>
    <Text style={{ color: '#EA4335' }}>o</Text>
    <Text style={{ color: '#FBBC05' }}>o</Text>
    <Text style={{ color: '#34A853' }}>g</Text>
  </Text>
);

// ─── Saved card data ──────────────────────────────────────────────────────────
const SAVED_CARDS = [
  { id: '1', last4: '4242', expiry: '12/26', isDefault: true,  logo: 'visa' },
  { id: '2', last4: '8888', expiry: '09/25', isDefault: false, logo: 'mc'   },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AddFundsScreen({ navigation }) {
  const [selectedCard, setSelectedCard] = useState('1');

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

        <Text style={[s.headerTitle, gilroy('bold')]}>Wallet</Text>

        <TouchableOpacity style={s.headerBtn} accessibilityLabel="More options">
          <DotsMenu />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Gradient Balance Card ────────────────────────────────────────── */}
        <LinearGradient
          colors={['#1565C0', '#00897B', '#43A047']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.gradientCard}
        >
          {/* Top label */}
          <Text style={[s.gradientLabel, gilroy('500')]}>Total Balance</Text>

          {/* Amount */}
          <Text style={[s.gradientAmount, gilroy('bold')]}>$12,450.00</Text>

          {/* Bottom row */}
          <View style={s.gradientBottom}>
            {/* SmoothSwitch Pay pill */}
            <View style={s.smoothPill}>
              <Text style={[s.smoothPillText, gilroy('600')]}>SmoothSwitch Pay</Text>
            </View>

            {/* Wallet icon */}
            <WalletIconWhite />
          </View>
        </LinearGradient>

        {/* ── SAVED CARDS ─────────────────────────────────────────────────── */}
        <Text style={[s.sectionTitle, gilroy('bold')]}>Saved Cards</Text>

        {SAVED_CARDS.map((card) => {
          const isSelected = selectedCard === card.id;
          return (
            <TouchableOpacity
              key={card.id}
              style={s.cardRow}
              onPress={() => setSelectedCard(card.id)}
              accessibilityLabel={`Select card ending ${card.last4}`}
            >
              {/* Card logo */}
              <View style={s.cardLogoWrap}>
                {card.logo === 'visa' ? <CardLogoVisa /> : <CardLogoMC />}
              </View>

              {/* Card details */}
              <View style={s.cardInfo}>
                <Text style={[s.cardNumber, gilroy('600')]}>
                  {'•••• •••• •••• '}
                  {card.last4}
                </Text>
                <View style={s.cardMeta}>
                  <Text style={[s.cardExpiry, gilroy('400')]}>Expires {card.expiry}</Text>
                  {card.isDefault && (
                    <>
                      <View style={s.metaDot} />
                      <Text style={[s.cardDefault, gilroy('500')]}>Default</Text>
                    </>
                  )}
                </View>
              </View>

              {/* Checkbox */}
              {isSelected ? <CheckboxFilled /> : <CheckboxEmpty />}
            </TouchableOpacity>
          );
        })}

        {/* ── ADD NEW METHOD ───────────────────────────────────────────────── */}
        <Text style={[s.sectionTitle, gilroy('bold')]}>Add New Method</Text>

        {/* Credit / Debit card row */}
        <TouchableOpacity
          style={s.methodRow}
          accessibilityLabel="Add credit or debit card"
        >
          <CreditCardIconBlue />
          <View style={s.methodInfo}>
            <Text style={[s.methodTitle, gilroy('600')]}>Credit or Debit Card</Text>
            <Text style={[s.methodSub, gilroy('400')]}>Visa, Mastercard, AMEX</Text>
          </View>
          <ChevronRight />
        </TouchableOpacity>

        {/* Bank Transfer row */}
        <TouchableOpacity
          style={[s.methodRow, { marginBottom: 12 }]}
          accessibilityLabel="Add bank transfer"
        >
          <BankIconGreen />
          <View style={s.methodInfo}>
            <Text style={[s.methodTitle, gilroy('600')]}>Bank Transfer</Text>
            <Text style={[s.methodSub, gilroy('400')]}>Direct link to your bank</Text>
          </View>
          <ChevronRight />
        </TouchableOpacity>

        {/* Apple Pay / Google Pay half-width buttons */}
        <View style={s.payRow}>
          <TouchableOpacity style={s.payHalf} accessibilityLabel="Apple Pay">
            <AppleMark />
            <Text style={[s.payHalfText, gilroy('600')]}> Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.payHalf} accessibilityLabel="Google Pay">
            <GoogleMark />
            <Text style={[s.payHalfText, gilroy('600')]}> Pay</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Confirm Method button ────────────────────────────────────────── */}
      <View style={s.confirmWrap}>
        <TouchableOpacity
          style={s.confirmBtn}
          activeOpacity={0.85}
          accessibilityLabel="Confirm payment method"
        >
          <PlusWhite />
          <Text style={[s.confirmText, gilroy('bold')]}>Confirm Method</Text>
        </TouchableOpacity>
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 19,
    color: '#1A1A2E',
    marginLeft: 4,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 4 },

  // Gradient card
  gradientCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
    minHeight: 160,
    justifyContent: 'space-between',
    ...Platform.select({ android: { elevation: 4 } }),
  },
  gradientLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 6,
  },
  gradientAmount: {
    fontSize: 34,
    color: '#FFFFFF',
  },
  gradientBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  smoothPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  smoothPillText: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    color: '#1A1A2E',
    marginBottom: 14,
  },

  // Saved card rows
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardLogoWrap: {
    width: 52,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    ...Platform.select({ android: { elevation: 1 } }),
  },
  cardInfo: { flex: 1 },
  cardNumber: { fontSize: 14, color: '#1A1A2E', marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center' },
  cardExpiry: { fontSize: 12, color: '#9E9E9E' },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#BDBDBD',
    marginHorizontal: 6,
  },
  cardDefault: { fontSize: 12, color: '#424242' },

  // Method rows
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  methodInfo: { flex: 1, marginLeft: 14 },
  methodTitle: { fontSize: 14, color: '#1A1A2E', marginBottom: 3 },
  methodSub: { fontSize: 12, color: '#9E9E9E' },

  // Pay buttons
  payRow: { flexDirection: 'row', gap: 12 },
  payHalf: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  payHalfText: { fontSize: 15, color: '#1A1A2E' },

  // Confirm button
  confirmWrap: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F4F4F4',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    ...Platform.select({ android: { elevation: 4 } }),
  },
  confirmText: { fontSize: 17, color: '#FFFFFF' },
});

// ─── Icon styles ──────────────────────────────────────────────────────────────
const ic = StyleSheet.create({
  // Back arrow
  arrowWrap: { width: 20, height: 14, justifyContent: 'center' },
  arrowStem: {
    position: 'absolute',
    width: 16, height: 2, borderRadius: 1,
    backgroundColor: '#1A1A2E', left: 0, top: 6,
  },
  arrowHead: {
    position: 'absolute',
    width: 0, height: 0,
    borderTopWidth: 5, borderBottomWidth: 5, borderRightWidth: 8,
    borderTopColor: 'transparent', borderBottomColor: 'transparent',
    borderRightColor: '#1A1A2E',
    left: 0, top: 2,
  },

  // Three dots
  dotsWrap: { gap: 4, alignItems: 'center' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#424242' },

  // Wallet icon (white, on gradient card)
  wCardOuter: {
    width: 34, height: 26,
    borderRadius: 5, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)',
    overflow: 'hidden', justifyContent: 'flex-start',
  },
  wCardStripe: {
    height: 6, marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  wCardChip: {
    position: 'absolute', bottom: 5, left: 5,
    width: 8, height: 6, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },

  // Visa card logo (simple lines)
  cardLogoBox: { alignItems: 'center', gap: 3 },
  visaBar1: { width: 30, height: 3, borderRadius: 1.5, backgroundColor: '#1A237E' },
  visaBar2: { width: 20, height: 3, borderRadius: 1.5, backgroundColor: '#E53935' },

  // Mastercard logo
  mcWrap: { width: 38, height: 24, position: 'relative' },
  mcCircle: {
    position: 'absolute',
    width: 22, height: 22, borderRadius: 11,
    top: 1, opacity: 0.9,
  },

  // Checkboxes
  cbFilled: {
    width: 22, height: 22, borderRadius: 5,
    backgroundColor: '#1565C0',
    alignItems: 'center', justifyContent: 'center',
  },
  checkStem: {
    position: 'absolute',
    width: 2, height: 5, borderRadius: 1,
    backgroundColor: '#FFFFFF',
    bottom: 5, left: 6,
    transform: [{ rotate: '45deg' }],
  },
  checkTick: {
    position: 'absolute',
    width: 2, height: 9, borderRadius: 1,
    backgroundColor: '#FFFFFF',
    bottom: 4, right: 6,
    transform: [{ rotate: '-45deg' }],
  },
  cbEmpty: {
    width: 22, height: 22, borderRadius: 5,
    borderWidth: 1.5, borderColor: '#BDBDBD',
    backgroundColor: '#FFFFFF',
  },

  // Method icon boxes
  methodIconBox: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#E3F2FD',
    alignItems: 'center', justifyContent: 'center',
  },
  methodCard: {
    width: 26, height: 18, borderRadius: 4,
    backgroundColor: '#1565C0', overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  methodStripe: {
    height: 5, marginTop: 5,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  methodIconBoxGreen: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  bankBase: {
    width: 26, height: 3, borderRadius: 1,
    backgroundColor: '#2E7D32',
    position: 'absolute', bottom: 12,
  },
  bankRoof: {
    position: 'absolute', top: 10,
    width: 0, height: 0,
    borderLeftWidth: 13, borderRightWidth: 13, borderBottomWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderBottomColor: '#2E7D32',
  },
  bankColumns: {
    flexDirection: 'row', gap: 4,
    position: 'absolute', bottom: 15,
  },
  bankCol: {
    width: 3, height: 8, borderRadius: 1,
    backgroundColor: '#2E7D32',
  },

  // Chevron right
  chevWrap: { width: 10, height: 16, justifyContent: 'center' },
  chevTop: {
    position: 'absolute', top: 3,
    width: 8, height: 2, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '45deg' }],
  },
  chevBot: {
    position: 'absolute', bottom: 3,
    width: 8, height: 2, borderRadius: 1,
    backgroundColor: '#BDBDBD',
    transform: [{ rotate: '-45deg' }],
  },

  // Plus (white)
  plusWrap: { width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  plusH: {
    position: 'absolute',
    width: 16, height: 2.5, borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  plusV: {
    position: 'absolute',
    width: 2.5, height: 16, borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },

  // Apple / Google marks
  appleText: { fontSize: 18, color: '#1A1A2E', lineHeight: 22 },
  googleText: { fontSize: 16, fontWeight: '700' },
});
