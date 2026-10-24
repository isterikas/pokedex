import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

interface PokemonInfoRowProps {
  label: string;
  value: string;
}

export function PokemonInfoRow({ label, value }: PokemonInfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, gap: 4, minWidth: 120 },
  label: {
    color: '#596d46',
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.lcdDark,
    fontFamily: theme.fonts.monoBold,
    fontSize: 12,
    lineHeight: 19,
  },
});
