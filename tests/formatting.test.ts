import { formatHeight, formatWeight } from '../src/utils/formatMeasurements';
import { formatPokemonNumber } from '../src/utils/formatPokemonNumber';
import { normalizeFlavorText } from '../src/utils/normalizeFlavorText';

describe('Pokémon display formatting', () => {
  it.each<[number, string]>([
    [1, '#0001'],
    [4, '#0004'],
    [25, '#0025'],
    [151, '#0151'],
  ])('formats National Pokédex number %i', (id, expected) => {
    expect(formatPokemonNumber(id)).toBe(expected);
  });

  it('converts API decimeters to meters and rounded feet/inches', () => {
    expect(formatHeight(6)).toBe('0.6 m (2′00″)');
    expect(formatHeight(17)).toBe('1.7 m (5′07″)');
    expect(formatHeight(88)).toBe('8.8 m (28′10″)');
  });

  it('converts API hectograms to kilograms and pounds', () => {
    expect(formatWeight(85)).toBe('8.5 kg (18.7 lbs)');
    expect(formatWeight(69)).toBe('6.9 kg (15.2 lbs)');
    expect(formatWeight(4600)).toBe('460.0 kg (1014.1 lbs)');
  });

  it('normalizes source control characters and whitespace without rewriting wording', () => {
    expect(normalizeFlavorText('\n  A flame\nburns\f at the\t tip of its tail.\r\n')).toBe(
      'A flame burns at the tip of its tail.',
    );
    expect(normalizeFlavorText('Farfetch’d carries a leek!')).toBe('Farfetch’d carries a leek!');
  });
});
