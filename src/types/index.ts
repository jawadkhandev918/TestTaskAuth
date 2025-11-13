export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithBiometrics: () => Promise<boolean>;
  register: (user: User, password: string) => Promise<void>;
  logout: () => Promise<void>;
  recheckLockStatus: () => Promise<void>;
  isLoading: boolean;
  loginAttempts: number;
  isLocked: boolean;
  biometricsAvailable: boolean;
}

export interface RegistrationFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

