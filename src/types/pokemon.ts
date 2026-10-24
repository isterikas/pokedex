export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export interface Pokemon {
  id: number;
  slug: string;
  name: string;
  types: PokemonType[];
  species: string;
  heightDecimeters: number;
  weightHectograms: number;
  abilities: { name: string; isHidden: boolean }[];
  descriptions: Record<string, string>;
  spriteGeneration: string;
}

export interface PokemonRepository {
  getAll(): readonly Pokemon[];
  getById(id: number): Pokemon | undefined;
}
