import type { ReactNode } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { theme } from '../constants/theme';

interface PokedexFrameProps {
  children: ReactNode;
}

export function PokedexFrame({ children }: PokedexFrameProps) {
  const compact = useWindowDimensions().width < 650;

  return (
    <View style={styles.device}>
      <View style={[styles.topStrip, compact && styles.compactStrip]}>
        <View style={styles.indicators}>
          <View style={styles.lensRim}>
            <View style={styles.lens}>
              <View style={styles.lensShine} />
            </View>
          </View>
          <View style={styles.statusLights}>
            <View style={[styles.statusLight, styles.redLight]} />
            <View style={[styles.statusLight, styles.yellowLight]} />
            <View style={[styles.statusLight, styles.greenLight]} />
          </View>
        </View>
        <View style={styles.hardwareLabel}>
          <Text style={styles.model}>DEX / GEN. 01</Text>
          <Text style={styles.serial}>PERSONAL FIELD ARCHIVE</Text>
        </View>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.pokeball}
        >
          <View style={styles.pokeballBand} />
          <View style={styles.pokeballCenter} />
        </View>
      </View>

      <View style={[styles.titleRow, compact && styles.compactTitleRow]}>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, compact && styles.compactTitle]}>POKÉDEX OF</Text>
          <Text style={[styles.title, compact && styles.compactTitle]}>
            ANOMALIES<Text style={styles.titleDot}>.</Text>
          </Text>
        </View>
        {!compact && (
          <View style={styles.collectionStamp}>
            <Text style={styles.collectionText}>KANTO</Text>
            <Text style={styles.collectionNumbers}>001—151</Text>
            <Text style={styles.collectionCaption}>ORIGINAL COLLECTION</Text>
          </View>
        )}
      </View>

      <View style={[styles.content, compact && styles.compactContent]}>{children}</View>

      <View style={styles.bottomRim}>
        <View style={styles.screw}>
          <View style={styles.screwSlot} />
        </View>
        <Text style={styles.rimText}>DESIGNED FOR DISCOVERY</Text>
        <View style={styles.speaker}>
          {[0, 1, 2, 3].map((line) => (
            <View key={line} style={styles.speakerLine} />
          ))}
        </View>
        <View style={styles.screw}>
          <View style={styles.screwSlot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  device: {
    backgroundColor: theme.colors.casing,
    borderColor: theme.colors.ink,
    borderRadius: theme.radii.device,
    borderWidth: 3,
    maxWidth: 1120,
    overflow: 'hidden',
    width: '100%',
    boxShadow: '0px 8px 0px #202321',
  },
  topStrip: {
    alignItems: 'center',
    borderBottomColor: theme.colors.ink,
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 32,
    paddingVertical: 18,
  },
  compactStrip: { gap: 12, paddingHorizontal: 18, paddingVertical: 14 },
  indicators: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  lensRim: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.ink,
    borderRadius: 40,
    borderWidth: 2,
    padding: 4,
  },
  lens: {
    backgroundColor: theme.colors.cyan,
    borderColor: theme.colors.ink,
    borderRadius: 30,
    borderWidth: 2,
    height: 42,
    overflow: 'hidden',
    width: 42,
  },
  lensShine: {
    backgroundColor: theme.colors.cyanLight,
    borderRadius: 20,
    height: 15,
    left: 6,
    position: 'absolute',
    top: 5,
    width: 23,
  },
  statusLights: { alignSelf: 'flex-start', flexDirection: 'row', gap: 6, paddingTop: 5 },
  statusLight: {
    borderColor: theme.colors.ink,
    borderRadius: 6,
    borderWidth: 1.5,
    height: 10,
    width: 10,
  },
  redLight: { backgroundColor: '#a9252b' },
  yellowLight: { backgroundColor: '#f6d475' },
  greenLight: { backgroundColor: '#a9d994' },
  hardwareLabel: { flex: 1 },
  model: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  serial: {
    color: '#712a2a',
    fontFamily: theme.fonts.mono,
    fontSize: 7,
    letterSpacing: 0.8,
    marginTop: 3,
  },
  pokeball: {
    backgroundColor: theme.colors.casingLight,
    borderColor: theme.colors.ink,
    borderRadius: 28,
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 44,
  },
  pokeballBand: { backgroundColor: theme.colors.ink, height: 3, width: '100%' },
  pokeballCenter: {
    alignSelf: 'center',
    backgroundColor: theme.colors.casing,
    borderColor: theme.colors.ink,
    borderRadius: 10,
    borderWidth: 3,
    height: 15,
    position: 'absolute',
    width: 15,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 22,
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  compactTitleRow: { paddingBottom: 18, paddingHorizontal: 18, paddingTop: 22 },
  titleBlock: { flexShrink: 1 },
  title: {
    color: theme.colors.ink,
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 45,
  },
  compactTitle: { fontSize: 34, letterSpacing: -1.5, lineHeight: 34 },
  titleDot: { color: theme.colors.paper },
  collectionStamp: {
    alignItems: 'flex-end',
    borderLeftColor: '#aa2b31',
    borderLeftWidth: 1,
    gap: 2,
    paddingLeft: 28,
  },
  collectionText: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.monoBold,
    fontSize: 11,
    letterSpacing: 4,
  },
  collectionNumbers: {
    color: theme.colors.ink,
    fontFamily: theme.fonts.monoBold,
    fontSize: 25,
    letterSpacing: -1.5,
  },
  collectionCaption: {
    color: '#712a2a',
    fontFamily: theme.fonts.mono,
    fontSize: 7,
    letterSpacing: 0.5,
  },
  content: { paddingHorizontal: 24 },
  compactContent: { paddingHorizontal: 12 },
  bottomRim: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  screw: {
    alignItems: 'center',
    backgroundColor: theme.colors.casingDark,
    borderColor: '#792c2d',
    borderRadius: 6,
    borderWidth: 1,
    height: 10,
    justifyContent: 'center',
    width: 10,
  },
  screwSlot: { backgroundColor: '#792c2d', height: 1, transform: [{ rotate: '-45deg' }], width: 5 },
  rimText: {
    color: '#712a2a',
    flex: 1,
    fontFamily: theme.fonts.monoBold,
    fontSize: 7,
    letterSpacing: 1.1,
  },
  speaker: { flexDirection: 'row', gap: 4 },
  speakerLine: {
    backgroundColor: '#a52c31',
    borderRadius: 2,
    height: 14,
    transform: [{ rotate: '25deg' }],
    width: 3,
  },
});
