import type { PokemonType } from '../types/pokemon';

export const pokemonTypeStyles: Record<PokemonType, { background: string; foreground: string }> = {
  normal: { background: '#dedcc6', foreground: '#393b30' },
  fire: { background: '#f49a76', foreground: '#542c1f' },
  water: { background: '#9ac8ed', foreground: '#233d5d' },
  electric: { background: '#f5dd73', foreground: '#54451a' },
  grass: { background: '#a7d39a', foreground: '#29462b' },
  ice: { background: '#ade2df', foreground: '#244a4b' },
  fighting: { background: '#cf9387', foreground: '#4d2828' },
  poison: { background: '#c1a0d1', foreground: '#4c2d60' },
  ground: { background: '#dbc18c', foreground: '#53412a' },
  flying: { background: '#b9b6e8', foreground: '#3d375e' },
  psychic: { background: '#efa7bb', foreground: '#623047' },
  bug: { background: '#c6d28a', foreground: '#3e491e' },
  rock: { background: '#c9bc91', foreground: '#4a412c' },
  ghost: { background: '#aaa1ca', foreground: '#3d315b' },
  dragon: { background: '#aaa3e6', foreground: '#392a69' },
  dark: { background: '#a69c94', foreground: '#2e2927' },
  steel: { background: '#c6d2d4', foreground: '#334447' },
  fairy: { background: '#edc1d8', foreground: '#573449' },
};
