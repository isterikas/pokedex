export function normalizeFlavorText(text: string): string {
  return text.replace(/[\s\u0000-\u001f]+/g, ' ').trim();
}
