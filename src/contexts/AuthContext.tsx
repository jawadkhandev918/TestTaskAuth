import React, {createContext, useState, useEffect, useContext} from 'react';
import {AuthContextType, User} from '../types';
import {
  storeCredentials,
  getCredentials,
  storeUserData,
  getUserData,
  getLoginAttempts,
  incrementLoginAttempts,
  resetLoginAttempts,
  isAccountLocked,
  setAccountLock,
  setLoggedOutFlag,
  clearLoggedOutFlag,
  wasLoggedOut,
} from '../utils/secureStorage';
import {
  checkBiometricAvailability,
  authenticateWithBiometrics,
  isBiometricsEnabled,
  disableBiometrics,
} from '../utils/biometrics';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  const checkBiometrics = async () => {
    const {available} = await checkBiometricAvailability();
    setBiometricsAvailable(available);
  };

  const checkSession = async () => {
    try {
      setIsLoading(true);

      // Check if account is locked FIRST
      const locked = await isAccountLocked();
      setIsLocked(locked);

      // If account is locked, do NOT auto-login
      if (locked) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return; // Exit early - no auto-login for locked accounts
      }

      // Check if user explicitly logged out
      const loggedOut = await wasLoggedOut();
      if (loggedOut) {
        // User logged out, don't auto-login
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return; // Exit early - no auto-login after logout
      }

      // Get login attempts
      const attempts = await getLoginAttempts();
      setLoginAttempts(attempts);

      // Get stored credentials and user data
      const credentials = await getCredentials();
      const userData = await getUserData();

      if (credentials && userData) {
        // Check if biometrics are enabled
        const biometricsEnabled = await isBiometricsEnabled();

        if (biometricsEnabled && biometricsAvailable) {
          // Prompt for biometric authentication
          const authenticated = await authenticateWithBiometrics(
            'Authenticate to access your account',
          );

          if (authenticated) {
            await clearLoggedOutFlag(); // Clear flag on successful login
            setUser(userData);
            setIsAuthenticated(true);
          }
        } else {
          // Auto-login without biometrics (only if not locked and not logged out)
          await clearLoggedOutFlag(); // Clear flag on successful login
          setUser(userData);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on app start
  useEffect(() => {
    checkSession();
    checkBiometrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if account is locked
      const locked = await isAccountLocked();
      if (locked) {
        setIsLocked(true);
        return false;
      }

      // Get stored credentials and user data
      const storedCredentials = await getCredentials();
      const storedUser = await getUserData();

      // Validate credentials exist and match
      if (!storedCredentials || !storedUser) {
        // No stored credentials or user data - user needs to register
        const attempts = await incrementLoginAttempts();
        setLoginAttempts(attempts);
        if (attempts >= 5) {
          await setAccountLock();
          setIsLocked(true);
        }
        return false;
      }

      // Check if credentials match
      if (
        storedCredentials.username === email &&
        storedCredentials.password === password
      ) {
        // Successful login
        await resetLoginAttempts();
        setLoginAttempts(0);
        await clearLoggedOutFlag(); // Clear logout flag on successful login
        setUser(storedUser);
        setIsAuthenticated(true);

        // Re-store credentials to ensure they're always available
        await storeCredentials(email, password);
        await storeUserData(storedUser);

        return true;
      } else {
        // Failed login - wrong credentials
        const attempts = await incrementLoginAttempts();
        setLoginAttempts(attempts);

        if (attempts >= 5) {
          await setAccountLock();
          setIsLocked(true);
        }

        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginWithBiometrics = async (): Promise<boolean> => {
    try {
      // Check if account is locked
      const locked = await isAccountLocked();
      if (locked) {
        setIsLocked(true);
        return false;
      }

      // Check if biometrics are enabled
      const biometricsEnabled = await isBiometricsEnabled();
      if (!biometricsEnabled) {
        return false;
      }

      // Get stored credentials to verify they exist
      const credentials = await getCredentials();
      if (!credentials) {
        // Credentials were cleared, disable biometrics
        await disableBiometrics();
        return false;
      }

      // Authenticate with biometrics
      const authenticated = await authenticateWithBiometrics(
        'Authenticate to sign in',
      );

      if (authenticated) {
        // Use the regular login flow with stored credentials
        const success = await login(credentials.username, credentials.password);
        return success;
      }

      return false;
    } catch (error) {
      console.error('Biometric login error:', error);
      return false;
    }
  };

  const register = async (userData: User, password: string): Promise<void> => {
    try {
      // Store credentials securely
      await storeCredentials(userData.email, password);

      // Store user data
      await storeUserData(userData);

      // Reset login attempts
      await resetLoginAttempts();
      setLoginAttempts(0);

      // Set authenticated state
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Note: In a local-only app, we keep credentials and user data stored
      // so users can login again after logout. This data is encrypted in
      // Keychain/Keystore. Only the session state is cleared.

      // Set logged out flag to prevent auto-login on app restart
      await setLoggedOutFlag();

      // Clear the session state (logged out)
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const recheckLockStatus = async (): Promise<void> => {
    try {
      const locked = await isAccountLocked();
      setIsLocked(locked);

      if (!locked) {
        const attempts = await getLoginAttempts();
        setLoginAttempts(attempts);
      }
    } catch (error) {
      console.error('Error rechecking lock status:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        loginWithBiometrics,
        register,
        logout,
        recheckLockStatus,
        isLoading,
        loginAttempts,
        isLocked,
        biometricsAvailable,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
