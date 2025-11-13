import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  SafeAreaView,
  Switch,
  BackHandler,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomButton from '../components/CustomButton';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import {RootStackParamList} from '../navigation/types';
import {
  checkBiometricAvailability,
  isBiometricsEnabled,
  enableBiometrics,
  disableBiometrics,
  getBiometryTypeName,
  authenticateWithBiometrics,
} from '../utils/biometrics';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user, logout, biometricsAvailable} = useAuth();
  const {theme} = useTheme();
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometryType, setBiometryType] = useState<string>('');

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  // Prevent hardware back button from going back to login screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent default back behavior on Home screen
        // Return true to indicate we've handled the back button
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  const checkBiometricStatus = async () => {
    const enabled = await isBiometricsEnabled();
    const {biometryType: type} = await checkBiometricAvailability();
    setBiometricsEnabled(enabled);
    if (type) {
      setBiometryType(getBiometryTypeName(type));
    }
  };

  const toggleBiometrics = async (value: boolean) => {
    if (value) {
      // Enabling biometrics - require authentication first
      const authenticated = await authenticateWithBiometrics(
        `Enable ${biometryType} for quick sign in`,
      );

      if (authenticated) {
        await enableBiometrics();
        setBiometricsEnabled(true);
        Alert.alert(
          'Success',
          `${biometryType} has been enabled!\n\nYou can now sign in quickly using your ${biometryType.toLowerCase()}.`,
        );
      } else {
        Alert.alert(
          'Authentication Failed',
          `${biometryType} authentication failed. Please try again.`,
        );
      }
    } else {
      // Disabling biometrics
      Alert.alert(
        'Disable Biometrics',
        `Are you sure you want to disable ${biometryType}?\n\nYou'll need to use your email and password to sign in.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await disableBiometrics();
              setBiometricsEnabled(false);
              Alert.alert(
                'Disabled',
                `${biometryType} has been disabled.\n\nYou can now only sign in with your email and password.`,
              );
            },
          },
        ],
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.colors.textSecondary}]}>
            No user data available
          </Text>
          <CustomButton
            title="Go to Login"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text
            style={[styles.welcomeText, {color: theme.colors.textSecondary}]}>
            Welcome!
          </Text>
          <Text style={[styles.nameText, {color: theme.colors.text}]}>
            {user.firstName} {user.lastName}
          </Text>
        </View>

        <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
          <Text
            style={[
              styles.cardTitle,
              {
                color: theme.colors.text,
                borderBottomColor: theme.colors.border,
              },
            ]}>
            Profile Information
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.label, {color: theme.colors.textSecondary}]}>
              Email:
            </Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>
              {user.email}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, {color: theme.colors.textSecondary}]}>
              Name:
            </Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>
              {user.firstName} {user.lastName}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.label, {color: theme.colors.textSecondary}]}>
              Phone:
            </Text>
            <Text style={[styles.value, {color: theme.colors.text}]}>
              {user.phoneNumber}
            </Text>
          </View>
        </View>

        {biometricsAvailable && (
          <View style={[styles.card, {backgroundColor: theme.colors.card}]}>
            <Text
              style={[
                styles.cardTitle,
                {
                  color: theme.colors.text,
                  borderBottomColor: theme.colors.border,
                },
              ]}>
              Security Settings
            </Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, {color: theme.colors.text}]}>
                  {biometryType}
                </Text>
                <Text
                  style={[
                    styles.settingDescription,
                    {color: theme.colors.textSecondary},
                  ]}>
                  {biometricsEnabled
                    ? `Sign in quickly using ${biometryType}`
                    : `Enable ${biometryType} for quick sign in`}
                </Text>
              </View>
              <Switch
                value={biometricsEnabled}
                onValueChange={toggleBiometrics}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <CustomButton
            testID="logout-button"
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 8,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
});

export default HomeScreen;
