import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parsePokemonDataset } from '../src/data/validatePokemon';
import { PROJECT_ROOT, TOTAL_POKEMON } from './lib/pipeline';

async function validate(): Promise<void> {
  const input: unknown = JSON.parse(
    await readFile(join(PROJECT_ROOT, 'src/data/pokemon.json'), 'utf8'),
  );
  const pokemon = parsePokemonDataset(input);
  const manifest = await readFile(join(PROJECT_ROOT, 'src/data/spriteManifest.ts'), 'utf8');
  const entries = [
    ...manifest.matchAll(/\s+(\d+): require\('\.\.\/assets\/sprites\/(\d{4})\.png'\),/g),
  ];
  if (
    entries.length !== TOTAL_POKEMON ||
    entries.some((match, index) => Number(match[1]) !== index + 1 || Number(match[2]) !== index + 1)
  ) {
    throw new Error(
      'Static sprite manifest must contain exactly IDs 1–151 in National Pokédex order.',
    );
  }
  console.log(
    `Validated ${pokemon.length} complete, sequential records; FireRed 151/151; one sprite generation; 151 static image references.`,
  );
}

validate().catch((error: unknown) => {
  console.error('Pokémon dataset validation failed:', error);
  process.exitCode = 1;
});
