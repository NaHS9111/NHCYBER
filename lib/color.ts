function relativeLuminance(hex: string): number {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)!
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const [r, g, b] = rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA: string, hexB: string): number {
  const l1 = relativeLuminance(hexA) + 0.05;
  const l2 = relativeLuminance(hexB) + 0.05;
  return l1 > l2 ? l1 / l2 : l2 / l1;
}

const GOLD = "#B8934A";
const INK = "#0D0D0D";

/** Picks whichever of gold or deep ink actually reads against this swatch. */
export function pickMarkColor(swatchHex: string): string {
  return contrastRatio(swatchHex, GOLD) >= contrastRatio(swatchHex, INK) ? GOLD : INK;
}
