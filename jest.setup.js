/* eslint-env jest */
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(),
  resetGenericPassword: jest.fn(),
}));

// Mock react-native-biometrics
jest.mock('react-native-biometrics', () => {
  const BiometryTypes = {
    TouchID: 'TouchID',
    FaceID: 'FaceID',
    Biometrics: 'Biometrics',
  };

  const ReactNativeBiometrics = jest.fn().mockImplementation(() => ({
    isSensorAvailable: jest.fn().mockResolvedValue({
      available: true,
      biometryType: BiometryTypes.TouchID,
    }),
    simplePrompt: jest.fn().mockResolvedValue({success: true}),
  }));

  ReactNativeBiometrics.BiometryTypes = BiometryTypes;

  return {
    __esModule: true,
    default: ReactNativeBiometrics,
    BiometryTypes,
  };
});

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
  };
});

