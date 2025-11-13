import {
  storeCredentials,
  getCredentials,
  clearCredentials,
  storeUserData,
  getUserData,
  clearUserData,
  getLoginAttempts,
  incrementLoginAttempts,
  resetLoginAttempts,
  isAccountLocked,
} from '../secureStorage';

// Mock the dependencies
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Secure Storage - Credentials', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should store credentials securely', async () => {
    await storeCredentials('test@example.com', 'password123');
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      {service: 'com.testapp.auth'},
    );
  });

  test('should retrieve credentials', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({
      username: 'test@example.com',
      password: 'password123',
    });

    const credentials = await getCredentials();
    expect(credentials).toEqual({
      username: 'test@example.com',
      password: 'password123',
    });
  });

  test('should return null when no credentials exist', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);

    const credentials = await getCredentials();
    expect(credentials).toBeNull();
  });

  test('should clear credentials', async () => {
    await clearCredentials();
    expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
      service: 'com.testapp.auth',
    });
  });
});

describe('Secure Storage - User Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '1234567890',
  };

  test('should store user data', async () => {
    await storeUserData(mockUser);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@user_data',
      JSON.stringify(mockUser),
    );
  });

  test('should retrieve user data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockUser),
    );

    const user = await getUserData();
    expect(user).toEqual(mockUser);
  });

  test('should return null when no user data exists', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const user = await getUserData();
    expect(user).toBeNull();
  });

  test('should clear user data', async () => {
    await clearUserData();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@user_data');
  });
});

describe('Login Attempts Tracking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get login attempts', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('3');

    const attempts = await getLoginAttempts();
    expect(attempts).toBe(3);
  });

  test('should return 0 when no attempts exist', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const attempts = await getLoginAttempts();
    expect(attempts).toBe(0);
  });

  test('should increment login attempts', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('2');

    const newAttempts = await incrementLoginAttempts();
    expect(newAttempts).toBe(3);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@login_attempts',
      '3',
    );
  });

  test('should reset login attempts', async () => {
    await resetLoginAttempts();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@login_attempts');
  });
});

describe('Account Lock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return false when account is not locked', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const locked = await isAccountLocked();
    expect(locked).toBe(false);
  });

  test('should return true when account is locked within duration', async () => {
    const lockTime = Date.now() - 30 * 1000; // 30 seconds ago (within 1 minute)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      lockTime.toString(),
    );

    const locked = await isAccountLocked();
    expect(locked).toBe(true);
  });

  test('should return false when lock duration has expired', async () => {
    const lockTime = Date.now() - 2 * 60 * 1000; // 2 minutes ago (expired)
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      lockTime.toString(),
    );

    const locked = await isAccountLocked();
    expect(locked).toBe(false);
  });
});

