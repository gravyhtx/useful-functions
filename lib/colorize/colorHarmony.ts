import { useState, useEffect } from 'react';
import { checkType } from '../../utils/validation';
import { rgbObject, rgbToHsl } from './colorString';

export const harmonizeColors = (
  inputColor: string | string[] | number[],
  type: 'hsl' | 'rbg' | 'hex',
  colorsToOutput?: number,
  pattern?: number,
) => {
  let output: any;
  return output;
}

export const triad = ( baseColor: string ): string[] => {
  const [colors, setColors] = useState<string[] | null>(null);

  const splitColors = rgbObject(baseColor);

  useEffect(() => {
    const baseRgb = rgbToHsl(splitColors);
    const harmonize: string[] = [];
    for (let i = 0; i < 3; i++) {
      const h = (baseRgb.h + 120 * i) % 360;
      const color = `hsl(${h}, ${baseRgb.s}%, ${baseRgb.l}%)`;
      harmonize.push(color);
    }
    setColors(harmonize);
  }, [baseColor]);

  return colors;
};

export function analogous(baseColor: string) {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const baseColorComponents = baseColor
      .slice(1)
      .match(/.{2}/g)
      .map(component => parseInt(component, 16));
    const [red, green, blue] = baseColorComponents;
    const analogousColor1 =
      '#' +
      [(red + 51) % 256,(green + 51) % 256,(blue + 51) % 256]
        .map(component => component.toString(16).padStart(2, '0'))
        .join('');
    const analogousColor2 =
      '#' +
      [(red + 205) % 256,(green + 205) % 256,(blue + 205) % 256]
        .map(component => component.toString(16).padStart(2, '0'))
        .join('');
    setColors([baseColor, analogousColor1, analogousColor2]);
  }, [baseColor]);

  return colors;
}

// export function analogous(baseColor: string): string[] {

//   const baseHex = checkType(baseColor, 'rgb')
//       ? rgbToHex(baseColor)
//     :checkType(baseColor, 'hsl')
//       ? hslToHex(baseColor)
//       : baseColor

//   // First, we'll parse the base color into its red, green, and blue components
//   const baseHexComponents = baseHex
//     .slice(1)
//     .match(/.{2}/g)
//     .map(component => parseInt(component, 16));
  
//   const [red, green, blue] = baseHexComponents;

//   // Then, we'll generate the two analogous colors by adjusting the hue of the base color by 30
//   // degrees in opposite directions
//   const analogousColor1 =
//     '#' +
//     [
//       (red + 51) % 256,
//       (green + 51) % 256,
//       (blue + 51) % 256
//     ]
//       .map(component => component.toString(16).padStart(2, '0'))
//       .join('');
//   const analogousColor2 =
//     '#' +
//     [
//       (red + 205) % 256,
//       (green + 205) % 256,
//       (blue + 205) % 256
//     ]
//       .map(component => component.toString(16).padStart(2, '0'))
//       .join('');

//   // Finally, we'll return the base color and the two analogous colors in an array
//   return [baseHex, analogousColor1, analogousColor2];
// }