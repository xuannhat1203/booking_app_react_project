import { register } from '@/apis/authApi';
import { AuthButton } from '@/components/auth/button';
import { AuthInput } from '@/components/auth/input';
import { LogoHeader } from '@/components/auth/logo-header';
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

export default function RegisterScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showSuccess, showError, showWarning, showInfo, ToastComponent } = useToast();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Mutation để đăng ký
  const registerMutation = useMutation({
    mutationFn: (registerData: {
      username: string;
      email: string;
      password: string;
    }) => register(registerData),
    onSuccess: async (data) => {
      try {
        // Lưu token nếu có
        const token = data?.data?.token || data?.data?.accessToken || data?.token;
        if (token) {
          await AsyncStorage.setItem('accessToken', token);
          setAccessToken(token);
          const refreshToken = data?.data?.refreshToken || data?.refreshToken;
          if (refreshToken) {
            await AsyncStorage.setItem('refreshToken', refreshToken);
          }
        }
        
        // Lưu email để dùng cho forgot password
        await AsyncStorage.setItem('email', email.trim());
        
        showSuccess('Đăng ký thành công!');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
      } catch (storageError) {
        if (__DEV__) {
          console.error('Error saving token:', storageError);
        }
        showError('Không thể lưu thông tin đăng nhập. Vui lòng thử lại.');
      }
    },
    onError: (error: any) => {
      // Debug log (chỉ trong dev mode)
      if (__DEV__) {
        console.log('Register error details:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
          userMessage: error?.userMessage,
        });
      }
      const errorMessage = sanitizeErrorMessage(error);
      showError(errorMessage);
    },
  });

  const handleRegister = (): void => {
    // Validation
    if (!username.trim()) {
      showWarning('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showWarning('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    if (!password.trim() || password.length < 6) {
      showWarning('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Gọi API đăng ký
    registerMutation.mutate({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
    });
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
          <Text style={styles.title}>Đăng ký ngay!</Text>
          <Text style={styles.subtitle}>Nhập thông tin của bạn bên dưới</Text>

          <AuthInput
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            leftIcon="person-outline"
          />

          <AuthInput
            label="Địa chỉ email"
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            leftIcon="mail-outline"
          />

          <AuthInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <AuthButton
            title="Đăng ký"
            onPress={handleRegister}
            loading={registerMutation.isPending}
            disabled={registerMutation.isPending}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
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
