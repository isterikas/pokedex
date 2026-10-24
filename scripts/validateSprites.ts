import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parsePokemonDataset } from '../src/data/validatePokemon';
import { array, object, PROJECT_ROOT, string, validatePng } from './lib/pipeline';

async function validate(): Promise<void> {
  const data: unknown = JSON.parse(
    await readFile(join(PROJECT_ROOT, 'src/data/pokemon.json'), 'utf8'),
  );
  const pokemon = parsePokemonDataset(data);
  const generation = pokemon[0]!.spriteGeneration;
  const input: unknown = JSON.parse(
    await readFile(join(PROJECT_ROOT, 'reports', `sprites-${generation}.json`), 'utf8'),
  );
  const report = object(input, 'sprite report');
  const sprites = array(report.sprites, 'sprite report');
  if (sprites.length !== pokemon.length) throw new Error('Sprite report has incomplete coverage.');
  let totalBytes = 0;
  for (const entry of pokemon) {
    const path = join(
      PROJECT_ROOT,
      'src/assets/sprites',
      `${String(entry.id).padStart(4, '0')}.png`,
    );
    const bytes = await readFile(path);
    const image = validatePng(bytes, path);
    const reportEntry = object(sprites[entry.id - 1], `sprite report #${entry.id}`);
    const expected = object(reportEntry.image, `sprite report image #${entry.id}`);
    if (
      reportEntry.id !== entry.id ||
      reportEntry.status !== 'success' ||
      string(expected.sha256, `#${entry.id} SHA256`) !==
        createHash('sha256').update(bytes).digest('hex')
    ) {
      throw new Error(`Sprite #${entry.id} does not match its validated source report.`);
    }
    totalBytes += image.bytes;
  }
  console.log(
    `Validated ${pokemon.length}/151 bundled PNGs from ${generation}; ${totalBytes.toLocaleString('en-US')} bytes; all source checksums match.`,
  );
}

validate().catch((error: unknown) => {
  console.error('Sprite validation failed:', error);
  process.exitCode = 1;
});
