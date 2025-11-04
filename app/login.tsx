import { login } from '@/apis/authApi';
import { AuthButton } from '@/components/auth/button';
import { AuthInput } from '@/components/auth/input';
import { LogoHeader } from '@/components/auth/logo-header';
import { SocialButton } from '@/components/auth/social-button';
import { AUTH_COLORS } from '@/constants/auth';
import { useToast } from '@/hooks/use-toast';
import { setAccessToken } from '@/utils/axiosInstance';
import { sanitizeErrorMessage } from '@/utils/errorHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSuccess, showError, ToastComponent } = useToast();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Save username to AsyncStorage when user types (for forgot password flow)
  // This works even if login fails
  React.useEffect(() => {
    const saveUsername = async (): Promise<void> => {
      if (username.trim().length > 0) {
        try {
          // Check if it's an email format
          const isEmail = username.includes('@');
          if (isEmail) {
            await AsyncStorage.setItem('email', username.trim());
          }
          // Also save as username for phone number cases
          await AsyncStorage.setItem('username', username.trim());
        } catch (error) {
          // Silent fail - not critical
        }
      }
    };
    
    // Debounce to avoid too many writes
    const timer = setTimeout(() => {
      saveUsername();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [username]);

  const isFormValid = username.length > 0 && password.length > 0;

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      login(credentials.username, credentials.password),
    onSuccess: async (data) => {
      try {
        const token = data?.data?.token || data?.data?.accessToken || data?.token;
        if (token) {
          await AsyncStorage.setItem('accessToken', token);
          setAccessToken(token);
          const refreshToken = data?.data?.refreshToken || data?.refreshToken;
          if (refreshToken) {
            await AsyncStorage.setItem('refreshToken', refreshToken);
          }
          
          showSuccess('Đăng nhập thành công!');
          await AsyncStorage.setItem("email", username);
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 1000);
        } else {
          showError('Không tìm thấy token. Vui lòng thử lại.');
        }
      } catch (storageError) {
        if (__DEV__) {
          console.error('Error saving token:', storageError);
        }
        showError('Không thể lưu thông tin đăng nhập. Vui lòng thử lại.');
      }
    },
    onError: (error: any) => {
      const errorMessage = sanitizeErrorMessage(error);
      showError(errorMessage);
    },
  });

  const handleLogin = (): void => {
    if (!isFormValid) return;
    loginMutation.mutate({ username, password });
  };

  const handleSocialLogin = (provider: 'google' | 'facebook'): void => {
    if (__DEV__) {
      console.log(`${provider} login`);
    }
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
          <Text style={styles.title}>Let's get you Login!</Text>
          <Text style={styles.subtitle}>Enter your information below</Text>

          <View style={styles.socialButtons}>
            <SocialButton provider="google" onPress={() => handleSocialLogin('google')} />
            <View style={styles.socialButtonSpacer} />
            <SocialButton provider="facebook" onPress={() => handleSocialLogin('facebook')} />
          </View>

          <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Or login with</Text>
            <View style={styles.separatorLine} />
          </View>

          <AuthInput
            label="Username"
            placeholder="Enter Username"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            leftIcon="mail-outline"
          />

          <AuthInput
            label="Password"
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <AuthButton
            title="Login"
            onPress={handleLogin}
            disabled={!isFormValid || loginMutation.isPending}
            loading={loginMutation.isPending}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>Register Now</Text>
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
  socialButtons: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  socialButtonSpacer: {
    width: 12,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: AUTH_COLORS.INPUT_BORDER,
  },
  separatorText: {
    fontSize: 14,
    color: AUTH_COLORS.TEXT_SECONDARY,
    marginHorizontal: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: AUTH_COLORS.PRIMARY,
    fontWeight: '500',
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
