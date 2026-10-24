import { join } from 'node:path';
import type { Pokemon } from '../src/types/pokemon';
import { isPokemonType, parsePokemonDataset } from '../src/data/validatePokemon';
import { normalizeFlavorText } from '../src/utils/normalizeFlavorText';
import {
  array,
  getApiResource,
  getSprite,
  mapConcurrent,
  namedResource,
  number,
  object,
  pokemonDbSlug,
  PROJECT_ROOT,
  SPRITE_GENERATIONS,
  string,
  TOTAL_POKEMON,
  writeAtomic,
  type SpriteValidation,
} from './lib/pipeline';

function englishField(entries: unknown, field: string, context: string): string {
  for (const item of array(entries, context)) {
    const entry = object(item, context);
    if (namedResource(entry.language, context) === 'en') return string(entry[field], context);
  }
  throw new Error(`${context}: English ${field} is missing.`);
}

async function generate(): Promise<void> {
  console.log('Fetching/caching Pokémon and species records 1–151 (6 workers).');
  const ids = Array.from({ length: TOTAL_POKEMON }, (_, index) => index + 1);
  const sources = await mapConcurrent(ids, async (id) => {
    // Sequential per worker keeps the total number of in-flight requests bounded.
    const pokemon = object(await getApiResource('pokemon', id), `pokemon/${id}`);
    const species = object(await getApiResource('pokemon-species', id), `pokemon-species/${id}`);
    if (pokemon.id !== id || species.id !== id || pokemon.is_default !== true) {
      throw new Error(`Unexpected identity or nonstandard form for #${id}.`);
    }
    return { id, pokemon, species };
  });
  const abilitySlugs = [
    ...new Set(
      sources.flatMap(({ pokemon, id }) =>
        array(pokemon.abilities, `#${id} abilities`).map((value) =>
          namedResource(object(value, 'ability').ability, 'ability'),
        ),
      ),
    ),
  ].sort();
  const abilityNames = new Map(
    await mapConcurrent(abilitySlugs, async (slug) => {
      const ability = object(await getApiResource('ability', slug), `ability/${slug}`);
      return [slug, englishField(ability.names, 'name', `ability/${slug}`)] as const;
    }),
  );
  const records: Pokemon[] = sources.map(({ id, pokemon, species }) => {
    const descriptions: Record<string, string> = {};
    for (const value of array(species.flavor_text_entries, `#${id} descriptions`)) {
      const entry = object(value, `#${id} description`);
      if (namedResource(entry.language, 'description language') !== 'en') continue;
      const version = namedResource(entry.version, 'description version');
      const text = normalizeFlavorText(string(entry.flavor_text, `#${id} ${version} description`));
      if (!text) throw new Error(`Empty English description: #${id}, ${version}.`);
      if (descriptions[version] && descriptions[version] !== text) {
        throw new Error(`Conflicting English descriptions: #${id}, ${version}.`);
      }
      descriptions[version] = text;
    }
    const types = array(pokemon.types, `#${id} types`).map((value) => {
      const type = namedResource(object(value, 'type').type, 'type');
      if (!isPokemonType(type)) throw new Error(`Invalid type ${type} for #${id}.`);
      return type;
    });
    const abilities = array(pokemon.abilities, `#${id} abilities`).map((value) => {
      const entry = object(value, `#${id} ability`);
      const slug = namedResource(entry.ability, 'ability name');
      const name = abilityNames.get(slug);
      if (!name || typeof entry.is_hidden !== 'boolean')
        throw new Error(`Invalid ability for #${id}.`);
      return { name, isHidden: entry.is_hidden };
    });
    return {
      id,
      slug: string(pokemon.name, `#${id} slug`),
      name: englishField(species.names, 'name', `#${id} name`),
      species: englishField(species.genera, 'genus', `#${id} species`),
      heightDecimeters: number(pokemon.height, `#${id} height`),
      weightHectograms: number(pokemon.weight, `#${id} weight`),
      types,
      abilities,
      descriptions,
      spriteGeneration: '',
    };
  });

  const validationSets: {
    generation: string;
    successful: number;
    missing: number;
    sprites: SpriteValidation[];
  }[] = [];
  let selectedGeneration = '';
  for (const generation of SPRITE_GENERATIONS) {
    console.log(`Validating all 151 ${generation} normal front sprites.`);
    const downloads = await mapConcurrent(records, ({ id, slug }) =>
      getSprite(generation, id, pokemonDbSlug(id, slug)),
    );
    const sprites = downloads.map(({ validation }) => validation);
    const missing = sprites.filter((sprite) => sprite.status === 'missing').length;
    const report = { generation, successful: TOTAL_POKEMON - missing, missing, sprites };
    validationSets.push(report);
    await writeAtomic(
      join(PROJECT_ROOT, 'reports', `sprites-${generation}.json`),
      `${JSON.stringify(report, null, 2)}\n`,
    );
    console.log(
      `${generation}: ${report.successful}/151 valid PNG files; ${missing} missing or invalid.`,
    );
    if (missing) continue;
    selectedGeneration = generation;
    for (const { validation, bytes } of downloads) {
      if (!bytes) throw new Error(`Validated sprite has no bytes: #${validation.id}.`);
      await writeAtomic(
        join(PROJECT_ROOT, 'src/assets/sprites', `${String(validation.id).padStart(4, '0')}.png`),
        bytes,
      );
    }
    break;
  }
  if (!selectedGeneration) {
    throw new Error(
      'Neither complete sprite set is available. See reports/sprites-*.json; no mixed set was generated.',
    );
  }
  records.forEach((record) => {
    record.spriteGeneration = selectedGeneration;
  });
  parsePokemonDataset(records);
  const manifest = [
    "import type { ImageProps } from 'expo-image';",
    '',
    "export const spriteManifest: Record<number, ImageProps['source']> = {",
    ...records.map(
      ({ id }) => `  ${id}: require('../assets/sprites/${String(id).padStart(4, '0')}.png'),`,
    ),
    '};',
    '',
  ].join('\n');
  const versionCoverage: Record<string, number> = {};
  records.forEach(({ descriptions }) =>
    Object.keys(descriptions).forEach((version) => {
      versionCoverage[version] = (versionCoverage[version] ?? 0) + 1;
    }),
  );
  await writeAtomic(
    join(PROJECT_ROOT, 'src/data/pokemon.json'),
    `${JSON.stringify(records, null, 2)}\n`,
  );
  await writeAtomic(join(PROJECT_ROOT, 'src/data/spriteManifest.ts'), manifest);
  const report = {
    schemaVersion: 1,
    totalPokemon: records.length,
    ids: { first: 1, last: 151 },
    selectedSpriteGeneration: selectedGeneration,
    defaultDescriptionVersion: 'firered',
    defaultDescriptionCoverage: versionCoverage.firered ?? 0,
    versionCoverage,
    uniqueEnglishAbilities: abilityNames.size,
    sources: {
      metadata: 'https://pokeapi.co/api/v2/pokemon/{id}/',
      speciesAndDescriptions: 'https://pokeapi.co/api/v2/pokemon-species/{id}/',
      abilityDisplayNames: 'https://pokeapi.co/api/v2/ability/{slug}/',
      spriteReference: 'https://pokemondb.net/sprites',
      sprites: `https://img.pokemondb.net/sprites/${selectedGeneration}/normal/{slug}.png`,
    },
    namingCases: records
      .filter(({ id }) => [29, 32, 83, 122].includes(id))
      .map(({ id, name, slug }) => ({
        id,
        name,
        apiSlug: slug,
        spriteSlug: pokemonDbSlug(id, slug),
      })),
    validationSets: validationSets.map(({ generation, successful, missing }) => ({
      generation,
      successful,
      missing,
    })),
    validation: {
      sequentialIds: true,
      requiredFields: true,
      uniformSpriteGeneration: true,
      allPngs: true,
    },
    cachePolicy:
      'Reuse validated local API and sprite responses. Use --refresh to revalidate upstream; 404/410 results are cached.',
    rights:
      'Pokémon images, names, and game text remain the property of their respective owners. No redistribution permission is implied. Generated images, game text, and raw API cache are excluded from Git.',
  };
  await writeAtomic(
    join(PROJECT_ROOT, 'reports/data-completeness.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  console.log(
    `Generated ${records.length} records, ${records.length} sprites, and a static manifest. FireRed coverage: ${report.defaultDescriptionCoverage}/151.`,
  );
}

generate().catch((error: unknown) => {
  console.error('Pokémon data generation failed:', error);
  process.exitCode = 1;
});
