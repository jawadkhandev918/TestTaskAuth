import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {getPasswordStrength} from '../utils/validation';
import {useTheme} from '../contexts/ThemeContext';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  const {theme} = useTheme();
  const strength = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case 'weak':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'strong':
        return theme.colors.success;
      default:
        return theme.colors.border;
    }
  };

  const getWidth = () => {
    switch (strength) {
      case 'weak':
        return '33%';
      case 'medium':
        return '66%';
      case 'strong':
        return '100%';
      default:
        return '0%';
    }
  };

  const color = getColor();
  const width = getWidth();

  const themedStyles = useMemo(
    () =>
      StyleSheet.create({
        barContainer: {
          height: 4,
          borderRadius: 2,
          overflow: 'hidden',
          backgroundColor: theme.colors.border,
        },
        bar: {
          height: '100%',
          borderRadius: 2,
          width: width,
          backgroundColor: color,
        },
        text: {
          fontSize: 12,
          marginTop: 4,
          fontWeight: '500',
          color: color,
        },
      }),
    [theme, width, color],
  );

  if (!password) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={themedStyles.barContainer}>
        <View style={themedStyles.bar} />
      </View>
      <Text style={themedStyles.text}>Password strength: {strength}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
});

export default PasswordStrengthIndicator;
