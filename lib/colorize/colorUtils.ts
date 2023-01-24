export function fromHex(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export function toHex([r, g, b]: [number, number, number]): string {
  const ir = Math.round(r * 255).toString(16).padStart(2, '0');
  const ig = Math.round(g * 255).toString(16).padStart(2, '0');
  const ib = Math.round(b * 255).toString(16).padStart(2, '0');
  return `#${ir}${ig}${ib}`;
}

export function colorClamp(value: number): number {
  return Math.max(0, Math.min(value, 1));
}

export function colorMultiply(
  color: [number, number, number],
  matrix: number[]
): [number, number, number] {
  const r = colorClamp(color[0] * matrix[0] + color[1] * matrix[1] + color[2] * matrix[2]);
  const g = colorClamp(color[0] * matrix[3] + color[1] * matrix[4] + color[2] * matrix[5]);
  const b = colorClamp(color[0] * matrix[6] + color[1] * matrix[7] + color[2] * matrix[8]);
  return [r, g, b];
}

export function hueRotate(color: [number, number, number], angle = 0): [number, number, number] {
  angle = angle / 180 * Math.PI;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);
  return colorMultiply(color, [
    0.213 + cos * 0.787 - sin * 0.213,
    0.715 - cos * 0.715 - sin * 0.715,
    0.072 - cos * 0.072 + sin * 0.928,
    0.213 - cos * 0.213 + sin * 0.143,
    0.715 + cos * 0.285 + sin * 0.140,
    0.072 - cos * 0.072 - sin * 0.283,
    0.213 - cos * 0.213 - sin * 0.787,
    0.715 - cos * 0.715 + sin * 0.715,
    0.072 + cos * 0.928 + sin * 0.072,
  ]);
}

export function grayscale(color: [number, number, number], value = 1): [number, number, number] {
  // Default value is set to 1 (full grayscale) but lower values will desaturate the color, so
  // a value of 0.5 would be halfway to grayscale.
  return colorMultiply(color, [
    0.2126 + 0.7874 * (1 - value),
    0.7152 - 0.7152 * (1 - value),
    0.0722 - 0.0722 * (1 - value),
    0.2126 - 0.2126 * (1 - value),
    0.7152 + 0.2848 * (1 - value),
    0.0722 - 0.0722 * (1 - value),
    0.2126 - 0.2126 * (1 - value),
    0.7152 - 0.7152 * (1 - value),
    0.0722 + 0.9278 * (1 - value),
  ]);
}

export function sepia(color: [number, number, number], value = 1): [number, number, number] {
  return colorMultiply(color, [
    0.393 + 0.607 * (1 - value),
    0.769 - 0.769 * (1 - value),
    0.189 - 0.189 * (1 - value),
    0.349 - 0.349 * (1 - value),
    0.686 + 0.314 * (1 - value),
    0.168 - 0.168 * (1 - value),
    0.272 - 0.272 * (1 - value),
    0.534 - 0.534 * (1 - value),
    0.131 + 0.869 * (1 - value),
  ]);
}

export function saturate(color: [number, number, number], value = 1): [number, number, number] {
  return colorMultiply(color, [
    0.213 + 0.787 * value,
    0.715 - 0.715 * value,
    0.072 - 0.072 * value,
    0.213 - 0.213 * value,
    0.715 + 0.285 * value,
    0.072 - 0.072 * value,
    0.213 - 0.213 * value,
    0.715 - 0.715 * value,
    0.072 + 0.928 * value,
  ]);
}