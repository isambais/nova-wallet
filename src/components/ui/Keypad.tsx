import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const KEYS: { num: string; letters: string }[][] = [
  [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
  ],
  [
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
  ],
  [
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
  ],
];

interface KeypadProps {
  onPress: (key: string) => void;
  onDelete: () => void;
}

export function Keypad({ onPress, onDelete }: KeypadProps) {
  return (
    <View style={s.grid}>
      {/* Satırlar 1–3 */}
      {KEYS.map((row, ri) => (
        <View key={ri} style={s.row}>
          {row.map(({ num, letters }) => (
            <TouchableOpacity
              key={num}
              style={s.key}
              activeOpacity={0.55}
              onPress={() => onPress(num)}
            >
              <Text style={s.num}>{num}</Text>
              {letters ? <Text style={s.letters}>{letters}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Son satır: · / 0 / ⌫ */}
      <View style={s.row}>
        {/* Nokta — inaktif */}
        <View style={[s.key, s.dim]}>
          <Text style={[s.num, { opacity: 0.22 }]}>·</Text>
        </View>

        <TouchableOpacity style={s.key} activeOpacity={0.55} onPress={() => onPress('0')}>
          <Text style={s.num}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.key, s.delKey]} activeOpacity={0.55} onPress={onDelete}>
          <Text style={s.del}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    gap: 8,
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: 'rgba(3,6,16,0.55)',
  },
  row: { flexDirection: 'row', gap: 8 },

  key: {
    flex: 1,
    aspectRatio: 1.55,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.085)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.065)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  dim: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'transparent',
  },
  delKey: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  num:     { color: '#FFFFFF', fontSize: 20, fontWeight: '400', lineHeight: 24 },
  letters: { color: 'rgba(255,255,255,0.34)', fontSize: 7.5, fontWeight: '600', letterSpacing: 1.3 },
  del:     { color: 'rgba(255,255,255,0.72)', fontSize: 20 },
});
