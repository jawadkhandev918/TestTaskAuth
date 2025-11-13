# Key AI Prompts Used

This document contains the main prompts used with Cursor AI (Claude) to build this React Native app.

## Initial Setup

```
I have created a React Native CLI project. I need to build a mobile app with:

- Registration form (5 fields: email, password, first name, last name, phone)
- Login screen (email/password)
- Home/Profile screen (display user data, logout button)
- Form validation with Formik + Yup
- Secure storage (react-native-keychain for passwords)
- Session persistence
- Account lockout after 5 failed attempts
- React Navigation
- TypeScript

Use the React Native CLI project (NOT Expo).
Install dependencies and create proper folder structure.
```

## Component Development

```
Create reusable components in src/components/:

1. CustomInput - with label, error display, theming
2. CustomButton - primary/secondary variants, loading state
3. PasswordStrengthIndicator - visual bar (weak/medium/strong)

All components should:
- Support TypeScript
- Use theme context
- Have testID props for E2E testing
- Be accessible
```

## Validation Logic

```
Create validation utilities in src/utils/validation.ts:

Use Yup schemas for:
- Registration: email, password (8+ chars, uppercase, lowercase, number, special char), 
  confirm password, first/last name (2-50 chars), phone (10+ digits)
- Login: email, password

Export helper functions and Yup schemas for Formik.
```

## Secure Storage

```
Create secure storage in src/utils/secureStorage.ts:

Functions needed:
- storeCredentials / getCredentials / clearCredentials (Keychain)
- storeUserData / getUserData / clearUserData (AsyncStorage)
- Login attempt tracking (increment, reset, get)
- Account lock (set, check, get remaining time)
- Registration draft (save, load, clear)

Use react-native-keychain for passwords, AsyncStorage for profiles.
```

## Authentication Context

```
Create AuthContext in src/contexts/AuthContext.tsx:

Features:
- Track user, auth status, login attempts, lock status
- login(email, password) - validate and handle lockout
- loginWithBiometrics() - biometric authentication
- register(user, password) - store credentials and data
- logout() - manage session cleanup
- Check session on app start
- Prevent auto-login after explicit logout

Export useAuth hook.
```

## Theme System

```
Add dark mode support:

Create ThemeContext with:
- Light and dark color schemes
- Theme toggle function
- Persist preference in AsyncStorage
- Auto-detect system theme

Add theme toggle button in navigation header.
Update all components to use theme colors.
```

## Biometric Authentication

```
Add biometric support using react-native-biometrics:

Features:
- Check device capability (Face ID/Touch ID/Fingerprint)
- Enable/disable in profile settings
- Biometric login button on login screen
- Auto-prompt on app launch if enabled
- Secure credential storage for biometric login

Configure iOS Face ID permission in Info.plist.
```

## Security Enhancements

```
Improve account lockout:

- Change lockout duration to 1 minute
- Add live countdown timer (updates every second)
- Display timer on locked screen (MM:SS format)
- Auto-unlock when timer reaches 0:00
- Prevent auto-login if account locked (even after app restart)
```

## Testing

```
Create comprehensive unit tests with Jest:

1. Test validation utilities (email, password, phone)
2. Test secure storage operations
3. Test authentication flows
4. Mock react-native-keychain and AsyncStorage
5. Test edge cases and error handling
6. Ensure high test coverage

All tests should run quickly and reliably without device.
```

## Bug Fixes

```
Fix biometric login after logout:
- Biometrics enabled but login fails after logout
- Need to keep credentials stored when biometrics are enabled
```

```
Fix auto-login after logout:
- App auto-logs in after killing and reopening
- Add logout flag to prevent auto-login
- Clear flag on successful login
```

```
Fix account lockout bypass:
- Locked account auto-logs in on app restart
- Check lock status before auto-login in checkSession()
```

## UI Improvements

```
Update biometric button:
- Use thumb image from assets/images/thumb.png
- Remove text, show only image
- Simple, clean design
```

```
Fix keyboard hiding inputs on registration:
- Adjust KeyboardAvoidingView offset
- Add bottom padding to ScrollView
- Ensure all fields accessible when keyboard open
```

```
Prevent back button on Home screen:
- Add BackHandler to prevent navigating back to login when logged in
- Only allow logout via logout button
```

## Prompt Structure Tips

**Effective prompt format:**
```
[Context: What you're building]
[Requirements: Specific features needed]
[Constraints: Tech stack, patterns to follow]
[Quality: TypeScript, testing, accessibility]
```

**Follow-up prompts:**
- "Fix [specific bug]"
- "Add [feature] to [component]"
- "Update [file] to [requirement]"
- "Create tests for [functionality]"

## Results

These prompts resulted in:
- 2,500+ lines of production code
- 15+ components
- 30+ unit tests
- E2E test suite
- Complete documentation
- All in ~4 hours

---

**Tool**: Cursor IDE with Claude Sonnet 4.5  
**Approach**: Iterative development with human oversight  
**Outcome**: Production-ready React Native app

