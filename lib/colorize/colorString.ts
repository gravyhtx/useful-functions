export function hslToObject(hsl: string): {h: number, s: number, l: number} {
  const [h, s, l] = hsl.match(/\b\d+\b/g)!.map(Number);
  return {h, s, l};
}

export function hslToHex(h: number, s: number, l: number): string {
  // Normalize the hue value to the range 0-360
  h = h % 360;
  if (h < 0) {
    h += 360;
  }

  // Normalize the saturation and lightness values to the range 0-100
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

  // Convert the saturation and lightness values to the range 0-1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  // Convert the red, green, and blue values to hexadecimal strings and return the resulting hex color code
  return (
    '#' +
    [r, g, b]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function rgbToHsl(
  rgbObject: {
    r: number,
    g: number,
    b: number
  }
): { h: number, s: number, l: number } {

  let {r, g, b} = rgbObject;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = (max + min) / 2;
  let s = (max + min) / 2;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 100) / 100,
    s: Math.round(s * 100) / 100,
    l: Math.round(l * 100) / 100
  };
}

export function rgbObject(color: string): {r: number, g: number, b: number} {
  let r:number, g:number, b:number;

  if (color.startsWith("#")) {
    // Hex color string
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else if (color.startsWith("rgb")) {
    // RGB color string
    let parts = color.split(/[\(\)]/)[1].split(",").map(s => s.trim());
    r = parseInt(parts[0]);
    g = parseInt(parts[1]);
    b = parseInt(parts[2]);
  } else {
    throw new Error(`Invalid color string: ${color}`);
  }

  return {r, g, b};
}

export function rgbToHex(color: string): string {
  // Extract the RGB values from the color string
  const r = parseInt(color.slice(4, color.indexOf(",")), 10);
  const g = parseInt(color.slice(color.indexOf(",") + 1, color.lastIndexOf(",")), 10);
  const b = parseInt(color.slice(color.lastIndexOf(",") + 1, color.lastIndexOf(")")), 10);

  // Convert the RGB values to hexadecimal strings and pad with leading zeros if necessary
  const hexR = r.toString(16).padStart(2, "0");
  const hexG = g.toString(16).padStart(2, "0");
  const hexB = b.toString(16).padStart(2, "0");

  // Return the hexadecimal color string
  return `#${hexR}${hexG}${hexB}`;
}

export function hexToRgb(
  hex: string
) {

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(!result) { return null; }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return {
    array: [ r, g, b ],
    object: { r: r, g: g, b: b },
    string: `rgb(${r},${g},${b})`
  }
}

export function hexToRgbString(hex: string): string {

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(!result) { return null; }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}