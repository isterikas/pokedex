import type { Pokemon } from '../src/types/pokemon';

export function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  return {
    id: 1,
    slug: 'bulbasaur',
    name: 'Bulbasaur',
    types: ['grass', 'poison'],
    species: 'Seed Pokémon',
    heightDecimeters: 7,
    weightHectograms: 69,
    abilities: [
      { name: 'Overgrow', isHidden: false },
      { name: 'Chlorophyll', isHidden: true },
    ],
    descriptions: {
      firered: 'A strange seed was planted on its back at birth.',
      red: 'It can go for days without eating a single morsel.',
    },
    spriteGeneration: 'brilliant-diamond-shining-pearl',
    ...overrides,
  };
}

export function makeDataset(): Pokemon[] {
  return Array.from({ length: 151 }, (_, index) =>
    makePokemon({ id: index + 1, slug: `pokemon-${index + 1}` }),
  );
}
