export function formatPokemonNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}
