import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';

const SERVICE_NAME = 'com.testapp.auth';
const USER_DATA_KEY = '@user_data';
const LOGIN_ATTEMPTS_KEY = '@login_attempts';
const LOCK_TIMESTAMP_KEY = '@lock_timestamp';
const LOGGED_OUT_KEY = '@logged_out_flag';

/**
 * Store credentials securely in Keychain/Keystore
 */
export const storeCredentials = async (
  email: string,
  password: string,
): Promise<void> => {
  try {
    await Keychain.setGenericPassword(email, password, {
      service: SERVICE_NAME,
    });
  } catch (error) {
    console.error('Error storing credentials:', error);
    throw new Error('Failed to store credentials securely');
  }
};

/**
 * Retrieve credentials from Keychain/Keystore
 */
export const getCredentials = async (): Promise<{
  username: string;
  password: string;
} | null> => {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: SERVICE_NAME,
    });
    if (credentials) {
      return {
        username: credentials.username,
        password: credentials.password,
      };
    }
    return null;
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return null;
  }
};

/**
 * Clear credentials from Keychain/Keystore
 */
export const clearCredentials = async (): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({service: SERVICE_NAME});
  } catch (error) {
    console.error('Error clearing credentials:', error);
  }
};

/**
 * Store user data in AsyncStorage
 */
export const storeUserData = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user data:', error);
    throw new Error('Failed to store user data');
  }
};

/**
 * Retrieve user data from AsyncStorage
 */
export const getUserData = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clear user data from AsyncStorage
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Store partial registration form data
 */
export const storeRegistrationDraft = async (
  formData: Partial<User>,
): Promise<void> => {
  try {
    await AsyncStorage.setItem('@registration_draft', JSON.stringify(formData));
  } catch (error) {
    console.error('Error storing registration draft:', error);
  }
};

/**
 * Retrieve partial registration form data
 */
export const getRegistrationDraft = async (): Promise<Partial<User> | null> => {
  try {
    const draft = await AsyncStorage.getItem('@registration_draft');
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error('Error retrieving registration draft:', error);
    return null;
  }
};

/**
 * Clear registration draft
 */
export const clearRegistrationDraft = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('@registration_draft');
  } catch (error) {
    console.error('Error clearing registration draft:', error);
  }
};

/**
 * Login attempt tracking
 */
export const getLoginAttempts = async (): Promise<number> => {
  try {
    const attempts = await AsyncStorage.getItem(LOGIN_ATTEMPTS_KEY);
    return attempts ? parseInt(attempts, 10) : 0;
  } catch (error) {
    console.error('Error getting login attempts:', error);
    return 0;
  }
};

export const incrementLoginAttempts = async (): Promise<number> => {
  try {
    const currentAttempts = await getLoginAttempts();
    const newAttempts = currentAttempts + 1;
    await AsyncStorage.setItem(LOGIN_ATTEMPTS_KEY, newAttempts.toString());
    return newAttempts;
  } catch (error) {
    console.error('Error incrementing login attempts:', error);
    return 0;
  }
};

export const resetLoginAttempts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LOGIN_ATTEMPTS_KEY);
  } catch (error) {
    console.error('Error resetting login attempts:', error);
  }
};

export const setAccountLock = async (): Promise<void> => {
  try {
    const lockTimestamp = Date.now().toString();
    await AsyncStorage.setItem(LOCK_TIMESTAMP_KEY, lockTimestamp);
  } catch (error) {
    console.error('Error setting account lock:', error);
  }
};

export const LOCK_DURATION_MS = 1 * 60 * 1000; // 1 minute

export const isAccountLocked = async (): Promise<boolean> => {
  try {
    const lockTimestamp = await AsyncStorage.getItem(LOCK_TIMESTAMP_KEY);
    if (!lockTimestamp) {
      return false;
    }

    const lockedAt = parseInt(lockTimestamp, 10);
    const now = Date.now();

    if (now - lockedAt > LOCK_DURATION_MS) {
      await AsyncStorage.removeItem(LOCK_TIMESTAMP_KEY);
      await resetLoginAttempts();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking account lock:', error);
    return false;
  }
};

export const getRemainingLockTime = async (): Promise<number> => {
  try {
    const lockTimestamp = await AsyncStorage.getItem(LOCK_TIMESTAMP_KEY);
    if (!lockTimestamp) {
      return 0;
    }

    const lockedAt = parseInt(lockTimestamp, 10);
    const now = Date.now();
    const elapsed = now - lockedAt;
    const remaining = LOCK_DURATION_MS - elapsed;

    return remaining > 0 ? Math.ceil(remaining / 1000) : 0; // Return seconds
  } catch (error) {
    console.error('Error getting remaining lock time:', error);
    return 0;
  }
};

/**
 * Track if user explicitly logged out
 */
export const setLoggedOutFlag = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOGGED_OUT_KEY, 'true');
  } catch (error) {
    console.error('Error setting logged out flag:', error);
  }
};

export const clearLoggedOutFlag = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LOGGED_OUT_KEY);
  } catch (error) {
    console.error('Error clearing logged out flag:', error);
  }
};

export const wasLoggedOut = async (): Promise<boolean> => {
  try {
    const flag = await AsyncStorage.getItem(LOGGED_OUT_KEY);
    return flag === 'true';
  } catch (error) {
    console.error('Error checking logged out flag:', error);
    return false;
  }
};
