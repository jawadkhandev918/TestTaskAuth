import * as Yup from 'yup';

// Email validation regex
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Phone validation regex (supports various formats)
const phoneRegex = /^[\d\s\-+()]+$/;

// Password strength validation
// At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .matches(emailRegex, 'Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export const registrationValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .matches(emailRegex, 'Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      passwordRegex,
      'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(phoneRegex, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
});

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return passwordRegex.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const getPasswordStrength = (
  password: string,
): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) {return 'weak';}
  if (!passwordRegex.test(password)) {return 'medium';}
  return 'strong';
};

