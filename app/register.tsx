import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogoHeader } from '@/components/auth/logo-header';
import { AuthInput } from '@/components/auth/input';
import { AuthButton } from '@/components/auth/button';
import { AUTH_COLORS, GENDER_OPTIONS } from '@/constants/auth';
import { useToast } from '@/hooks/use-toast';
import { sanitizeErrorMessage } from '@/utils/errorHandler';

export default function RegisterScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSuccess, showError, showWarning, showInfo, ToastComponent } = useToast();
  const [name, setName] = useState<string>('Curtis Weaver');
  const [email, setEmail] = useState<string>('curtis.weaver@example.com');
  const [mobile, setMobile] = useState<string>('(209) 555-0104');
  const [dateOfBirth, setDateOfBirth] = useState<string>('August 14, 2023');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (): Promise<void> => {
    // Validation
    if (!name.trim()) {
      showWarning('Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showWarning('Please enter a valid email address');
      return;
    }
    if (!mobile.trim()) {
      showWarning('Please enter your mobile number');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      showSuccess('Registration successful!');
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);
    }, 1000);
  };

  const handleDatePress = (): void => {
    showInfo('Date picker will be implemented soon');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar barStyle="dark-content" backgroundColor={AUTH_COLORS.BACKGROUND} />
      {ToastComponent}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <LogoHeader />

        <View style={styles.content}>
          <Text style={styles.title}>Register Now!</Text>
          <Text style={styles.subtitle}>Enter your information below</Text>

          <AuthInput
            label="Name"
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />

          <AuthInput
            label="Email Address"
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AuthInput
            label="Mobile Number"
            placeholder="Enter Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />

          <AuthInput
            label="Date of Birth"
            placeholder="Select Date"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            onPress={handleDatePress}
            editable={false}
            rightIcon="calendar-outline"
          />

          <View style={styles.genderContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderOptions}>
              {GENDER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.genderOption,
                    gender === option.value && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(option.value)}>
                  <View
                    style={[
                      styles.radioButton,
                      gender === option.value && styles.radioButtonSelected,
                    ]}>
                    {gender === option.value && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text
                    style={[
                      styles.genderText,
                      gender === option.value && styles.genderTextSelected,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <AuthButton title="Register" onPress={handleRegister} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a member? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AUTH_COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: AUTH_COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: AUTH_COLORS.TEXT_SECONDARY,
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AUTH_COLORS.TEXT_PRIMARY,
    marginBottom: 12,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: AUTH_COLORS.INPUT_BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AUTH_COLORS.INPUT_BORDER,
  },
  genderOptionSelected: {
    borderColor: AUTH_COLORS.PRIMARY,
    backgroundColor: `${AUTH_COLORS.PRIMARY}10`,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AUTH_COLORS.INPUT_BORDER,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: AUTH_COLORS.PRIMARY,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: AUTH_COLORS.PRIMARY,
  },
  genderText: {
    fontSize: 16,
    color: AUTH_COLORS.TEXT_PRIMARY,
  },
  genderTextSelected: {
    color: AUTH_COLORS.PRIMARY,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: AUTH_COLORS.TEXT_SECONDARY,
  },
  footerLink: {
    fontSize: 14,
    color: AUTH_COLORS.PRIMARY,
    fontWeight: '600',
  },
});
