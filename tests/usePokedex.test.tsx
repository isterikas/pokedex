import { act, fireEvent, render, renderHook, screen } from '@testing-library/react-native';

import { ActionButtons } from '../src/components/ActionButtons';
import { DirectionPad } from '../src/components/DirectionPad';
import { GameVersionPicker } from '../src/components/GameVersionPicker';
import { PokemonDetails } from '../src/components/PokemonDetails';
import { usePokedex } from '../src/features/pokedex/usePokedex';
import type { PokemonRepository } from '../src/types/pokemon';

import { makePokemon } from './fixtures';

function PokedexControls() {
  const pokedex = usePokedex();
  return (
    <>
      <PokemonDetails pokemon={pokedex.pokemon} selectedVersion={pokedex.selectedVersion} />
      <DirectionPad
        currentId={pokedex.currentId}
        maxId={pokedex.total}
        onNavigate={pokedex.navigate}
      />
      <ActionButtons onReset={pokedex.reset} onOpenVersions={pokedex.openVersionPicker} />
      <GameVersionPicker
        pokemon={pokedex.pokemon}
        selectedVersion={pokedex.displayedVersion}
        visible={pokedex.isVersionPickerOpen}
        onClose={pokedex.closeVersionPicker}
        onSelect={pokedex.selectVersion}
      />
    </>
  );
}

describe('Pokédex state integration', () => {
  it('starts at Bulbasaur and traverses every bundled record without requesting the network', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Offline'));
    try {
      const { result } = await renderHook(() => usePokedex());
      expect(result.current.currentId).toBe(1);
      expect(result.current.pokemon.name).toBe('Bulbasaur');
      expect(result.current.selectedVersion).toBe('firered');
      for (let id = 2; id <= 151; id++) {
        await act(() => result.current.navigate(1));
        expect(result.current.pokemon.id).toBe(id);
        expect(result.current.pokemon.descriptions.firered).toBeTruthy();
      }
      await act(() => result.current.navigate(1));
      expect(result.current.currentId).toBe(151);
      expect(result.current.pokemon.name).toBe('Mew');
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      fetchSpy.mockRestore();
    }
  });

  it('updates the rendered Pokémon through direction controls and resets to #0001', async () => {
    await render(<PokedexControls />);
    await fireEvent.press(screen.getByRole('button', { name: 'Next Pokémon' }));
    expect(screen.getByRole('header', { name: 'Ivysaur' })).toBeTruthy();
    expect(screen.getByText('#0002')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Jump forward 10 Pokémon' }));
    expect(screen.getByRole('header', { name: 'Butterfree' })).toBeTruthy();
    expect(screen.getByText('#0012')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Jump backward 10 Pokémon' }));
    expect(screen.getByText('#0002')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Previous Pokémon' }));
    expect(screen.getByText('#0001')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Jump forward 10 Pokémon' }));
    await fireEvent.press(
      screen.getByRole('button', { name: 'Reset to Bulbasaur, Pokémon number 1' }),
    );
    expect(screen.getByRole('header', { name: 'Bulbasaur' })).toBeTruthy();
    expect(screen.getByText('#0001')).toBeTruthy();
  });

  it('retains the preferred game while truthfully exposing a fallback for another Pokémon', async () => {
    const pokemon = [
      makePokemon(),
      makePokemon({
        id: 2,
        name: 'Ivysaur',
        descriptions: { firered: 'An Ivysaur FireRed entry.' },
      }),
    ];
    const repository: PokemonRepository = {
      getAll: () => pokemon,
      getById: (id) => pokemon.find((entry) => entry.id === id),
    };
    const { result } = await renderHook(() => usePokedex(repository));

    await act(() => result.current.selectVersion('red'));
    expect(result.current.displayedVersion).toBe('red');
    await act(() => result.current.navigate(1));
    expect(result.current.selectedVersion).toBe('red');
    expect(result.current.displayedVersion).toBe('firered');
    await act(() => result.current.navigate(-1));
    expect(result.current.displayedVersion).toBe('red');

    await act(() => result.current.openVersionPicker());
    await act(() => result.current.selectVersion('unavailable-game'));
    expect(result.current.selectedVersion).toBe('red');
    expect(result.current.isVersionPickerOpen).toBe(true);
  });

  it('selects a game through the real hook without changing the Pokémon', async () => {
    await render(<PokedexControls />);
    await fireEvent.press(screen.getByRole('button', { name: 'Choose Pokédex game version' }));
    await fireEvent.press(screen.getByRole('radio', { name: 'Red' }));
    expect(screen.getByRole('header', { name: 'Bulbasaur' })).toBeTruthy();
    expect(screen.getByText('#0001')).toBeTruthy();
    expect(screen.getByText('Red')).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Red' })).toBeNull();
  });
});
