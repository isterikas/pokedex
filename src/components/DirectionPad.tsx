import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { theme } from '../constants/theme';

interface DirectionPadProps {
  onNavigate: (delta: number) => void;
  currentId: number;
  maxId: number;
}

interface DirectionButtonProps {
  label: string;
  disabled: boolean;
  onPress: () => void;
  rotation: `${number}deg`;
  style: ViewStyle;
}

function DirectionButton({ label, disabled, onPress, rotation, style }: DirectionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressedButton]}
    >
      <View
        style={[
          styles.triangle,
          { transform: [{ rotate: rotation }] },
          disabled && styles.disabledArrow,
        ]}
      />
    </Pressable>
  );
}

export function DirectionPad({ onNavigate, currentId, maxId }: DirectionPadProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pad}>
        <View style={styles.horizontalCross} />
        <View style={styles.verticalCross} />
        <DirectionButton
          disabled={currentId >= maxId}
          label="Jump forward 10 Pokémon"
          onPress={() => onNavigate(10)}
          rotation="0deg"
          style={styles.up}
        />
        <DirectionButton
          disabled={currentId <= 1}
          label="Previous Pokémon"
          onPress={() => onNavigate(-1)}
          rotation="-90deg"
          style={styles.left}
        />
        <View style={styles.center}>
          <View style={styles.centerCircle} />
        </View>
        <DirectionButton
          disabled={currentId >= maxId}
          label="Next Pokémon"
          onPress={() => onNavigate(1)}
          rotation="90deg"
          style={styles.right}
        />
        <DirectionButton
          disabled={currentId <= 1}
          label="Jump backward 10 Pokémon"
          onPress={() => onNavigate(-10)}
          rotation="180deg"
          style={styles.down}
        />
      </View>
      <Text style={styles.help}>← → BROWSE · ↑ ↓ JUMP 10</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', gap: 12 },
  pad: { height: 138, width: 138 },
  horizontalCross: {
    backgroundColor: theme.colors.ink,
    borderRadius: 5,
    height: 48,
    left: 0,
    position: 'absolute',
    top: 45,
    width: 138,
  },
  verticalCross: {
    backgroundColor: theme.colors.ink,
    borderRadius: 5,
    height: 138,
    left: 45,
    position: 'absolute',
    top: 0,
    width: 48,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.control,
    borderColor: theme.colors.ink,
    borderRadius: 5,
    borderWidth: 2,
    height: 48,
    justifyContent: 'center',
    position: 'absolute',
    width: 48,
  },
  pressedButton: { backgroundColor: '#646e6d' },
  up: { left: 45, top: 0 },
  left: { left: 0, top: 45 },
  right: { right: 0, top: 45 },
  down: { bottom: 0, left: 45 },
  center: {
    alignItems: 'center',
    backgroundColor: theme.colors.control,
    height: 44,
    justifyContent: 'center',
    left: 47,
    position: 'absolute',
    top: 47,
    width: 44,
  },
  centerCircle: { borderColor: '#313a39', borderRadius: 12, borderWidth: 1, height: 17, width: 17 },
  triangle: {
    borderBottomColor: '#e7e8dd',
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderLeftWidth: 5,
    borderRightColor: 'transparent',
    borderRightWidth: 5,
    height: 0,
    width: 0,
  },
  disabledArrow: { opacity: 0.25 },
  help: { color: '#a8b0aa', fontFamily: theme.fonts.mono, fontSize: 7, letterSpacing: 0.2 },
});
