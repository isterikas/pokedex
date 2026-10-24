import { parsePokemonDataset } from '../src/data/validatePokemon';

import { makeDataset } from './fixtures';

describe('dataset validation', () => {
  it('accepts a complete, ordered set of 151 records', () => {
    expect(parsePokemonDataset(makeDataset())).toHaveLength(151);
  });

  it('rejects missing, repeated, or unordered National Pokédex numbers', () => {
    expect(() => parsePokemonDataset(makeDataset().slice(1))).toThrow(/151/);
    const repeated = makeDataset();
    repeated[1] = { ...repeated[1], id: 1 };
    expect(() => parsePokemonDataset(repeated)).toThrow(/2/);
    const unordered = makeDataset();
    [unordered[0], unordered[1]] = [unordered[1], unordered[0]];
    expect(() => parsePokemonDataset(unordered)).toThrow(/1/);
  });

  it.each<[string, unknown]>([
    ['name', ''],
    ['species', ''],
    ['heightDecimeters', 0],
    ['heightDecimeters', Number.POSITIVE_INFINITY],
    ['weightHectograms', -1],
    ['weightHectograms', Number.POSITIVE_INFINITY],
    ['types', ['unknown']],
    ['abilities', []],
    ['abilities', [{ name: 'Chlorophyll', isHidden: true }]],
    ['descriptions', { firered: 'An unnormalized\nentry.' }],
  ])('rejects invalid %s data', (field, value) => {
    const data: unknown[] = makeDataset();
    data[0] = { ...makeDataset()[0], [field]: value };
    expect(() => parsePokemonDataset(data)).toThrow(/1/);
  });

  it('requires validated default-game coverage for every Pokémon', () => {
    const data = makeDataset();
    data[150] = { ...data[150], descriptions: { red: 'A Red entry.' } };
    expect(() => parsePokemonDataset(data)).toThrow(/151.*FireRed/);
  });

  it('rejects a mixed sprite generation', () => {
    const data = makeDataset();
    data[150] = { ...data[150], spriteGeneration: 'diamond-pearl' };
    expect(() => parsePokemonDataset(data)).toThrow(/Mixed sprite generations/);
  });
});
