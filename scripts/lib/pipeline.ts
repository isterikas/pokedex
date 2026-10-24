import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

export const PROJECT_ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const CACHE_ROOT = join(PROJECT_ROOT, '.cache/pokemon-data');
export const TOTAL_POKEMON = 151;
export const SPRITE_GENERATIONS = ['brilliant-diamond-shining-pearl', 'diamond-pearl'] as const;
const REFRESH = process.argv.includes('--refresh');

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function object(value: unknown, context: string): Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(`${context}: expected an object.`);
  }
  return value;
}

export function array(value: unknown, context: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${context}: expected an array.`);
  return value;
}

export function string(value: unknown, context: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${context}: missing text.`);
  return value;
}

export function number(value: unknown, context: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${context}: expected a positive number.`);
  }
  return value;
}

export function namedResource(value: unknown, context: string): string {
  return string(object(value, context).name, context);
}

export async function writeAtomic(path: string, content: string | Buffer): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  await writeFile(temporary, content);
  await rename(temporary, path);
}

export async function mapConcurrent<T, R>(
  values: readonly T[],
  mapper: (value: T, index: number) => Promise<R>,
  concurrency = 6,
): Promise<R[]> {
  const results: R[] = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, async () => {
      while (cursor < values.length) {
        const index = cursor++;
        results[index] = await mapper(values[index]!, index);
      }
    }),
  );
  return results;
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    url: string,
  ) {
    super(`HTTP ${status} while downloading ${url}`);
  }
}

export async function requestBytes(url: string): Promise<Buffer> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(30_000),
        headers: { 'User-Agent': 'PokedexOfAnomalies/1.0 (local portfolio data generator)' },
      });
      if (!response.ok) throw new HttpError(response.status, url);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.length) throw new Error(`Empty response from ${url}`);
      return bytes;
    } catch (error) {
      if (
        error instanceof HttpError &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 408 &&
        error.status !== 429
      )
        throw error;
      if (attempt === 2) throw new Error(`Failed after 3 attempts: ${url}`, { cause: error });
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
    }
  }
  throw new Error(`Could not download ${url}`);
}

export async function getApiResource(resource: string, id: number | string): Promise<unknown> {
  const path = join(CACHE_ROOT, 'api', resource, `${id}.json`);
  if (!REFRESH) {
    try {
      const cached: unknown = JSON.parse(await readFile(path, 'utf8'));
      return cached;
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
  }
  const bytes = await requestBytes(`https://pokeapi.co/api/v2/${resource}/${id}/`);
  const result: unknown = JSON.parse(bytes.toString('utf8'));
  await writeAtomic(path, `${JSON.stringify(result)}\n`);
  return result;
}

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export interface PngInfo {
  width: number;
  height: number;
  bytes: number;
  sha256: string;
}

export function validatePng(bytes: Buffer, context: string): PngInfo {
  const fail = (reason: string): never => {
    throw new Error(`${context}: invalid PNG (${reason}).`);
  };
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    fail('signature');
  }
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let channels = 0;
  let interlace = 0;
  let hasHeader = false;
  let hasEnd = false;
  const imageData: Buffer[] = [];
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    if (length > bytes.length - offset - 12) fail('truncated chunk');
    const type = bytes.toString('ascii', offset + 4, offset + 8);
    const chunk = bytes.subarray(offset + 8, offset + 8 + length);
    if (
      crc32(bytes.subarray(offset + 4, offset + 8 + length)) !==
      bytes.readUInt32BE(offset + 8 + length)
    )
      fail(`CRC for ${type}`);
    if (type === 'IHDR') {
      if (hasHeader || offset !== 8 || length !== 13) fail('header');
      width = chunk.readUInt32BE(0);
      height = chunk.readUInt32BE(4);
      if (width < 1 || height < 1 || width > 4096 || height > 4096) fail('dimensions');
      bitDepth = chunk[8]!;
      const colorType = chunk[9]!;
      channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 } as Record<number, number>)[colorType] ?? 0;
      interlace = chunk[12]!;
      if (
        !channels ||
        ![1, 2, 4, 8, 16].includes(bitDepth) ||
        chunk[10] !== 0 ||
        chunk[11] !== 0 ||
        ![0, 1].includes(interlace)
      )
        fail('pixel format');
      hasHeader = true;
    }
    if (type === 'IDAT') imageData.push(chunk);
    offset += length + 12;
    if (type === 'IEND') {
      hasEnd = true;
      break;
    }
  }
  if (!hasHeader || !hasEnd || !imageData.length || offset !== bytes.length) fail('missing chunks');
  const pixels = inflateSync(Buffer.concat(imageData), { maxOutputLength: 128 * 1024 * 1024 });
  const passes =
    interlace === 0
      ? [[0, 0, 1, 1]]
      : [
          [0, 0, 8, 8],
          [4, 0, 8, 8],
          [0, 4, 4, 8],
          [2, 0, 4, 4],
          [0, 2, 2, 4],
          [1, 0, 2, 2],
          [0, 1, 1, 2],
        ];
  let pixelOffset = 0;
  for (const [x = 0, y = 0, stepX = 1, stepY = 1] of passes) {
    const passWidth = Math.max(0, Math.ceil((width - x) / stepX));
    const passHeight = Math.max(0, Math.ceil((height - y) / stepY));
    if (!passWidth || !passHeight) continue;
    const rowBytes = Math.ceil((passWidth * channels * bitDepth) / 8);
    for (let row = 0; row < passHeight; row++) {
      if (pixelOffset >= pixels.length || pixels[pixelOffset]! > 4) fail('scanline filter');
      pixelOffset += rowBytes + 1;
    }
  }
  if (pixelOffset !== pixels.length) fail('scanline length');
  return {
    width,
    height,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
}

export interface SpriteValidation {
  id: number;
  slug: string;
  url: string;
  status: 'success' | 'missing';
  image?: PngInfo;
  error?: string;
}

export function pokemonDbSlug(id: number, slug: string): string {
  const specialCases: Record<number, string> = {
    29: 'nidoran-f',
    32: 'nidoran-m',
    83: 'farfetchd',
    122: 'mr-mime',
  };
  return specialCases[id] ?? slug;
}

export async function getSprite(
  generation: string,
  id: number,
  slug: string,
): Promise<{ validation: SpriteValidation; bytes?: Buffer }> {
  const url = `https://img.pokemondb.net/sprites/${generation}/normal/${slug}.png`;
  const path = join(CACHE_ROOT, 'sprites', generation, `${slug}.png`);
  const missingPath = `${path}.missing.json`;
  if (!REFRESH) {
    try {
      const bytes = await readFile(path);
      return {
        bytes,
        validation: { id, slug, url, status: 'success', image: validatePng(bytes, path) },
      };
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
    try {
      const cached: unknown = JSON.parse(await readFile(missingPath, 'utf8'));
      const reason = string(object(cached, missingPath).error, 'cached HTTP error');
      return { validation: { id, slug, url, status: 'missing', error: reason } };
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
    }
  }
  try {
    const bytes = await requestBytes(url);
    const image = validatePng(bytes, url);
    await writeAtomic(path, bytes);
    return { bytes, validation: { id, slug, url, status: 'success', image } };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error instanceof HttpError && (error.status === 404 || error.status === 410)) {
      await writeAtomic(missingPath, JSON.stringify({ error: message }));
    }
    return { validation: { id, slug, url, status: 'missing', error: message } };
  }
}
