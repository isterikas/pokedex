import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react-native';

import { ActionButtons } from '../src/components/ActionButtons';
import { DirectionPad } from '../src/components/DirectionPad';
import { GameVersionPicker } from '../src/components/GameVersionPicker';
import { PokemonDetails } from '../src/components/PokemonDetails';
import { TypeBadge } from '../src/components/TypeBadge';

import { makePokemon } from './fixtures';

describe('Pokémon information', () => {
  it('renders the selected Pokémon, both types, measurements, and labeled hidden ability', async () => {
    await render(<PokemonDetails pokemon={makePokemon()} selectedVersion="firered" />);

    expect(screen.getByRole('header', { name: 'Bulbasaur' })).toBeTruthy();
    expect(screen.getByText('#0001')).toBeTruthy();
    expect(screen.getByText('GRASS')).toBeTruthy();
    expect(screen.getByText('POISON')).toBeTruthy();
    expect(screen.getByText('Seed Pokémon')).toBeTruthy();
    expect(screen.getByText('0.7 m (2′04″)')).toBeTruthy();
    expect(screen.getByText('6.9 kg (15.2 lbs)')).toBeTruthy();
    expect(screen.getByText('Overgrow')).toBeTruthy();
    expect(screen.getByText('HIDDEN ABILITY')).toBeTruthy();
    expect(screen.getByText('Chlorophyll')).toBeTruthy();
    expect(screen.getByText('FireRed')).toBeTruthy();
    expect(screen.getByText(makePokemon().descriptions.firered)).toBeTruthy();
  });

  it('renders a single type without introducing a second badge', async () => {
    await render(<TypeBadge type="fire" />);
    expect(screen.getByText('FIRE')).toBeTruthy();
    expect(screen.queryByText('POISON')).toBeNull();
  });

  it('identifies the actual source when the selected game has no entry', async () => {
    await render(<PokemonDetails pokemon={makePokemon()} selectedVersion="diamond" />);
    expect(screen.getByText('Entry unavailable in Diamond. Showing FireRed.')).toBeTruthy();
    expect(screen.getByText(makePokemon().descriptions.firered)).toBeTruthy();
  });

  it('retains a long description in a scrollable content area', async () => {
    const description = 'This is a long locally bundled Pokédex entry. '.repeat(70).trim();
    await render(
      <PokemonDetails
        pokemon={makePokemon({ descriptions: { firered: description } })}
        selectedVersion="firered"
      />,
    );
    const scrollArea = screen.getByLabelText('Pokédex description');
    expect(within(scrollArea).getByText(description)).toBeTruthy();
  });
});

describe('Pokédex controls', () => {
  it.each<[string, number]>([
    ['Previous Pokémon', -1],
    ['Next Pokémon', 1],
    ['Jump forward 10 Pokémon', 10],
    ['Jump backward 10 Pokémon', -10],
  ])('exposes the %s control and requests the correct movement', async (label, delta) => {
    const onNavigate = jest.fn();
    await render(<DirectionPad currentId={25} maxId={151} onNavigate={onNavigate} />);
    await fireEvent.press(screen.getByRole('button', { name: label }));
    expect(onNavigate).toHaveBeenCalledWith(delta);
  });

  it('disables backward movement at the first Pokémon and forward movement at the last', async () => {
    const onNavigate = jest.fn();
    const { rerender } = await render(
      <DirectionPad currentId={1} maxId={151} onNavigate={onNavigate} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Previous Pokémon' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Jump backward 10 Pokémon' }));
    expect(onNavigate).not.toHaveBeenCalled();

    await rerender(<DirectionPad currentId={151} maxId={151} onNavigate={onNavigate} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Next Pokémon' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Jump forward 10 Pokémon' }));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('connects the action buttons to reset and game selection', async () => {
    const onReset = jest.fn();
    const onOpenVersions = jest.fn();
    await render(<ActionButtons onReset={onReset} onOpenVersions={onOpenVersions} />);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Reset to Bulbasaur, Pokémon number 1' }),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Choose Pokédex game version' }));
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onOpenVersions).toHaveBeenCalledTimes(1);
  });
});

describe('game version picker', () => {
  it('offers available games, identifies the selection, and closes after choosing', async () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    await render(
      <GameVersionPicker
        pokemon={makePokemon()}
        selectedVersion="firered"
        visible
        onSelect={onSelect}
        onClose={onClose}
      />,
    );
    expect(screen.getByRole('radio', { name: 'FireRed', selected: true })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Diamond' })).toBeNull();
    await fireEvent.press(screen.getByRole('radio', { name: 'Red' }));
    expect(onSelect).toHaveBeenCalledWith('red');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('updates a controlled description immediately without changing the Pokémon', async () => {
    function DescriptionSelection() {
      const [version, setVersion] = useState('firered');
      const [visible, setVisible] = useState(false);
      const pokemon = makePokemon();
      return (
        <>
          <PokemonDetails
            pokemon={pokemon}
            selectedVersion={version}
            onOpenVersions={() => setVisible(true)}
          />
          <GameVersionPicker
            pokemon={pokemon}
            selectedVersion={version}
            visible={visible}
            onSelect={setVersion}
            onClose={() => setVisible(false)}
          />
        </>
      );
    }
    await render(<DescriptionSelection />);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Choose description game, current game FireRed' }),
    );
    await fireEvent.press(screen.getByRole('radio', { name: 'Red' }));
    expect(screen.getByText(makePokemon().descriptions.red)).toBeTruthy();
    expect(screen.queryByText(makePokemon().descriptions.firered)).toBeNull();
    expect(screen.getByRole('header', { name: 'Bulbasaur' })).toBeTruthy();
    expect(screen.getByText('#0001')).toBeTruthy();
  });
});
