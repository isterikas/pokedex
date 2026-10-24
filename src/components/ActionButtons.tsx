import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';

interface ActionButtonsProps {
  onReset: () => void;
  onOpenVersions: () => void;
}

export function ActionButtons({ onReset, onOpenVersions }: ActionButtonsProps) {
  return (
    <View style={styles.actions}>
      <View style={styles.action}>
        <Pressable
          accessibilityLabel="Reset to Bulbasaur, Pokémon number 1"
          accessibilityRole="button"
          onPress={onReset}
          style={({ pressed }) => [styles.buttonRim, pressed && styles.pressed]}
        >
          <View style={[styles.button, styles.redButton]}>
            <View style={[styles.xStroke, styles.xStrokeLeft]} />
            <View style={[styles.xStroke, styles.xStrokeRight]} />
          </View>
        </Pressable>
        <Text style={styles.label}>RESET</Text>
      </View>
      <View style={styles.action}>
        <Pressable
          accessibilityLabel="Choose Pokédex game version"
          accessibilityRole="button"
          onPress={onOpenVersions}
          style={({ pressed }) => [styles.buttonRim, pressed && styles.pressed]}
        >
          <View style={[styles.button, styles.greenButton]}>
            <View style={styles.check} />
          </View>
        </Pressable>
        <Text style={styles.label}>VERSION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: 'center', flexDirection: 'row', gap: 17 },
  action: { alignItems: 'center', gap: 10 },
  buttonRim: {
    backgroundColor: '#222a2b',
    borderColor: '#1c2223',
    borderRadius: 40,
    borderWidth: 2,
    padding: 5,
  },
  button: {
    alignItems: 'center',
    borderColor: theme.colors.ink,
    borderRadius: 30,
    borderWidth: 2,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  redButton: { backgroundColor: '#f07775' },
  greenButton: { backgroundColor: '#b3d89c' },
  pressed: { opacity: 0.75, transform: [{ translateY: 2 }] },
  xStroke: {
    backgroundColor: '#603a36',
    borderRadius: 2,
    height: 4,
    position: 'absolute',
    width: 21,
  },
  xStrokeLeft: { transform: [{ rotate: '45deg' }] },
  xStrokeRight: { transform: [{ rotate: '-45deg' }] },
  check: {
    borderBottomColor: '#3f5733',
    borderBottomWidth: 4,
    borderLeftColor: '#3f5733',
    borderLeftWidth: 4,
    height: 11,
    marginTop: -4,
    transform: [{ rotate: '-45deg' }],
    width: 20,
  },
  label: { color: '#bdc5bb', fontFamily: theme.fonts.monoBold, fontSize: 8, letterSpacing: 1.2 },
});
