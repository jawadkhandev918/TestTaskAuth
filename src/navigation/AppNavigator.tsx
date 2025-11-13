import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import {useTheme} from '../contexts/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Theme toggle button component (outside of AppNavigator to avoid nested component warning)
const ThemeToggleButton: React.FC = () => {
  const {isDarkMode, toggleTheme} = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={styles.themeButton}
      activeOpacity={0.7}>
      <Text style={styles.themeIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
    </TouchableOpacity>
  );
};

const AppNavigator: React.FC = () => {
  const {isAuthenticated, isLoading} = useAuth();
  const {theme, isDarkMode} = useTheme();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
            color: theme.colors.text,
          },
          headerShadowVisible: !isDarkMode,
          headerRight: ThemeToggleButton,
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Sign In',
            headerShown: true,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
          options={{
            title: 'Create Account',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{
            title: 'Reset Password',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Profile',
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    marginRight: 12,
    padding: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
});

export default AppNavigator;

