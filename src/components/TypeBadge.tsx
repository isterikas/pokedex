import { StyleSheet, Text, View } from 'react-native';

import { pokemonTypeStyles } from '../constants/pokemonTypes';
import { theme } from '../constants/theme';
import type { PokemonType } from '../types/pokemon';

interface TypeBadgeProps {
  type: PokemonType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const colors = pokemonTypeStyles[type];

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <View style={[styles.dot, { backgroundColor: colors.foreground }]} />
      <Text style={[styles.text, { color: colors.foreground }]}>{type.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: theme.colors.ink,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  dot: { borderRadius: 3, height: 5, width: 5 },
  text: { fontFamily: theme.fonts.monoBold, fontSize: 10, letterSpacing: 1 },
});
