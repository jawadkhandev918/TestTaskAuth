import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import {useTheme} from '../contexts/ThemeContext';
import {RootStackParamList} from '../navigation/types';
import {getUserData, storeCredentials} from '../utils/secureStorage';

type ResetPasswordScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .matches(emailRegex, 'Please enter a valid email address'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      passwordRegex,
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const {theme} = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);

      // Check if email matches registered user
      const userData = await getUserData();

      if (!userData || userData.email !== values.email) {
        Alert.alert(
          'Email Not Found',
          'No account found with this email address. Please check your email or register a new account.',
        );
        return;
      }

      // Update password in secure storage
      await storeCredentials(values.email, values.newPassword);

      Alert.alert(
        'Password Reset Successful',
        'Your password has been updated successfully. You can now sign in with your new password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to reset password. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <Formik
        initialValues={{email: '', newPassword: '', confirmPassword: ''}}
        validationSchema={resetPasswordValidationSchema}
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
                Reset Password
              </Text>
              <Text
                style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
                Enter your email and new password
              </Text>
            </View>

            <CustomInput
              testID="reset-email-input"
              label="Email Address"
              placeholder="enter your email"
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
              testID="reset-new-password-input"
              label="New Password"
              placeholder="enter new password"
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              error={errors.newPassword}
              touched={touched.newPassword}
              secureTextEntry
              autoComplete="password-new"
            />
            <PasswordStrengthIndicator password={values.newPassword} />

            <CustomInput
              testID="reset-confirm-password-input"
              label="Confirm New Password"
              placeholder="confirm new password"
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              secureTextEntry
              autoComplete="password-new"
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                testID="reset-submit-button"
                title="Reset Password"
                onPress={formikSubmit}
                disabled={!isValid || loading}
                loading={loading}
                style={styles.submitButton}
              />

              <CustomButton
                testID="reset-back-to-login"
                title="Back to Sign In"
                onPress={() => navigation.navigate('Login')}
                variant="secondary"
                style={styles.linkButton}
              />
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
  buttonContainer: {
    marginTop: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
  linkButton: {
    marginTop: 8,
  },
});

export default ResetPasswordScreen;

