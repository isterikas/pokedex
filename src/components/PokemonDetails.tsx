import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getGameVersionLabel, resolveGameVersion } from '../constants/gameVersions';
import { theme } from '../constants/theme';
import type { Pokemon } from '../types/pokemon';
import { formatHeight, formatWeight } from '../utils/formatMeasurements';
import { formatPokemonNumber } from '../utils/formatPokemonNumber';
import { PokemonInfoRow } from './PokemonInfoRow';
import { TypeBadge } from './TypeBadge';

interface PokemonDetailsProps {
  pokemon: Pokemon;
  selectedVersion: string;
  onOpenVersions?: () => void;
}

export function PokemonDetails({ pokemon, selectedVersion, onOpenVersions }: PokemonDetailsProps) {
  const entry = resolveGameVersion(pokemon.descriptions, selectedVersion);
  const regularAbilities = pokemon.abilities.filter((ability) => !ability.isHidden);
  const hiddenAbilities = pokemon.abilities.filter((ability) => ability.isHidden);

  return (
    <View style={styles.housing}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <View style={styles.eyebrowRow}>
            <Text style={styles.eyebrow}>SPECIMEN RECORD</Text>
            <Text style={styles.id}>{formatPokemonNumber(pokemon.id)}</Text>
          </View>
          <Text accessibilityLiveRegion="polite" accessibilityRole="header" style={styles.name}>
            {pokemon.name}
          </Text>
          <View style={styles.typeRow}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>
        </View>

        <View style={styles.metadata}>
          <PokemonInfoRow label="Species" value={pokemon.species} />
          <View style={styles.measurementRow}>
            <PokemonInfoRow label="Height" value={formatHeight(pokemon.heightDecimeters)} />
            <PokemonInfoRow label="Weight" value={formatWeight(pokemon.weightHectograms)} />
          </View>
          <View style={styles.abilityRow}>
            <View style={styles.abilityColumn}>
              <Text style={styles.fieldLabel}>ABILITIES</Text>
              <Text style={styles.abilityText}>
                {regularAbilities.map((ability) => ability.name).join(' · ')}
              </Text>
            </View>
            {hiddenAbilities.length > 0 && (
              <View style={styles.abilityColumn}>
                <Text style={styles.fieldLabel}>HIDDEN ABILITY</Text>
                <Text style={styles.abilityText}>
                  {hiddenAbilities.map((ability) => ability.name).join(' · ')}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.descriptionBlock}>
          <View style={styles.entryHeader}>
            <Text style={styles.fieldLabel}>POKÉDEX ENTRY</Text>
            <Pressable
              accessibilityLabel={`Choose description game, current game ${getGameVersionLabel(entry.version)}`}
              accessibilityRole="button"
              disabled={!onOpenVersions}
              onPress={onOpenVersions}
              style={({ pressed }) => [styles.versionButton, pressed && styles.pressedVersion]}
            >
              <View style={styles.versionDot} />
              <Text style={styles.versionText}>{getGameVersionLabel(entry.version)}</Text>
              {onOpenVersions && <Text style={styles.versionArrow}>⌄</Text>}
            </Pressable>
          </View>
          {entry.isFallback && (
            <Text style={styles.fallback}>
              Entry unavailable in {getGameVersionLabel(selectedVersion)}. Showing{' '}
              {getGameVersionLabel(entry.version)}.
            </Text>
          )}
          <ScrollView
            accessibilityLabel="Pokédex description"
            contentContainerStyle={styles.descriptionContent}
            nestedScrollEnabled
            style={styles.descriptionScroll}
          >
            <Text style={styles.description}>{entry.text}</Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.readoutFooter}>
        <View style={styles.footerDot} />
        <Text style={styles.footerText}>LOCAL MEMORY / ALL SYSTEMS READY</Text>
        <View style={styles.memoryBars}>
          {[0, 1, 2, 3, 4].map((bar) => (
            <View key={bar} style={styles.memoryBar} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  housing: {
    backgroundColor: theme.colors.graphite,
    borderColor: theme.colors.ink,
    borderRadius: 14,
    borderWidth: 3,
    padding: 10,
  },
  screen: {
    backgroundColor: theme.colors.lcd,
    borderColor: '#1f2c22',
    borderRadius: 5,
    borderWidth: 2,
    padding: 20,
  },
  header: { borderBottomColor: theme.colors.lcdLine, borderBottomWidth: 1, paddingBottom: 17 },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: '#596d46', fontFamily: theme.fonts.mono, fontSize: 9, letterSpacing: 1.1 },
  id: { color: '#62754e', fontFamily: theme.fonts.monoBold, fontSize: 10 },
  name: {
    color: theme.colors.lcdDark,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.2,
    lineHeight: 45,
    marginBottom: 10,
    marginTop: 4,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metadata: {
    borderBottomColor: theme.colors.lcdLine,
    borderBottomWidth: 1,
    gap: 13,
    paddingVertical: 16,
  },
  measurementRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  abilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  abilityColumn: { flex: 1, gap: 4, minWidth: 120 },
  fieldLabel: { color: '#596d46', fontFamily: theme.fonts.mono, fontSize: 9, letterSpacing: 1.1 },
  abilityText: {
    color: theme.colors.lcdDark,
    fontFamily: theme.fonts.monoBold,
    fontSize: 12,
    lineHeight: 19,
  },
  descriptionBlock: { paddingTop: 15 },
  entryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  versionButton: {
    alignItems: 'center',
    backgroundColor: '#c4dda0',
    borderColor: '#8ba86f',
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 9,
  },
  pressedVersion: { backgroundColor: '#b3d18b' },
  versionDot: { backgroundColor: '#617b49', borderRadius: 2, height: 4, width: 4 },
  versionText: { color: theme.colors.lcdDark, fontFamily: theme.fonts.monoBold, fontSize: 10 },
  versionArrow: {
    color: theme.colors.lcdDark,
    fontFamily: theme.fonts.monoBold,
    fontSize: 16,
    lineHeight: 18,
    marginTop: -4,
  },
  fallback: {
    color: '#4f663e',
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    lineHeight: 15,
    marginBottom: 7,
  },
  descriptionScroll: { maxHeight: 144, minHeight: 86 },
  descriptionContent: { paddingBottom: 3 },
  description: {
    color: theme.colors.lcdDark,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    lineHeight: 21,
  },
  readoutFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 3,
    paddingTop: 10,
  },
  footerDot: { backgroundColor: theme.colors.green, borderRadius: 3, height: 4, width: 4 },
  footerText: {
    color: '#a5b2a0',
    flex: 1,
    fontFamily: theme.fonts.mono,
    fontSize: 6,
    letterSpacing: 0.5,
  },
  memoryBars: { flexDirection: 'row', gap: 2 },
  memoryBar: { backgroundColor: '#91a186', height: 6, width: 3 },
});
