export function formatHeight(decimeters: number): string {
  const totalInches = Math.round((decimeters * 10) / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = String(totalInches % 12).padStart(2, '0');
  return `${(decimeters / 10).toFixed(1)} m (${feet}′${inches}″)`;
}

export function formatWeight(hectograms: number): string {
  const kilograms = hectograms / 10;
  return `${kilograms.toFixed(1)} kg (${(kilograms * 2.2046226218).toFixed(1)} lbs)`;
}
