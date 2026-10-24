import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import { spriteManifest } from '../data/spriteManifest';
import type { Pokemon } from '../types/pokemon';
import { formatPokemonNumber } from '../utils/formatPokemonNumber';

interface PokemonDisplayProps {
  pokemon: Pokemon;
}

export function PokemonDisplay({ pokemon }: PokemonDisplayProps) {
  return (
    <View style={styles.displayHousing}>
      <View style={styles.screen}>
        <View style={styles.screenHeader}>
          <View style={styles.screenLabel}>
            <View style={styles.liveDot} />
            <Text style={styles.smallLabel}>SPECIMEN VIEW</Text>
          </View>
          <Text style={styles.smallLabel}>NATIONAL DEX</Text>
        </View>
        <View style={styles.viewport}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={styles.orbit}
          />
          <Image
            accessibilityLabel={`${pokemon.name}, normal front sprite`}
            contentFit="contain"
            source={spriteManifest[pokemon.id]}
            style={styles.sprite}
            transition={0}
          />
        </View>
        <View style={styles.screenFooter}>
          <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
          <View style={styles.captureLabel}>
            <Text style={styles.smallLabel}>FRONT / NORMAL</Text>
            <Text style={styles.archiveText}>KANTO REGION ARCHIVE</Text>
          </View>
          <View style={styles.barcode}>
            {[4, 2, 5, 2, 3, 2, 5, 3, 2].map((width, index) => (
              <View key={index} style={[styles.barcodeLine, { width }]} />
            ))}
          </View>
        </View>
      </View>
      <View style={styles.screenBezelBottom}>
        <View style={styles.powerLight} />
        <View style={styles.screenSlot} />
        <View style={styles.screenSlot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  displayHousing: {
    backgroundColor: '#f6f2e8',
    borderColor: theme.colors.ink,
    borderRadius: 15,
    borderWidth: 3,
    padding: 11,
    paddingBottom: 0,
    width: '100%',
  },
  screen: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.ink,
    borderRadius: 6,
    borderWidth: 2,
    overflow: 'hidden',
  },
  screenHeader: {
    alignItems: 'center',
    borderBottomColor: '#e7e8df',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  screenLabel: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  liveDot: { backgroundColor: '#7d996e', borderRadius: 3, height: 5, width: 5 },
  smallLabel: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.mono,
    fontSize: 8,
    letterSpacing: 0.7,
  },
  viewport: {
    alignItems: 'center',
    aspectRatio: 1.45,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    maxHeight: 300,
    minHeight: 190,
  },
  corner: { borderColor: '#b8bdb2', height: 14, position: 'absolute', width: 14 },
  topLeft: { borderLeftWidth: 1, borderTopWidth: 1, left: 0, top: 0 },
  topRight: { borderRightWidth: 1, borderTopWidth: 1, right: 0, top: 0 },
  bottomLeft: { borderBottomWidth: 1, borderLeftWidth: 1, bottom: 0, left: 0 },
  bottomRight: { borderBottomWidth: 1, borderRightWidth: 1, bottom: 0, right: 0 },
  orbit: {
    borderColor: '#f1f1e9',
    borderRadius: 200,
    borderWidth: 1,
    height: '84%',
    maxHeight: 290,
    maxWidth: 290,
    position: 'absolute',
    width: '84%',
  },
  sprite: { height: '85%', maxHeight: 320, maxWidth: 320, width: '85%' },
  screenFooter: {
    alignItems: 'center',
    borderTopColor: '#e7e8df',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  number: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.monoBold,
    fontSize: 24,
    letterSpacing: -1.3,
  },
  captureLabel: { flex: 1, gap: 4 },
  archiveText: { color: '#a1a59b', fontFamily: theme.fonts.mono, fontSize: 6, letterSpacing: 0.5 },
  barcode: { alignItems: 'center', flexDirection: 'row', gap: 2, height: 21 },
  barcodeLine: { backgroundColor: '#858b80', height: '100%' },
  screenBezelBottom: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    height: 25,
    paddingHorizontal: 7,
  },
  powerLight: {
    backgroundColor: theme.colors.casing,
    borderColor: theme.colors.ink,
    borderRadius: 5,
    borderWidth: 1,
    height: 8,
    marginRight: 'auto',
    width: 8,
  },
  screenSlot: { backgroundColor: '#b0b3a7', borderRadius: 1, height: 2, width: 22 },
});
