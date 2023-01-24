import { checkType } from "../../utils/validation";
import { numberClamp } from "../../utils/generator";
import { hexToRgb, hexToRgbString } from "./colorString";

export function hexIsValid(color: string): boolean {
  // Verify that the string is in the proper format (6 hexadecimal digits preceded by a "#")
  if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
    return false;
  }

  // Convert the hexadecimal string to an RGB color string
  const rgb = hexToRgb(color).string;

  // Verify that the RGB color string represents a valid color
  return rgbIsValid(rgb);

}

export function rgbIsValid(color: string): boolean {
  // Verify that the string is in the proper format (3 decimal values between 0 and 255
  // separated bycommas and surrounded by parentheses)
  if (!color.startsWith('rgb(') && !color.endsWith(')') && !/^rgb\(\d{1,3},\s\d{1,3},\s\d{1,3}\)$/.test(color)) {
    return false;
  }
  // Extract the RGB values from the color string
  const r = parseInt(color.slice(4, color.indexOf(",")), 10);
  const g = parseInt(color.slice(color.indexOf(",") + 1, color.lastIndexOf(",")), 10);
  const b = parseInt(color.slice(color.lastIndexOf(",") + 1, color.lastIndexOf(")")), 10);

  // Verify that the RGB values are between 0 and 255 (inclusive)
  return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
}

export function hslIsValid(color: string): boolean {
  // Verify that the string is in the proper format (3 decimal values between 0 and 255
  // separated bycommas and surrounded by parentheses)
  if (!/^hsl\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(color)) {
    return false;
  }

  // Extract the HSL values from the color string
  const h = parseInt(color.slice(4, color.indexOf(",")), 10);
  const s = parseInt(color.slice(color.indexOf(",") + 1, color.lastIndexOf(",")), 10);
  const l = parseInt(color.slice(color.lastIndexOf(",") + 1, color.lastIndexOf(")")), 10);

  // Verify that the RGB values are between 0 and 255 (inclusive)
  return h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100;
}

export function isValidRgbArray(rgbArray: number[]) {
  if (rgbArray.length !== 3) {
    return false;
  }

  for (const value of rgbArray) {
    if (typeof value !== 'number' || value < 0 || value > 255) {
      return false;
    }
  }

  return true;
}

//* CHECK FOR VALID RGB OBJECT (BETTER PERFORMANCE)
export function isValidRgbObject(rgbObject: { r: number; g: number; b: number }) {
  if (!rgbObject.hasOwnProperty('r') || !rgbObject.hasOwnProperty('g') || !rgbObject.hasOwnProperty('b')) {
    return false;
  }
  for (const key of ['r', 'g', 'b']) {
    const value = rgbObject[key];
    if (typeof value !== 'number' || value < 0 || value > 255) {
      return false;
    }
  }
  return true;
}

//* CHECK FOR VALID RGB OBJECT
export function isRgbObj( rgbObj: { r: number, g: number, b: number, }) {
  const isR = rgbObj?.r && rgbObj?.r <= 255 && rgbObj?.r >= 0;
  const isG = rgbObj?.g && rgbObj?.g <= 255 && rgbObj?.g >= 0;
  const isB = rgbObj?.b && rgbObj?.b <= 255 && rgbObj?.b >= 0;
  return !!isR && !!isG && !!isB ? true : false;
}

export const colorToArray = (color: string) => {
  const type = checkType(color, 'rgb') ? 'rgb'
    : checkType(color, 'hsl') ? 'hsl'
    : checkType(color, 'hex') ? 'hex'
    : undefined;
  switch(type) {
    case 'rgb':
      color = color.replace(/^rgb\(|\)$/g, '');
      return color.split(',').map(value => parseInt(value));
    case 'hsl':
      color = color.replace(/^hsl\(|\)$/g, '');
      return color.split(',').map(value => parseInt(value));
    case 'hex':
      // Remove leading "#"
      color = color.replace(/^#/, '');

      if (color.length === 3) {
        // Split the string into an array of characters
        return color.split('');
      } else if (color.length === 6) {
        // Split the string into an array of pairs of characters
        const hexValues = color.match(/.{2}/g);

        // Convert each pair to a numerical value
        return hexValues.map(value => parseInt(value, 16));
      }
  }
}

export const rgbClamp = (color: { r: number, g: number, b: number }, toString: boolean) => {
  color.r = numberClamp(color.r, 0, 255);
  color.g = numberClamp(color.g, 0, 255);
  color.b = numberClamp(color.b, 0, 255);
  return toString ? `rgb(${color.r},${color.g},${color.b})` :[color.r,color.g,color.b];
}

export const hslClamp = (color: { h: number, s: number, l: number }, toString: boolean) => {
  color.h = numberClamp(color.h, 0, 360);
  color.s = numberClamp(color.s, 0, 100);
  color.l = numberClamp(color.l, 0, 100);
  return toString ? `hsl(${color.h},${color.s},${color.l})` : [color.h,color.s,color.l];
}