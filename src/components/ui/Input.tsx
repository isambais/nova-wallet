import { useRef } from 'react';
import { TextInput, View, Text, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
}

export function Input({ label, error, prefix, style, onFocus, onBlur, ...props }: InputProps) {
  const rowRef = useRef<View>(null);

  function handleFocus(e: any) {
    rowRef.current?.setNativeProps({
      style: {
        borderColor: colors.purple,
        shadowColor: colors.purple,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
      },
    });
    onFocus?.(e);
  }

  function handleBlur(e: any) {
    rowRef.current?.setNativeProps({
      style: {
        borderColor: colors.surface3,
        shadowOpacity: 0,
        elevation: 0,
      },
    });
    onBlur?.(e);
  }

  return (
    <View style={s.wrap}>
      {label && <Text style={s.label}>{label}</Text>}

      <View ref={rowRef} style={[s.row, !!error && s.rowError]}>
        {prefix && (
          <>
            <Text style={s.prefix}>{prefix}</Text>
            <View style={s.divider} />
          </>
        )}
        <TextInput
          style={[s.input, style]}
          placeholderTextColor={colors.text3}
          selectionColor={colors.purpleLight}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>

      {error && <Text style={s.err}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    color: colors.text2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface2,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.surface3,
    paddingHorizontal: 16,
  },
  rowError: { borderColor: colors.error },
  prefix: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 16,
    paddingRight: 12,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: colors.surface3,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.text1,
    fontSize: 15,
    paddingVertical: 16,
    fontWeight: '500',
  },
  err: { color: colors.error, fontSize: 11 },
});
