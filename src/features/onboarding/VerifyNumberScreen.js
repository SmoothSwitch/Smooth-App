import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/logo.svg';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function VerifyNumberScreen() {
  const navigation = useNavigation();

  /* ── OTP state ── */
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef([]);

  const handleChange = useCallback(
    (text, index) => {
      // accept only single digit
      const digit = text.replace(/[^0-9]/g, '').slice(-1);
      setOtp((prev) => {
        const next = [...prev];
        next[index] = digit;
        return next;
      });
      // auto-advance
      if (digit && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [],
  );

  const handleKeyPress = useCallback(
    (e, index) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setOtp((prev) => {
          const next = [...prev];
          next[index - 1] = '';
          return next;
        });
      }
    },
    [otp],
  );

  /* ── Countdown timer ── */
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleResend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    // restart timer
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const formattedTime = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60,
  ).padStart(2, '0')}`;

  /* ── Custom number pad ── */
  const handlePadPress = (val) => {
    if (val === 'back') {
      // find last filled index
      const lastIdx = otp.reduce((acc, v, i) => (v ? i : acc), -1);
      if (lastIdx >= 0) {
        setOtp((prev) => {
          const next = [...prev];
          next[lastIdx] = '';
          return next;
        });
        inputRefs.current[lastIdx]?.focus();
      }
      return;
    }
    // find first empty index
    const emptyIdx = otp.findIndex((v) => !v);
    if (emptyIdx === -1) return;
    setOtp((prev) => {
      const next = [...prev];
      next[emptyIdx] = String(val);
      return next;
    });
    if (emptyIdx < OTP_LENGTH - 1) {
      inputRefs.current[emptyIdx + 1]?.focus();
    }
  };

  const padRows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [null, 0, 'back'],
  ];

  return (
    <ScrollView
      className="flex-1 bg-[#F4F6FB]"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FB" />

      {/* ──────── HEADER ──────── */}
      <View className="flex-row items-center px-5 pt-14 pb-2 gap-3">
        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <Logo width={32} height={32} />
          <Text
            className="text-lg text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            SmoothSwitch
          </Text>
        </View>
      </View>

      {/* ──────── ICON ──────── */}
      <View className="items-center mt-6">
        <View className="w-14 h-14 rounded-2xl bg-[#EBF5FF] items-center justify-center">
          <MaterialCommunityIcons name="message-text-outline" size={28} color="#2196F3" />
        </View>
      </View>

      {/* ──────── TITLE ──────── */}
      <View className="px-5 mt-5">
        <Text
          className="text-2xl text-[#1A1A2E] text-center"
          style={{ fontFamily: 'Gilroy-Heavy' }}
        >
          Verify your number
        </Text>
        <Text
          className="text-center text-[#6B7280] mt-2 text-sm leading-5"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          We've sent a 6-digit code to +234 81* ***{'\n'}**45
        </Text>
      </View>

      {/* ──────── OTP BOXES ──────── */}
      <View className="flex-row justify-center gap-3 px-5 mt-6">
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={(ref) => {
              inputRefs.current[i] = ref;
            }}
            className={`w-12 h-14 border rounded-xl text-center text-xl text-[#1A1A2E] ${
              digit ? 'border-[#2196F3] bg-[#EBF5FF]' : 'border-[#E5E7EB] bg-white'
            }`}
            style={{ fontFamily: 'Gilroy-Bold' }}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            selectTextOnFocus
            // hide software keyboard — we use our custom pad
            showSoftInputOnFocus={false}
          />
        ))}
      </View>

      {/* ──────── COUNTDOWN + RESEND ──────── */}
      <View className="items-center mt-5 gap-2">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text
            className="text-sm text-[#6B7280]"
            style={{ fontFamily: 'Gilroy-Regular' }}
          >
            Resend code in{' '}
            <Text className="text-[#2196F3]" style={{ fontFamily: 'Gilroy-Bold' }}>
              {formattedTime}
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleResend}
          disabled={seconds > 0}
        >
          <Text
            className={`text-sm ${seconds > 0 ? 'text-[#2196F3]/50' : 'text-[#2196F3]'}`}
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>

      {/* ──────── VERIFY BUTTON ──────── */}
      <View className="px-5 mt-6">
        <TouchableOpacity
          activeOpacity={0.85}
          className={`rounded-full py-4 items-center ${
            otp.every((d) => d) ? 'bg-[#2196F3]' : 'bg-[#2196F3]/50'
          }`}
          disabled={!otp.every((d) => d)}
          onPress={() => navigation.navigate('ScanningNetworks')}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Verify
          </Text>
        </TouchableOpacity>
      </View>

      {/* ──────── CUSTOM NUMBER PAD ──────── */}
      <View className="mt-auto px-8 pt-6 pb-8">
        {padRows.map((row, rowIdx) => (
          <View key={rowIdx} className="flex-row justify-between mb-3">
            {row.map((val, colIdx) => {
              if (val === null) {
                return <View key={colIdx} className="w-20 h-14" />;
              }
              return (
                <TouchableOpacity
                  key={colIdx}
                  activeOpacity={0.6}
                  className="w-20 h-14 items-center justify-center rounded-xl"
                  onPress={() => handlePadPress(val)}
                >
                  {val === 'back' ? (
                    <Ionicons name="backspace-outline" size={24} color="#1A1A2E" />
                  ) : (
                    <Text
                      className="text-2xl text-[#1A1A2E]"
                      style={{ fontFamily: 'Gilroy-Medium' }}
                    >
                      {val}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
