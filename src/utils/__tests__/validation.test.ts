import {
  validateEmail,
  validatePassword,
  validatePhone,
  getPasswordStrength,
  loginValidationSchema,
  registrationValidationSchema,
} from '../validation';

describe('Email Validation', () => {
  test('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('Password Validation', () => {
  test('should validate strong passwords', () => {
    expect(validatePassword('Password123!')).toBe(true);
    expect(validatePassword('MyP@ssw0rd')).toBe(true);
    expect(validatePassword('SecurePass1!')).toBe(true);
  });

  test('should reject weak passwords', () => {
    expect(validatePassword('password')).toBe(false); // No uppercase, number, special
    expect(validatePassword('PASSWORD123')).toBe(false); // No lowercase, special
    expect(validatePassword('Password123')).toBe(false); // No special character
    expect(validatePassword('Pass1!')).toBe(false); // Too short
    expect(validatePassword('')).toBe(false);
  });
});

describe('Phone Validation', () => {
  test('should validate correct phone numbers', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('123-456-7890')).toBe(true);
    expect(validatePhone('+1 (123) 456-7890')).toBe(true);
    expect(validatePhone('123 456 7890')).toBe(true);
  });

  test('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false); // Too short
    expect(validatePhone('abc')).toBe(false); // Not numbers
    expect(validatePhone('')).toBe(false);
  });
});

describe('Password Strength', () => {
  test('should categorize password strength correctly', () => {
    expect(getPasswordStrength('weak')).toBe('weak');
    expect(getPasswordStrength('Password')).toBe('medium');
    expect(getPasswordStrength('Password123!')).toBe('strong');
  });
});

describe('Login Validation Schema', () => {
  test('should validate correct login data', async () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    await expect(loginValidationSchema.validate(validData)).resolves.toEqual(
      validData,
    );
  });

  test('should reject invalid login data', async () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'short',
    };

    await expect(
      loginValidationSchema.validate(invalidData),
    ).rejects.toThrow();
  });

  test('should require all fields', async () => {
    const emptyData = {
      email: '',
      password: '',
    };

    await expect(loginValidationSchema.validate(emptyData)).rejects.toThrow();
  });
});

describe('Registration Validation Schema', () => {
  test('should validate correct registration data', async () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    await expect(
      registrationValidationSchema.validate(validData),
    ).resolves.toEqual(validData);
  });

  test('should reject mismatched passwords', async () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    await expect(registrationValidationSchema.validate(data)).rejects.toThrow(
      'Passwords must match',
    );
  });

  test('should require all fields', async () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: '',
      lastName: 'Doe',
      phoneNumber: '1234567890',
    };

    await expect(registrationValidationSchema.validate(data)).rejects.toThrow(
      'First name is required',
    );
  });

  test('should reject invalid phone numbers', async () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123', // Too short
    };

    await expect(registrationValidationSchema.validate(data)).rejects.toThrow();
  });
});

