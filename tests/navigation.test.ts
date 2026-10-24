import { clampPokemonId } from '../src/features/pokedex/usePokedex';

describe('Pokémon navigation', () => {
  it.each<[number, number, number]>([
    [25, -1, 24],
    [25, 1, 26],
    [25, 10, 35],
    [25, -10, 15],
    [1, -1, 1],
    [1, -10, 1],
    [151, 1, 151],
    [151, 10, 151],
    [146, 10, 151],
    [6, -10, 1],
  ])('moves from #%i by %i to #%i', (currentId, delta, expected) => {
    expect(clampPokemonId(currentId, delta)).toBe(expected);
  });

  it('respects the repository boundary for a smaller injected dataset', () => {
    expect(clampPokemonId(3, 10, 8)).toBe(8);
    expect(clampPokemonId(3, -10, 8)).toBe(1);
  });
});
