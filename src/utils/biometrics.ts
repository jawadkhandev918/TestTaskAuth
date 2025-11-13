import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BIOMETRICS_ENABLED_KEY = '@biometrics_enabled';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

type BiometryType = typeof BiometryTypes[keyof typeof BiometryTypes];

export interface BiometricStatus {
  available: boolean;
  biometryType?: BiometryType;
  error?: string;
}

/**
 * Check if biometric authentication is available on the device
 */
export const checkBiometricAvailability =
  async (): Promise<BiometricStatus> => {
    try {
      const {available, biometryType} =
        await rnBiometrics.isSensorAvailable();

      return {
        available,
        biometryType,
      };
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return {
        available: false,
        error: 'Failed to check biometric availability',
      };
    }
  };

/**
 * Prompt user for biometric authentication
 */
export const authenticateWithBiometrics = async (
  promptMessage: string = 'Authenticate to continue',
): Promise<boolean> => {
  try {
    const {success} = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: 'Cancel',
    });

    return success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};

/**
 * Check if user has enabled biometrics for this app
 */
export const isBiometricsEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking biometrics preference:', error);
    return false;
  }
};

/**
 * Enable biometric authentication
 */
export const enableBiometrics = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, 'true');
  } catch (error) {
    console.error('Error enabling biometrics:', error);
    throw new Error('Failed to enable biometrics');
  }
};

/**
 * Disable biometric authentication
 */
export const disableBiometrics = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(BIOMETRICS_ENABLED_KEY);
  } catch (error) {
    console.error('Error disabling biometrics:', error);
    throw new Error('Failed to disable biometrics');
  }
};

/**
 * Get biometry type name for display
 */
export const getBiometryTypeName = (biometryType?: BiometryType): string => {
  switch (biometryType) {
    case BiometryTypes.FaceID:
      return 'Face ID';
    case BiometryTypes.TouchID:
      return 'Touch ID';
    case BiometryTypes.Biometrics:
      return 'Biometrics';
    default:
      return 'Biometric Authentication';
  }
};

