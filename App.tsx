import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono/400Regular';
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono/700Bold';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PokedexScreen } from './src/features/pokedex/PokedexScreen';

class PokedexErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Pokédex could not open its local archive.', error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <View style={styles.loading}>
          <Text style={styles.errorTitle}>The archive needs a repair.</Text>
          <Text style={styles.errorText}>
            The bundled Pokémon data could not be read. Generate and validate the local dataset,
            then rebuild the application.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [loaded, error] = useFonts({
    SpaceMono: SpaceMono_400Regular,
    SpaceMonoBold: SpaceMono_700Bold,
  });

  if (!loaded && !error) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator accessibilityLabel="Opening local Pokédex" color="#ed4245" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <PokedexErrorBoundary>
        <PokedexScreen />
      </PokedexErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: '#f4f1ea',
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: { color: '#202321', fontSize: 24, fontWeight: '700', marginBottom: 12 },
  errorText: { color: '#6c716b', fontSize: 16, lineHeight: 25, maxWidth: 440, textAlign: 'center' },
});
