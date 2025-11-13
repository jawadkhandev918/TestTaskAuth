import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  testID?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  testID,
}) => {
  const {theme} = useTheme();
  const isPrimary = variant === 'primary';

  const buttonStyle = [
    styles.button,
    isPrimary ? styles.primaryButton : styles.secondaryButton,
    isPrimary
      ? {backgroundColor: theme.colors.primary}
      : {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
          borderWidth: 1,
        },
    (disabled || loading) && styles.disabledButton,
    style,
  ];

  const textStyle = [
    styles.buttonText,
    isPrimary ? styles.primaryButtonText : {color: theme.colors.primary},
    (disabled || loading) && styles.disabledButtonText,
  ];

  return (
    <TouchableOpacity
      testID={testID}
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? '#FFFFFF' : theme.colors.primary}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {},
  secondaryButton: {},
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});

export default CustomButton;
