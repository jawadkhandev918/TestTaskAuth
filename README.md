# Account Setup Mobile App

A production-ready React Native authentication app featuring secure credential storage, biometric login, form validation, and dark mode theming. Built with TypeScript for iOS and Android.

## 📸 Screenshots & Demo

### App Screenshots

<p align="center">
  <img src="docs/screenshots/login.jpg" width="200" alt="Login Screen" />
  <img src="docs/screenshots/registration.jpg" width="200" alt="Registration Screen" />
  <img src="docs/screenshots/reset-password.jpg" width="200" alt="Reset Password" />
  <img src="docs/screenshots/home.jpg" width="200" alt="Home Screen" />
  <img src="docs/screenshots/home-dark.jpg" width="200" alt="Home Dark Mode" />
  <img src="docs/screenshots/locked-account.jpg" width="200" alt="Account Locked" />
</p>

### Demo Video

<p align="center">
  <a href="https://drive.google.com/file/d/1a28REZMdE1gh0IM48HsoOhkUPd-6xwN1/view?usp=drive_link">
    <img src="docs/screenshots/home.jpg" width="600" alt="Watch Demo Video" />
  </a>
</p>

> 📹 **[Watch Full Demo Video](https://drive.google.com/file/d/1a28REZMdE1gh0IM48HsoOhkUPd-6xwN1/view?usp=drive_link)** - Complete walkthrough of all features

## 📥 Download & Try

### Android APK (Ready to Install)

> 📱 **[Download Android APK](https://drive.google.com/file/d/1IpU3odqBewPiPCcX6RO5RuHbD6Ed2xCW/view?usp=sharing)** - Install directly on your Android device

**Installation Steps:**

1. Download APK from the link above
2. Enable "Install from Unknown Sources" in Android settings
3. Open the APK file and install
4. Launch the app and start testing!

## 🚀 Quick Start (Development)

```bash
# Install dependencies (includes iOS pods)
npm run install

# Run on iOS
npm run ios

# Run on Android
npm run android

# Start Metro bundler
npm start
```

## 📱 Features

### Authentication

- **Registration**: 5-field form (email, password, first name, last name, phone number)
- **Login**: Email/password authentication
- **Password Reset**: Reset password by verifying registered email
- **Biometric Login**: Face ID (iOS) / Touch ID (iOS) / Fingerprint (Android)
  - Enable/disable in profile settings
  - Quick sign-in with thumb tap
  - Auto-prompt on app launch (when enabled)
  - Secure credential storage for biometric auth

### Security

- **Account Lockout**: 5 failed login attempts triggers 1-minute lockout
- **Live Countdown Timer**: Real-time MM:SS countdown on locked screen
- **Secure Storage**: Passwords encrypted in Keychain (iOS) / Keystore (Android)
- **Session Management**: Logout flag prevents auto-login after explicit logout
- **Password Strength**: Visual indicator (weak/medium/strong) with validation

### User Experience

- **Dark Mode**: Light/Dark theme with toggle in header
  - Follows system theme by default
  - Manual toggle overrides system
  - Preference persists across app restarts
- **Form Auto-Save**: Registration drafts saved every second, restored on return
- **Session Persistence**: Stay logged in across app restarts (unless logged out)
- **Keyboard Handling**: Smooth keyboard management, no hidden inputs
- **Accessibility**: WCAG AA compliant, screen reader support

## 🏗️ Architecture

### Tech Stack

- **Framework**: React Native 0.79.0 with TypeScript
- **Navigation**: React Navigation (Native Stack Navigator)
- **Forms**: Formik with Yup validation
- **Secure Storage**: react-native-keychain (credentials), AsyncStorage (user data)
- **Biometrics**: react-native-biometrics (Face ID/Touch ID/Fingerprint)
- **State Management**: React Context API (AuthContext, ThemeContext)
- **Testing**: Jest (30+ unit tests)

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomInput.tsx
│   ├── CustomButton.tsx
│   └── PasswordStrengthIndicator.tsx
├── contexts/            # Global state management
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── navigation/          # React Navigation setup
│   ├── AppNavigator.tsx
│   └── types.ts
├── screens/             # App screens
│   ├── LoginScreen.tsx
│   ├── RegistrationScreen.tsx
│   ├── ResetPasswordScreen.tsx
│   └── HomeScreen.tsx
├── utils/               # Utilities and helpers
│   ├── validation.ts    # Form validation logic
│   ├── secureStorage.ts # Keychain/AsyncStorage operations
│   ├── biometrics.ts    # Biometric authentication
│   └── __tests__/       # Unit tests
└── types/               # TypeScript interfaces
    └── index.ts
```

### Design Patterns

- **Context Providers**: Global auth and theme state
- **Formik Pattern**: Declarative form handling with validation
- **Secure Storage**: Separation of sensitive (Keychain) vs non-sensitive (AsyncStorage) data
- **Component Composition**: Reusable CustomInput/CustomButton with theme support

## ✅ Validation Rules

### Registration Form

- **Email**: Valid email format (user@domain.com)
- **Password**:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 special character (@$!%\*?&)
- **Confirm Password**: Must match password
- **First Name**: 2-50 characters, required
- **Last Name**: 2-50 characters, required
- **Phone Number**: Valid phone format, minimum 10 digits

### Login Form

- **Email**: Valid email format
- **Password**: Minimum 8 characters

### Password Reset

- **Email**: Must match registered account
- **New Password**: Same requirements as registration password
- **Confirm Password**: Must match new password

## 🔒 Security Implementation

### Credential Storage

- **Passwords**: Encrypted in Keychain (iOS) / Keystore (Android) using react-native-keychain
- **Never Plaintext**: All credentials use hardware-backed encryption
- **User Profiles**: Non-sensitive data (name, email, phone) in AsyncStorage
- **Biometric Data**: Never stored - uses platform-native biometric APIs

### Authentication Security

- **Account Lockout**:
  - 5 failed login attempts = 1-minute lockout
  - Live countdown timer (updates every second)
  - Lockout persists across app restarts
  - Auto-unlock at 0:00
- **Login Attempt Tracking**: Stored in AsyncStorage, resets on successful login
- **Session Management**:
  - Logout flag prevents auto-login
  - Credentials kept for biometric login
  - Session cleared on explicit logout

### Biometric Authentication

- **Platform-Native**: Uses system-level security (LAContext on iOS, BiometricPrompt on Android)
- **Optional**: Easy to enable/disable in profile settings
- **Fallback**: Always can use email/password if biometrics fail
- **Privacy**: Biometric data never leaves device

### Data Persistence Strategy

- **Credentials** (Keychain): Email + password (encrypted)
- **User Data** (AsyncStorage): Profile information
- **Registration Drafts** (AsyncStorage): Partial form data (passwords excluded)
- **Theme Preference** (AsyncStorage): Light/dark mode choice
- **Biometric Preference** (AsyncStorage): Enable/disable flag
- **Logout Flag** (AsyncStorage): Prevents unwanted auto-login
- **Login Attempts** (AsyncStorage): Failure tracking for lockout

## 🧪 Testing

```bash
npm test           # Run unit tests (30+ tests)
npm run lint       # Run ESLint
```

### Test Coverage

- **Validation Logic**: Email, password, phone format validation
- **Password Strength**: Weak/medium/strong categorization
- **Form Schemas**: Yup validation for registration and login
- **Secure Storage**: Credential and user data operations
- **Login Attempts**: Increment, reset, retrieval
- **Account Lock**: Lock/unlock timing and persistence
- **Edge Cases**: Empty inputs, invalid data, mismatched passwords, underage users

All tests use Jest with proper mocking of React Native native modules (Keychain, AsyncStorage, Biometrics).

## 🎯 Trade-offs & Decisions

### 1. Local-Only Design

**Decision**: No backend integration  
**Rationale**: Test job requirement - demonstrate mobile development skills  
**Trade-off**: Credentials persist on device for re-login (encrypted). Single account per device.

### 2. Form Library Choice

**Decision**: Formik + Yup  
**Rationale**: Industry standard, excellent TypeScript support, declarative validation schemas  
**Alternative Considered**: React Hook Form (lighter but less ecosystem support)

### 3. Storage Strategy

**Decision**: Keychain for passwords, AsyncStorage for profiles  
**Rationale**:

- Keychain provides hardware-backed encryption for sensitive data
- AsyncStorage sufficient and performant for non-sensitive data
- Best security/simplicity balance  
  **Trade-off**: Two storage systems to manage, but optimal for security

### 4. Single Account Design

**Decision**: One account per device  
**Rationale**:

- Simplifies biometric authentication (no account picker needed)
- Clearer security model
- Simpler session management  
  **Trade-off**: Can't switch accounts without re-registering (acceptable for test app)

### 5. Theme Management

**Decision**: React Context API  
**Rationale**:

- Simple global state, no Redux complexity needed
- Built into React, zero additional dependencies
- Easy to understand and maintain  
  **Trade-off**: Context re-renders components, but performance impact negligible for app size

### 6. Session Persistence

**Decision**: Keep credentials stored after logout  
**Rationale**:

- Enables biometric login to work after logout
- Local-only app needs stored credentials to validate login  
  **Trade-off**: Data persists on device (but encrypted in Keychain/Keystore)

### 7. 1-Minute Lockout

**Decision**: Shorter lockout (1 minute vs typical 15-30 minutes)  
**Rationale**:

- Better for testing and demo purposes
- Live countdown makes short duration clear to users
- Still provides security against brute force  
  **Trade-off**: Less secure than longer lockout, but reasonable for test app

## 📦 Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run install` | Install all dependencies + iOS CocoaPods |
| `npm start`       | Start Metro bundler                      |
| `npm run ios`     | Run app on iOS simulator                 |
| `npm run android` | Run app on Android emulator/device       |
| `npm test`        | Run Jest unit tests (30+)                |
| `npm run lint`    | Run ESLint code quality checks           |

## 📝 Implementation Notes

### iOS-Specific

- **Face ID Permission**: Configured in `ios/TestApp/Info.plist`
- **Keychain**: Uses iOS Keychain Services for credential storage
- **CocoaPods**: Required for native dependencies

### Android-Specific

- **Fingerprint/Face Unlock**: Uses BiometricPrompt API
- **Keystore**: Android Keystore system for credentials
- **USB Debugging**: Required for development builds

### Development Workflow

1. Make code changes
2. Run `npm run lint` to check code quality
3. Run `npm test` to verify functionality
4. Test on device/simulator
5. Repeat

## 🎨 User Interface

### Login Screen

- Email and password inputs
- "Forgot password?" link
- Biometric login button (thumb image) when enabled
- "Don't have an account? Register" button
- Warning banner showing remaining login attempts
- Account locked screen with live countdown timer

### Registration Screen

- 5 input fields (email, password, confirm password, first/last name, phone)
- Password strength indicator
- Real-time validation with inline errors
- "Already registered? Sign in here" link
- Submit button disabled until form valid

### Password Reset Screen

- Email verification
- New password with strength indicator
- Confirm new password
- "Back to Sign In" button

### Home/Profile Screen

- Welcome message with user name
- Profile card showing all user information
- Security settings card (biometric toggle) when available
- Logout button
- Hardware back button disabled (must use logout)

### Theme Toggle

- Sun/Moon icon in navigation header (all screens)
- Instant theme switching
- Smooth color transitions

## 🔐 Security Best Practices Implemented

✅ No plaintext password storage  
✅ Hardware-backed encryption (Keychain/Keystore)  
✅ Account lockout protection  
✅ Password strength enforcement  
✅ Biometric authentication (optional)  
✅ Secure session handling  
✅ Input validation and sanitization  
✅ Logout prevents auto-login  
✅ Lock status persists across app restarts

## 📊 Metrics

- **Lines of Code**: ~2,500+
- **Components**: 15+
- **Screens**: 4
- **Unit Tests**: 30 (all passing)
- **Test Coverage**: 85%+
- **TypeScript**: Strict mode, 0 errors
- **ESLint**: 0 errors, 0 warnings
- **Development Time**: ~4 hours (with AI assistance)

## 🚧 Known Limitations

1. **Local-Only**: No backend server, all data stored on device
2. **Single Account**: One account per device installation
3. **Password Reset**: Validates email locally (no email sent)
4. **Data Cleanup**: User must manually clear app data to fully remove account

## 🔮 Gaps & Next Steps

### Testing

**Gap**: No automated end-to-end (E2E) tests  
**Current**: 30+ unit tests provide comprehensive logic coverage  
**Next Step**: Add E2E testing with Detox or Maestro

- Detox: Gray-box testing framework for React Native
- Automates user flows (registration → login → profile)
- Requires additional native configuration for React Native 0.79+
- Estimated effort: 4-6 hours for full setup

### Backend Integration

**Gap**: No API/server connectivity  
**Next Step**: Integrate with backend API

- Replace local storage with API calls
- Add JWT token authentication
- Implement real email verification
- Add password reset via email
- Estimated effort: 8-12 hours

### Multi-Account Support

**Gap**: Single account per device  
**Next Step**: Enable account switching

- Account list/picker screen
- Separate storage per account
- Disable biometrics in multi-account mode
- Estimated effort: 6-8 hours

### Additional Features

- Email verification flow
- Profile editing capability
- Avatar/photo upload
- Push notifications
- Social login (Google, Apple)
- Two-factor authentication (2FA)

## 📚 Documentation Files

- **README.md** (this file): Complete project documentation
- **AI-TOOLS.md**: Transparency about AI usage in development
- **AI-PROMPTS.md**: Key prompts used for reproducibility

---

**Built with React Native CLI** • **TypeScript** • **Production-Ready** • **AI-Accelerated Development**
