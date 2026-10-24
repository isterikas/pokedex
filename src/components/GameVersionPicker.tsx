import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getAvailableGameVersions } from '../constants/gameVersions';
import { theme } from '../constants/theme';
import type { Pokemon } from '../types/pokemon';

interface GameVersionPickerProps {
  visible: boolean;
  onClose: () => void;
  pokemon: Pokemon;
  selectedVersion: string;
  onSelect: (version: string) => void;
}

export function GameVersionPicker({
  visible,
  onClose,
  pokemon,
  selectedVersion,
  onSelect,
}: GameVersionPickerProps) {
  const versions = getAvailableGameVersions(pokemon);

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close game version selector"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View accessibilityViewIsModal style={styles.panel}>
          <View style={styles.panelHeader}>
            <View style={styles.titleGroup}>
              <Text style={styles.eyebrow}>POKÉDEX ENTRY SOURCE</Text>
              <Text accessibilityRole="header" style={styles.title}>
                Choose a game.
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Close game version selector"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.description}>Explore {pokemon.name}’s entries across the games.</Text>
          <ScrollView contentContainerStyle={styles.versionList}>
            {versions.map((version, index) => {
              const selected = version.id === selectedVersion;
              return (
                <Pressable
                  accessibilityLabel={version.name}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected, selected }}
                  aria-checked={selected}
                  key={version.id}
                  onPress={() => {
                    onSelect(version.id);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.version,
                    selected && styles.selectedVersion,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.versionNumber}>{String(index + 1).padStart(2, '0')}</Text>
                  <Text style={styles.versionName}>{version.name}</Text>
                  <View style={[styles.radio, selected && styles.selectedRadio]}>
                    {selected && <View style={styles.radioCenter} />}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.panelFooter}>
            <View style={styles.statusDot} />
            <Text style={styles.footerText}>{versions.length} AVAILABLE GAME ENTRIES</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: '#202321b8',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  panel: {
    backgroundColor: theme.colors.paper,
    borderColor: theme.colors.ink,
    borderRadius: 18,
    borderWidth: 3,
    maxHeight: '85%',
    maxWidth: 480,
    padding: 22,
    width: '100%',
    boxShadow: '0px 7px 0px #202321',
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  titleGroup: { flex: 1 },
  eyebrow: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.mono,
    fontSize: 8,
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  title: { color: theme.colors.ink, fontSize: 29, fontWeight: '800', letterSpacing: -1.1 },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#eeeae1',
    borderColor: theme.colors.ink,
    borderRadius: 24,
    borderWidth: 1.5,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  closeText: { color: theme.colors.ink, fontSize: 26, lineHeight: 29 },
  description: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  versionList: { gap: 7, paddingBottom: 2 },
  version: {
    alignItems: 'center',
    backgroundColor: '#f0f0e8',
    borderColor: '#d9dcd0',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  selectedVersion: { backgroundColor: theme.colors.lcd, borderColor: '#7b9863' },
  versionNumber: { color: '#89907f', fontFamily: theme.fonts.mono, fontSize: 9 },
  versionName: { color: theme.colors.ink, flex: 1, fontFamily: theme.fonts.monoBold, fontSize: 11 },
  radio: {
    alignItems: 'center',
    borderColor: '#9ca58f',
    borderRadius: 10,
    borderWidth: 1.5,
    height: 17,
    justifyContent: 'center',
    width: 17,
  },
  selectedRadio: { borderColor: theme.colors.lcdDark },
  radioCenter: { backgroundColor: theme.colors.lcdDark, borderRadius: 4, height: 7, width: 7 },
  pressed: { opacity: 0.65 },
  panelFooter: { alignItems: 'center', flexDirection: 'row', gap: 6, paddingTop: 19 },
  statusDot: { backgroundColor: '#8caa69', borderRadius: 3, height: 5, width: 5 },
  footerText: {
    color: theme.colors.muted,
    fontFamily: theme.fonts.mono,
    fontSize: 8,
    letterSpacing: 0.4,
  },
});
