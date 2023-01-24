

import { checkType } from "../../utils/validation";
import { hexToRgbString, rgbObject, rgbToHex } from "./colorString";


// CALCULATE THE LUMINANCE VALUE OF A HEX OR RGB COLOR STRING
export function colorLuminance(color: string): number {
  let r:number,g:number,b:number;

  if(checkType(color, 'hex') || checkType(color, 'rgb')) {
    const rgb = rgbObject(color)
    // Extract the hex values for each channel (red, green, blue)
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
  }

  // Calculate the relative luminance of the color
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Return the relative luminance value (out of 1 max)
  return Number(luminance.toFixed(2));
}

// CALCULATE THE BRIGHTNESS VALUE OF A HEX OR RGB STRING
export function colorBrightness(color: string): number {
  let r:number,g:number,b:number;

  if(checkType(color, 'hex') || checkType(color, 'rgb')) {
    const rgb = rgbObject(color)
    // Extract the hex values for each channel (red, green, blue)
    r = rgb.r;
    g = rgb.g;
    b = rgb.b;
  }
  
  // Calculate the brightness using the luminosity formula
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return the brightness value (out of 100 max)
  return Number(brightness.toFixed(2));
}