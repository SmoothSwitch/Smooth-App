import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

/* ────────────── helpers ────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

function validateInput(value) {
  if (!value) return 'empty';
  if (EMAIL_RE.test(value)) return 'valid';
  if (PHONE_RE.test(value.replace(/[\s\-()]/g, ''))) return 'valid';
  return 'invalid';
}

function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '' };
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 10) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 1) return { level: 1, label: 'Weak password security', color: '#EF4444' };
  if (score <= 2) return { level: 2, label: 'Fair password security', color: '#F59E0B' };
  if (score <= 3) return { level: 3, label: 'Good password security', color: '#3B82F6' };
  return { level: 4, label: 'Strong password security', color: '#10B981' };
}

const BAR_COLORS_ACTIVE = ['#10B981', '#10B981', '#10B981', '#10B981'];
const BAR_COLOR_INACTIVE = '#E5E7EB';

/* ────────────── component ────────────── */

export default function CreateAccountScreen() {
  const navigation = useNavigation();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const inputStatus = validateInput(emailOrPhone);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  return (
    <ScrollView
      className="flex-1 bg-white"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ──────── HEADER ──────── */}
      <View className="flex-row items-center px-5 pt-14 pb-2 gap-3">
        <TouchableOpacity activeOpacity={0.6} className="mr-2">
          <Ionicons name="arrow-back" size={24} color="#1A1A2E" />
        </TouchableOpacity>

        <View className="w-9 h-9 rounded-xl bg-[#2196F3] items-center justify-center">
          <MaterialCommunityIcons name="swap-horizontal" size={18} color="#fff" />
        </View>
        <Text
          className="text-xl text-[#2196F3]"
          style={{ fontFamily: 'Gilroy-Bold' }}
        >
          SmoothSwitch
        </Text>
      </View>

      {/* ──────── TITLE ──────── */}
      <View className="px-5 mt-6">
        <Text
          className="text-3xl text-[#1A1A2E] text-center leading-10"
          style={{ fontFamily: 'Gilroy-Heavy' }}
        >
          Create your{'\n'}account
        </Text>
        <Text
          className="text-center text-[#6B7280] mt-2 text-sm leading-5"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Join SmoothSwitch to get started with{'\n'}seamless transitions.
        </Text>
      </View>

      {/* ──────── EMAIL / PHONE FIELD ──────── */}
      <View className="px-5 mt-8">
        <Text
          className="text-sm text-[#1A1A2E] mb-2"
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          Email or Phone
        </Text>

        <View
          className={`flex-row items-center border rounded-xl px-4 py-3 ${
            inputStatus === 'valid'
              ? 'border-[#10B981]'
              : inputStatus === 'invalid'
              ? 'border-[#EF4444]'
              : 'border-[#E5E7EB]'
          }`}
        >
          <TextInput
            className="flex-1 text-base text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Regular' }}
            placeholder="Enter email or phone"
            placeholderTextColor="#9CA3AF"
            value={emailOrPhone}
            onChangeText={setEmailOrPhone}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {inputStatus === 'valid' && (
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
          )}
        </View>

        {inputStatus === 'valid' && (
          <View className="flex-row items-center mt-1.5 gap-1">
            <Ionicons name="checkmark" size={14} color="#10B981" />
            <Text
              className="text-xs text-[#10B981]"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              Valid email address
            </Text>
          </View>
        )}
        {inputStatus === 'invalid' && (
          <Text
            className="text-xs text-[#EF4444] mt-1.5"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Enter a valid email or phone number
          </Text>
        )}
      </View>

      {/* ──────── PASSWORD FIELD ──────── */}
      <View className="px-5 mt-5">
        <Text
          className="text-sm text-[#1A1A2E] mb-2"
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          Password
        </Text>

        <View
          className={`flex-row items-center border rounded-xl px-4 py-3 ${
            strength.level >= 3
              ? 'border-[#10B981]'
              : password
              ? 'border-[#E5E7EB]'
              : 'border-[#E5E7EB]'
          }`}
        >
          <TextInput
            className="flex-1 text-base text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Regular' }}
            placeholder="Create a password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntry}
          />
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setSecureEntry((s) => !s)}
            className="ml-2"
          >
            <Ionicons
              name={secureEntry ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#9CA3AF"
            />
          </TouchableOpacity>
          {strength.level >= 3 && (
            <Ionicons
              name="checkmark-circle"
              size={22}
              color="#10B981"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>

        {/* Strength bars */}
        {password.length > 0 && (
          <>
            <View className="flex-row mt-3 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  className="flex-1 h-1.5 rounded-full"
                  style={{
                    backgroundColor:
                      i <= strength.level
                        ? BAR_COLORS_ACTIVE[strength.level - 1]
                        : BAR_COLOR_INACTIVE,
                  }}
                />
              ))}
            </View>
            <Text
              className="text-xs mt-1.5"
              style={{
                fontFamily: 'Gilroy-Medium',
                color: strength.color,
              }}
            >
              {strength.label}
            </Text>
          </>
        )}
      </View>

      {/* ──────── CREATE ACCOUNT BUTTON ──────── */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-[#2196F3] rounded-xl py-4 items-center shadow-lg shadow-blue-300"
          onPress={() => navigation.navigate('VerifyNumber')}
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: 'Gilroy-Bold' }}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* ──────── DIVIDER ──────── */}
      <View className="flex-row items-center px-5 mt-8">
        <View className="flex-1 h-px bg-[#E5E7EB]" />
        <Text
          className="mx-3 text-xs text-[#9CA3AF] tracking-widest"
          style={{ fontFamily: 'Gilroy-Medium' }}
        >
          OR CONTINUE WITH
        </Text>
        <View className="flex-1 h-px bg-[#E5E7EB]" />
      </View>

      {/* ──────── SOCIAL BUTTONS ──────── */}
      <View className="flex-row px-5 mt-5 gap-4">
        {/* Google */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 flex-row items-center justify-center border border-[#E5E7EB] rounded-xl py-3.5 gap-2"
        >
          <Text className="text-lg" style={{ fontFamily: 'Gilroy-Bold' }}>
            G
          </Text>
          <Text
            className="text-sm text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Google
          </Text>
        </TouchableOpacity>

        {/* Apple */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 flex-row items-center justify-center border border-[#E5E7EB] rounded-xl py-3.5 gap-2"
        >
          <Ionicons name="logo-apple" size={20} color="#1A1A2E" />
          <Text
            className="text-sm text-[#1A1A2E]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Apple
          </Text>
        </TouchableOpacity>
      </View>

      {/* ──────── LOG IN LINK ──────── */}
      <View className="items-center mt-8">
        <Text
          className="text-sm text-[#6B7280]"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          Already have an account?{' '}
          <Text
            className="text-[#2196F3]"
            style={{ fontFamily: 'Gilroy-Bold' }}
            onPress={() => {}}
          >
            Log In
          </Text>
        </Text>
      </View>

      {/* ──────── FOOTER LINKS ──────── */}
      <View className="flex-row justify-center gap-6 mt-auto pt-8 pb-8">
        <TouchableOpacity activeOpacity={0.6}>
          <Text
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Terms of Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <Text
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6}>
          <Text
            className="text-xs text-[#9CA3AF]"
            style={{ fontFamily: 'Gilroy-Medium' }}
          >
            Help Center
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
