import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButtons } from '../../components/ActionButtons';
import { DirectionPad } from '../../components/DirectionPad';
import { GameVersionPicker } from '../../components/GameVersionPicker';
import { PokedexFrame } from '../../components/PokedexFrame';
import { PokemonDetails } from '../../components/PokemonDetails';
import { PokemonDisplay } from '../../components/PokemonDisplay';
import { theme } from '../../constants/theme';
import { usePokedex } from './usePokedex';

export function PokedexScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 900;
  const narrow = width < 370;
  const dex = usePokedex();
  const controls = (
    <View style={[styles.controls, narrow && styles.narrowControls]}>
      <DirectionPad currentId={dex.currentId} maxId={dex.total} onNavigate={dex.navigate} />
      <View style={styles.actionsColumn}>
        <View style={styles.controlReadout}>
          <Text style={styles.readoutLabel}>ARCHIVE POSITION</Text>
          <Text style={styles.readoutValue}>
            {String(dex.currentId).padStart(3, '0')}
            <Text style={styles.readoutTotal}> / {dex.total}</Text>
          </Text>
        </View>
        <ActionButtons onOpenVersions={dex.openVersionPicker} onReset={dex.reset} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.page, compact && styles.compactPage]}>
        <View style={styles.pageHeader}>
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <View style={styles.brandBand} />
              <View style={styles.brandCenter} />
            </View>
            <Text style={styles.brandName}>
              anomalies<Text style={styles.brandDot}>.</Text>
            </Text>
            {!compact && <View style={styles.brandDivider} />}
            {!compact && <Text style={styles.brandSubtitle}>CURIOUS BY NATURE.</Text>}
          </View>
          <View style={styles.offlineBadge}>
            <View style={styles.offlineDot} />
            <Text style={styles.offlineText}>OFFLINE READY</Text>
          </View>
        </View>

        <View style={[styles.intro, compact && styles.compactIntro]}>
          <Text style={styles.introLabel}>THE ORIGINAL 151. ALWAYS WITH YOU.</Text>
          <Text style={styles.edition}>FIELD GUIDE — VOL. 01</Text>
        </View>

        <PokedexFrame>
          <View style={[styles.workspace, compact && styles.stackedWorkspace]}>
            <View style={[styles.visualColumn, !compact && styles.desktopColumn]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>01 / OBSERVE</Text>
                <Text style={styles.sectionCaption}>A CLOSER LOOK.</Text>
              </View>
              <PokemonDisplay pokemon={dex.pokemon} />
              {!compact && controls}
            </View>
            <View style={[styles.dataColumn, !compact && styles.desktopColumn]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>02 / DISCOVER</Text>
                <Text style={styles.sectionCaption}>EVERY DETAIL COUNTS.</Text>
              </View>
              <PokemonDetails
                onOpenVersions={dex.openVersionPicker}
                pokemon={dex.pokemon}
                selectedVersion={dex.selectedVersion}
              />
              {compact && controls}
              <View style={styles.archiveNote}>
                <Text style={styles.noteSymbol}>✳</Text>
                <View style={styles.noteText}>
                  <Text style={styles.noteTitle}>ONE REGION. ENDLESS CURIOSITY.</Text>
                  <Text style={styles.noteBody}>Meet the creatures that started it all.</Text>
                </View>
                <View style={styles.noteArrow}>
                  <Text style={styles.noteArrowText}>↗</Text>
                </View>
              </View>
            </View>
          </View>
        </PokedexFrame>

        <View style={styles.pageFooter}>
          <Text style={styles.footerCopy}>A LITTLE NOSTALGIA. A LOT TO DISCOVER.</Text>
          <Text style={styles.footerMeta}>KANTO / EST. 1996</Text>
        </View>
        <Text style={styles.attribution}>
          An independent fan project. Pokémon © Nintendo / Creatures Inc. / GAME FREAK inc.
        </Text>
      </ScrollView>

      <GameVersionPicker
        onClose={dex.closeVersionPicker}
        onSelect={dex.selectVersion}
        pokemon={dex.pokemon}
        selectedVersion={dex.displayedVersion}
        visible={dex.isVersionPickerOpen}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#f4f1ea', flex: 1 },
  page: { alignItems: 'center', paddingHorizontal: 48, paddingTop: 28, paddingBottom: 24 },
  compactPage: { paddingHorizontal: 14, paddingTop: 16 },
  pageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 1120,
    width: '100%',
  },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  brandIcon: {
    alignItems: 'center',
    borderColor: theme.colors.ink,
    borderRadius: 16,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 26,
  },
  brandBand: { backgroundColor: theme.colors.ink, height: 2, width: '100%' },
  brandCenter: {
    backgroundColor: '#f4f1ea',
    borderColor: theme.colors.ink,
    borderRadius: 4,
    borderWidth: 2,
    height: 8,
    position: 'absolute',
    width: 8,
  },
  brandName: { color: theme.colors.ink, fontSize: 23, fontWeight: '800', letterSpacing: -1.2 },
  brandDot: { color: theme.colors.casing, letterSpacing: 0 },
  brandDivider: { backgroundColor: '#c9c6be', height: 17, marginHorizontal: 8, width: 1 },
  brandSubtitle: {
    color: '#76796f',
    fontFamily: theme.fonts.mono,
    fontSize: 8,
    letterSpacing: 0.8,
  },
  offlineBadge: {
    alignItems: 'center',
    borderColor: '#d1d5c8',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  offlineDot: { backgroundColor: '#64815c', borderRadius: 3, height: 5, width: 5 },
  offlineText: {
    color: '#57614d',
    fontFamily: theme.fonts.monoBold,
    fontSize: 7,
    letterSpacing: 0.5,
  },
  intro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 36,
    maxWidth: 1120,
    width: '100%',
    gap: 12,
  },
  compactIntro: { marginTop: 25 },
  introLabel: {
    color: '#73776f',
    flexShrink: 1,
    fontFamily: theme.fonts.mono,
    fontSize: 8,
    letterSpacing: 1,
  },
  edition: { color: '#73776f', fontFamily: theme.fonts.mono, fontSize: 8, letterSpacing: 0.6 },
  workspace: { alignItems: 'flex-start', flexDirection: 'row', gap: 20 },
  stackedWorkspace: { flexDirection: 'column', gap: 22 },
  visualColumn: { minWidth: 0, width: '100%' },
  dataColumn: { minWidth: 0, width: '100%' },
  desktopColumn: { flex: 1 },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    color: '#62272a',
    fontFamily: theme.fonts.monoBold,
    fontSize: 8,
    letterSpacing: 1,
  },
  sectionCaption: {
    color: '#822c30',
    fontFamily: theme.fonts.mono,
    fontSize: 7,
    letterSpacing: 0.4,
  },
  controls: {
    alignItems: 'center',
    backgroundColor: theme.colors.graphite,
    borderColor: theme.colors.ink,
    borderRadius: 14,
    borderWidth: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
    padding: 14,
    gap: 12,
  },
  narrowControls: { flexWrap: 'wrap', justifyContent: 'center', gap: 22 },
  actionsColumn: { alignItems: 'center', gap: 18 },
  controlReadout: { alignItems: 'center', gap: 4 },
  readoutLabel: { color: '#a5b2a0', fontFamily: theme.fonts.mono, fontSize: 6, letterSpacing: 1 },
  readoutValue: {
    color: '#e0e6d6',
    fontFamily: theme.fonts.monoBold,
    fontSize: 19,
    letterSpacing: -1,
  },
  readoutTotal: {
    color: '#8a978a',
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    letterSpacing: -0.5,
  },
  archiveNote: {
    alignItems: 'center',
    borderColor: '#a82d32',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 11,
    marginTop: 14,
    padding: 16,
  },
  noteSymbol: { color: '#782d2f', fontSize: 29, lineHeight: 34 },
  noteText: { flex: 1, gap: 5 },
  noteTitle: {
    color: '#62272a',
    fontFamily: theme.fonts.monoBold,
    fontSize: 8,
    letterSpacing: 0.4,
  },
  noteBody: { color: '#782d2f', fontFamily: theme.fonts.mono, fontSize: 8, lineHeight: 14 },
  noteArrow: {
    alignItems: 'center',
    borderColor: '#a82d32',
    borderRadius: 20,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  noteArrowText: { color: '#782d2f', fontSize: 17 },
  pageFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 29,
    maxWidth: 1120,
    width: '100%',
  },
  footerCopy: { color: '#6d7466', fontFamily: theme.fonts.mono, fontSize: 8, letterSpacing: 0.7 },
  footerMeta: { color: '#6d7466', fontFamily: theme.fonts.mono, fontSize: 8, letterSpacing: 0.7 },
  attribution: { color: '#8b8e85', fontSize: 9, marginTop: 17, textAlign: 'center' },
});
