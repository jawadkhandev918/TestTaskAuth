import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {Formik, FormikProps} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import {registrationValidationSchema} from '../utils/validation';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {RegistrationFormValues} from '../types';
import {
  getRegistrationDraft,
  storeRegistrationDraft,
  clearRegistrationDraft,
} from '../utils/secureStorage';
import {RootStackParamList} from '../navigation/types';

type RegistrationScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

// Component to handle auto-save
const AutoSaveFormValues: React.FC<{values: RegistrationFormValues}> = ({
  values,
}) => {
  useEffect(() => {
    const saveDraft = async () => {
      if (
        values.email ||
        values.firstName ||
        values.lastName ||
        values.phoneNumber
      ) {
        await storeRegistrationDraft({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
        });
      }
    };
    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [values]);

  return null;
};

const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const {register} = useAuth();
  const {theme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<RegistrationFormValues>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  // Load saved draft on mount
  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    const draft = await getRegistrationDraft();
    if (draft) {
      setInitialValues({
        email: draft.email || '',
        password: '',
        confirmPassword: '',
        firstName: draft.firstName || '',
        lastName: draft.lastName || '',
        phoneNumber: draft.phoneNumber || '',
      });
    }
  };

  const handleSubmit = async (values: RegistrationFormValues) => {
    try {
      setLoading(true);

      const userData = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      };

      await register(userData, values.password);
      await clearRegistrationDraft();

      Alert.alert('Success', 'Your account has been created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const themedStyles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        title: {
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 8,
          color: theme.colors.text,
        },
        subtitle: {
          fontSize: 16,
          color: theme.colors.textSecondary,
        },
        linkText: {
          fontSize: 14,
          textAlign: 'right',
          marginTop: 12,
          color: theme.colors.primary,
        },
      }),
    [theme],
  );

  return (
    <KeyboardAvoidingView
      style={themedStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <Formik
        initialValues={initialValues}
        validationSchema={registrationValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
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
        }: FormikProps<RegistrationFormValues>) => (
          <>
            <AutoSaveFormValues values={values} />
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={themedStyles.title}>Account Setup</Text>
                <Text style={themedStyles.subtitle}>
                  Create your account to get started
                </Text>
              </View>

              <CustomInput
                testID="registration-email-input"
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
                testID="registration-password-input"
                label="Password"
                placeholder="enter a password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={errors.password}
                touched={touched.password}
                secureTextEntry
                autoComplete="password-new"
              />
              <PasswordStrengthIndicator password={values.password} />

              <CustomInput
                testID="registration-confirm-password-input"
                label="Confirm Password"
                placeholder="confirm your password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                secureTextEntry
                autoComplete="password-new"
              />

              <CustomInput
                testID="registration-firstname-input"
                label="First Name"
                placeholder="enter your first name"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={errors.firstName}
                touched={touched.firstName}
                autoComplete="name-given"
              />

              <CustomInput
                testID="registration-lastname-input"
                label="Last Name"
                placeholder="enter your last name"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={errors.lastName}
                touched={touched.lastName}
                autoComplete="name-family"
              />

              <CustomInput
                testID="registration-phone-input"
                label="Phone Number"
                placeholder="enter a phone number"
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  testID="registration-submit-button"
                  title="Create Account"
                  onPress={formikSubmit}
                  disabled={!isValid || loading}
                  loading={loading}
                  style={styles.submitButton}
                />

                <Text
                  style={themedStyles.linkText}
                  onPress={() => navigation.navigate('Login')}>
                  Already registered? Sign in here
                </Text>
              </View>
            </ScrollView>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  submitButton: {
    marginBottom: 12,
  },
});

export default RegistrationScreen;
