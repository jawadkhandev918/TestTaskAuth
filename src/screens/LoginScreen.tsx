import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import {loginValidationSchema} from '../utils/validation';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {RootStackParamList} from '../navigation/types';
import {
  isBiometricsEnabled,
  checkBiometricAvailability,
} from '../utils/biometrics';
import {getRemainingLockTime} from '../utils/secureStorage';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const {
    login,
    loginWithBiometrics,
    isLocked,
    loginAttempts,
    recheckLockStatus,
  } = useAuth();
  const {theme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  // Countdown timer for locked account
  useEffect(() => {
    if (isLocked) {
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked]);

  const updateRemainingTime = async () => {
    const remaining = await getRemainingLockTime();
    setRemainingSeconds(remaining);

    // If time is up, recheck lock status to unlock the account
    if (remaining === 0 && isLocked) {
      await recheckLockStatus();
    }
  };

  const checkBiometricStatus = async () => {
    const enabled = await isBiometricsEnabled();
    const {available} = await checkBiometricAvailability();
    setBiometricsEnabled(enabled && available);
  };

  const handleBiometricLogin = async () => {
    try {
      setLoading(true);
      const success = await loginWithBiometrics();

      if (success) {
        navigation.navigate('Home');
      } else {
        Alert.alert(
          'Authentication Failed',
          'Biometric authentication failed. Please try again or use your password.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during biometric login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: {email: string; password: string}) => {
    try {
      setLoading(true);

      if (isLocked) {
        Alert.alert(
          'Account Locked',
          'Your account has been locked due to multiple failed login attempts. Please try again in 1 minute.',
        );
        return;
      }

      const success = await login(values.email, values.password);

      if (success) {
        navigation.navigate('Home');
      } else {
        const remainingAttempts = 5 - loginAttempts - 1;
        if (remainingAttempts > 0) {
          Alert.alert(
            'Login Failed',
            `Invalid email or password. ${remainingAttempts} attempt(s) remaining before account lockout.`,
          );
        } else {
          Alert.alert(
            'Account Locked',
            'Your account has been locked due to multiple failed login attempts. Please try again in 1 minute.',
          );
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLocked) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.lockedContainer}>
          <Text style={styles.lockedIcon}>🔒</Text>
          <Text style={[styles.lockedTitle, {color: theme.colors.text}]}>
            Account Locked
          </Text>
          <Text
            style={[styles.lockedText, {color: theme.colors.textSecondary}]}>
            Your account has been temporarily locked due to multiple failed
            login attempts.
          </Text>

          <View
            style={[
              styles.timerContainer,
              {backgroundColor: theme.colors.card},
            ]}>
            <Text
              style={[styles.timerLabel, {color: theme.colors.textSecondary}]}>
              Time remaining:
            </Text>
            <Text style={[styles.timerText, {color: theme.colors.primary}]}>
              {formatTime(remainingSeconds)}
            </Text>
          </View>

          <Text
            style={[styles.lockedText, {color: theme.colors.textSecondary}]}>
            Please wait until the timer expires to try again.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={loginValidationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}>
        {({
          handleChange,
          handleBlur,
          handleSubmit: formikSubmit,
          values,
          errors,
          touched,
          isValid,
        }) => (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={[styles.title, {color: theme.colors.text}]}>
                Welcome Back
              </Text>
              <Text
                style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
                Sign in to your account
              </Text>
            </View>

            {biometricsEnabled && (
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={loading}
                activeOpacity={0.8}>
                <Image
                  source={require('../assets/images/thumb.png')}
                  style={styles.thumbImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {loginAttempts > 0 && (
              <View
                style={[
                  styles.warningContainer,
                  {
                    backgroundColor: theme.colors.warning + '20',
                    borderLeftColor: theme.colors.warning,
                  },
                ]}>
                <Text style={[styles.warningText, {color: theme.colors.text}]}>
                  ⚠️ {loginAttempts} failed attempt(s). Account will be locked
                  after 5 attempts.
                </Text>
              </View>
            )}

            <CustomInput
              testID="login-email-input"
              label="Email Address"
              placeholder="enter a email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
              touched={touched.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <CustomInput
              testID="login-password-input"
              label="Password"
              placeholder="enter a password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={errors.password}
              touched={touched.password}
              secureTextEntry
              autoComplete="password"
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                testID="login-submit-button"
                title="Sign In"
                onPress={formikSubmit}
                disabled={!isValid || loading}
                loading={loading}
                style={styles.submitButton}
              />

              <View style={styles.linksContainer}>
                <Text
                  style={[styles.linkText, {color: theme.colors.primary}]}
                  onPress={() => navigation.navigate('ResetPassword')}>
                  Forgot password?
                </Text>

                <CustomButton
                  testID="login-register-link"
                  title="Don't have an account? Register"
                  onPress={() => navigation.navigate('Registration')}
                  variant="secondary"
                  style={styles.linkButton}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  biometricButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  thumbImage: {
    width: 80,
    height: 80,
  },
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  warningText: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
  linksContainer: {
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  linkButton: {
    marginTop: 8,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  lockedIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  lockedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  timerContainer: {
    marginVertical: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  timerLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
});

export default LoginScreen;
