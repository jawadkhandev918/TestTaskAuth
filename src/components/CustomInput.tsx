import React, {useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
  testID?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  touched,
  testID,
  ...props
}) => {
  const {theme} = useTheme();
  const hasError = touched && error;

  const themedStyles = useMemo(
    () =>
      StyleSheet.create({
        label: {
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 8,
          color: theme.colors.text,
        },
        input: {
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          fontSize: 16,
          backgroundColor: theme.colors.inputBackground,
          borderColor: hasError ? theme.colors.error : theme.colors.border,
          color: theme.colors.text,
        },
        errorText: {
          fontSize: 12,
          marginTop: 4,
          color: theme.colors.error,
        },
      }),
    [theme, hasError],
  );

  return (
    <View style={styles.container}>
      <Text style={themedStyles.label}>{label}</Text>
      <TextInput
        testID={testID}
        style={themedStyles.input}
        placeholderTextColor={theme.colors.placeholder}
        {...props}
      />
      {hasError && <Text style={themedStyles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});

export default CustomInput;
