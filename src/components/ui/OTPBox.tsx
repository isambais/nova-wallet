import { View, Text, StyleSheet } from 'react-native';

const A = {
  surface:      'rgba(255,255,255,0.055)',
  border:       'rgba(255,255,255,0.09)',
  filledBg:     'rgba(107,140,255,0.09)',
  filledBorder: 'rgba(107,140,255,0.32)',
  activeBorder: 'rgba(107,140,255,0.68)',
  activeBg:     'rgba(107,140,255,0.07)',
  activeGlow:   'rgba(107,140,255,0.18)',
  digit:        '#FFFFFF',
  cursor:       '#6B8CFF',
};

interface OTPBoxProps {
  length?: number;
  value: string[];
  activeIndex: number;
}

export function OTPBox({ length = 4, value, activeIndex }: OTPBoxProps) {
  return (
    <View style={s.row}>
      {Array.from({ length }).map((_, i) => {
        const filled = !!value[i];
        const active = i === activeIndex;
        return (
          <View
            key={i}
            style={[
              s.box,
              filled && s.filled,
              active && s.active,
            ]}
          >
            {filled
              ? <Text style={s.digit}>{value[i]}</Text>
              : active && <View style={s.cursor} />
            }
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, width: '100%' },

  box: {
    flex: 1,
    height: 60,
    borderRadius: 13,
    backgroundColor: A.surface,
    borderWidth: 1.5,
    borderColor: A.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: A.filledBg,
    borderColor: A.filledBorder,
  },
  active: {
    backgroundColor: A.activeBg,
    borderColor: A.activeBorder,
    shadowColor: A.activeGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },

  digit:  { color: A.digit, fontSize: 23, fontWeight: '700' },
  cursor: { width: 2, height: 26, borderRadius: 1, backgroundColor: A.cursor },
});
