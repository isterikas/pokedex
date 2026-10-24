import { readFileSync } from 'node:fs';
import path from 'node:path';

import { DEFAULT_GAME_VERSION } from '../src/constants/gameVersions';
import data from '../src/data/pokemon.json';
import { spriteManifest } from '../src/data/spriteManifest';
import { parsePokemonDataset } from '../src/data/validatePokemon';
import { POKEMON_TYPES } from '../src/types/pokemon';
import { normalizeFlavorText } from '../src/utils/normalizeFlavorText';

describe('generated offline bundle', () => {
  const pokemon = parsePokemonDataset(data);

  it('contains exactly the original 151 records in National Pokédex order', () => {
    expect(pokemon).toHaveLength(151);
    expect(pokemon.map((entry) => entry.id)).toEqual(
      Array.from({ length: 151 }, (_, index) => index + 1),
    );
    expect(pokemon[0].name).toBe('Bulbasaur');
    expect(pokemon[150].name).toBe('Mew');
  });

  it('preserves official display names for irregular API slugs', () => {
    expect(pokemon.find((entry) => entry.id === 29)?.name).toBe('Nidoran♀');
    expect(pokemon.find((entry) => entry.id === 32)?.name).toBe('Nidoran♂');
    expect(pokemon.find((entry) => entry.id === 83)?.name).toMatch(/^Farfetch[’']d$/);
    expect(pokemon.find((entry) => entry.id === 122)?.name).toBe('Mr. Mime');
  });

  it('has complete typed metadata and a normalized default-game entry for every Pokémon', () => {
    for (const entry of pokemon) {
      expect(entry.name.trim()).not.toBe('');
      expect(entry.species.trim()).not.toBe('');
      expect(entry.types.length).toBeGreaterThanOrEqual(1);
      expect(entry.types.length).toBeLessThanOrEqual(2);
      expect(entry.types.every((type) => POKEMON_TYPES.includes(type))).toBe(true);
      expect(entry.heightDecimeters).toBeGreaterThan(0);
      expect(Number.isFinite(entry.heightDecimeters)).toBe(true);
      expect(entry.weightHectograms).toBeGreaterThan(0);
      expect(Number.isFinite(entry.weightHectograms)).toBe(true);
      expect(entry.abilities.some((ability) => !ability.isHidden)).toBe(true);
      expect(entry.abilities.every((ability) => ability.name.trim().length > 0)).toBe(true);
      expect(entry.descriptions[DEFAULT_GAME_VERSION]?.trim().length).toBeGreaterThan(0);
      for (const [version, description] of Object.entries(entry.descriptions)) {
        expect(version).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        expect(description).toBe(normalizeFlavorText(description));
        expect(description.length).toBeGreaterThan(0);
      }
    }
  });

  it('contains one consistent sprite generation and a bundled PNG for every record', () => {
    expect(new Set(pokemon.map((entry) => entry.spriteGeneration)).size).toBe(1);
    expect(Object.keys(spriteManifest)).toHaveLength(151);
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    for (const entry of pokemon) {
      expect(spriteManifest[entry.id]).toBeTruthy();
      const filename = `${String(entry.id).padStart(4, '0')}.png`;
      const bytes = readFileSync(path.join(__dirname, '../src/assets/sprites', filename));
      expect(bytes.length).toBeGreaterThan(24);
      expect(bytes.subarray(0, 8)).toEqual(pngSignature);
      expect(bytes.readUInt32BE(16)).toBeGreaterThan(0);
      expect(bytes.readUInt32BE(20)).toBeGreaterThan(0);
    }
  });
});
