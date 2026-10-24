import { POKEMON_TYPES, type Pokemon, type PokemonType } from '../types/pokemon';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isPokemonType(value: unknown): value is PokemonType {
  return typeof value === 'string' && POKEMON_TYPES.some((type) => type === value);
}

function isPokemon(value: unknown): value is Pokemon {
  if (!isRecord(value)) return false;
  return (
    Number.isInteger(value.id) &&
    Number(value.id) >= 1 &&
    Number(value.id) <= 151 &&
    typeof value.slug === 'string' &&
    /^[a-z0-9-]+$/.test(value.slug) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    typeof value.species === 'string' &&
    value.species.trim().length > 0 &&
    typeof value.heightDecimeters === 'number' &&
    Number.isFinite(value.heightDecimeters) &&
    value.heightDecimeters > 0 &&
    typeof value.weightHectograms === 'number' &&
    Number.isFinite(value.weightHectograms) &&
    value.weightHectograms > 0 &&
    Array.isArray(value.types) &&
    value.types.length >= 1 &&
    value.types.length <= 2 &&
    value.types.every(isPokemonType) &&
    Array.isArray(value.abilities) &&
    value.abilities.length > 0 &&
    value.abilities.every(
      (ability: unknown) =>
        isRecord(ability) &&
        typeof ability.name === 'string' &&
        ability.name.trim().length > 0 &&
        typeof ability.isHidden === 'boolean',
    ) &&
    value.abilities.some((ability: unknown) => isRecord(ability) && ability.isHidden === false) &&
    isRecord(value.descriptions) &&
    Object.keys(value.descriptions).length > 0 &&
    Object.entries(value.descriptions).every(
      ([version, text]) =>
        /^[a-z0-9-]+$/.test(version) &&
        typeof text === 'string' &&
        text.trim().length > 0 &&
        !/[\n\r\f]/.test(text),
    ) &&
    typeof value.spriteGeneration === 'string' &&
    value.spriteGeneration.length > 0
  );
}

export function parsePokemonDataset(value: unknown): Pokemon[] {
  if (!Array.isArray(value) || value.length !== 151) {
    throw new Error('Pokémon data must contain exactly 151 records. Run npm run generate.');
  }
  const pokemon: Pokemon[] = [];
  for (const [index, entry] of value.entries()) {
    if (!isPokemon(entry) || entry.id !== index + 1) {
      throw new Error(`Invalid Pokémon record at National Pokédex number ${index + 1}.`);
    }
    if (!entry.descriptions.firered?.trim()) {
      throw new Error(`Pokémon #${entry.id} has no validated FireRed description.`);
    }
    pokemon.push(entry);
  }
  if (new Set(pokemon.map((entry) => entry.spriteGeneration)).size !== 1) {
    throw new Error('Mixed sprite generations are not allowed.');
  }
  return pokemon;
}
