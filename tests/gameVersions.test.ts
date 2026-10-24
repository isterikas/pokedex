import {
  getAvailableGameVersions,
  getGameVersionLabel,
  resolveGameVersion,
} from '../src/constants/gameVersions';

import { makePokemon } from './fixtures';

describe('game-specific descriptions', () => {
  it('returns the selected text with its actual source version', () => {
    const descriptions = makePokemon().descriptions;
    expect(resolveGameVersion(descriptions, 'red')).toEqual({
      version: 'red',
      text: descriptions.red,
      isFallback: false,
    });
  });

  it('explicitly marks FireRed as the fallback when the requested version is unavailable', () => {
    const descriptions = makePokemon().descriptions;
    expect(resolveGameVersion(descriptions, 'diamond')).toEqual({
      version: 'firered',
      text: descriptions.firered,
      isFallback: true,
    });
  });

  it('uses a real available entry if FireRed is missing', () => {
    expect(resolveGameVersion({ yellow: 'An actual Yellow entry.' }, 'red')).toEqual({
      version: 'yellow',
      text: 'An actual Yellow entry.',
      isFallback: true,
    });
  });

  it('ignores empty entries and never fabricates text', () => {
    expect(resolveGameVersion({ red: '  ', blue: 'A Blue entry.' }, 'red')).toEqual({
      version: 'blue',
      text: 'A Blue entry.',
      isFallback: true,
    });
    expect(resolveGameVersion({}, 'firered').text).toBe('');
  });

  it('offers only available descriptions and keeps labels separate from identifiers', () => {
    const pokemon = makePokemon({
      descriptions: { red: 'Red entry.', firered: 'FireRed entry.', diamond: ' ' },
    });
    expect(getAvailableGameVersions(pokemon)).toEqual([
      { id: 'firered', name: 'FireRed' },
      { id: 'red', name: 'Red' },
    ]);
    expect(getGameVersionLabel('heartgold')).toBe('HeartGold');
    expect(getGameVersionLabel('lets-go-pikachu')).toBe("Let's Go, Pikachu!");
    expect(getGameVersionLabel('future-version')).toBe('Future Version');
  });
});
