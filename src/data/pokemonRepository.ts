import data from './pokemon.json';
import { parsePokemonDataset } from './validatePokemon';
import type { Pokemon, PokemonRepository } from '../types/pokemon';

let dataset: readonly Pokemon[] | undefined;

function getDataset(): readonly Pokemon[] {
  dataset ??= parsePokemonDataset(data);
  return dataset;
}

export const pokemonRepository: PokemonRepository = {
  getAll: () => getDataset(),
  getById: (id) => getDataset().find((entry) => entry.id === id),
};
