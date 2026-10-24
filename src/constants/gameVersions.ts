import type { Pokemon } from '../types/pokemon';

export const DEFAULT_GAME_VERSION = 'firered';

const GAME_VERSION_NAMES: Record<string, string> = {
  firered: 'FireRed',
  leafgreen: 'LeafGreen',
  red: 'Red',
  blue: 'Blue',
  yellow: 'Yellow',
  gold: 'Gold',
  silver: 'Silver',
  crystal: 'Crystal',
  ruby: 'Ruby',
  sapphire: 'Sapphire',
  emerald: 'Emerald',
  diamond: 'Diamond',
  pearl: 'Pearl',
  platinum: 'Platinum',
  heartgold: 'HeartGold',
  soulsilver: 'SoulSilver',
  black: 'Black',
  white: 'White',
  'black-2': 'Black 2',
  'white-2': 'White 2',
  x: 'X',
  y: 'Y',
  'omega-ruby': 'Omega Ruby',
  'alpha-sapphire': 'Alpha Sapphire',
  sun: 'Sun',
  moon: 'Moon',
  'ultra-sun': 'Ultra Sun',
  'ultra-moon': 'Ultra Moon',
  'lets-go-pikachu': "Let's Go, Pikachu!",
  'lets-go-eevee': "Let's Go, Eevee!",
  sword: 'Sword',
  shield: 'Shield',
  'brilliant-diamond': 'Brilliant Diamond',
  'shining-pearl': 'Shining Pearl',
  'legends-arceus': 'Legends: Arceus',
  scarlet: 'Scarlet',
  violet: 'Violet',
  'legends-za': 'Legends: Z-A',
};

export function getGameVersionLabel(version: string): string {
  return (
    GAME_VERSION_NAMES[version] ??
    version
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

export function getAvailableGameVersions(pokemon: Pokemon): { id: string; name: string }[] {
  const order = Object.keys(GAME_VERSION_NAMES);
  return Object.keys(pokemon.descriptions)
    .filter((id) => pokemon.descriptions[id]?.trim())
    .sort((a, b) => {
      const left = order.indexOf(a);
      const right = order.indexOf(b);
      return (
        (left < 0 ? order.length : left) - (right < 0 ? order.length : right) || a.localeCompare(b)
      );
    })
    .map((id) => ({ id, name: getGameVersionLabel(id) }));
}

export function resolveGameVersion(
  descriptions: Record<string, string>,
  preferred: string,
): { version: string; text: string; isFallback: boolean } {
  const version =
    [preferred, DEFAULT_GAME_VERSION, ...Object.keys(descriptions)].find((id) =>
      descriptions[id]?.trim(),
    ) ?? '';
  return { version, text: descriptions[version] ?? '', isFallback: version !== preferred };
}
