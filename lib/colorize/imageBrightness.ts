import { useEffect, useState } from "react";


interface ImageBrightness {
  brightness: number | null;
  loading: boolean;
}
export const imageBrightness = ( imageUrl: string )=> {
  const [brightness, setBrightness] = useState<number | null>(null);

  useEffect(() => {
    async function checkBrightness() {
      const image = new Image();
      image.src = imageUrl;
      image.crossOrigin = 'anonymous';

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get 2D context from canvas element');
      }
      ctx.drawImage(image, 0, 0);

      const imageData = ctx.getImageData(0, 0, image.width, image.height);
      const data = imageData.data;

      let r = 0;
      let g = 0;
      let b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      r /= image.width * image.height;
      g /= image.width * image.height;
      b /= image.width * image.height;

      const brightness = (r + g + b) / 3;
      setBrightness(brightness);
    }

    checkBrightness();
  }, [imageUrl]);

  return {
    brightness: brightness,
    loading: brightness === null
  } as const
};

export const imageIsBright = ({ imageUrl }) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Load the image into the canvas
  const img = new Image();
  img.src = imageUrl;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);

    // Extract the pixel data from the image
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Calculate the average brightness of the pixels
    let sum = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      // The red, green, and blue values are stored in the first three elements of each pixel
      // We can calculate the brightness by taking the average of these three values
      const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      sum += brightness;
    }
    const averageBrightness = sum / (imageData.data.length / 4);

    // Determine if the image is dark or light
    if (averageBrightness > 128) {
      return true;
    } else {
      return false;
    }
  };
}