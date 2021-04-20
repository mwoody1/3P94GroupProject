export const convertHexToRGBA = (hex: string, opacity: number) => {
  const tempHex = hex.replace('#', '');
  const r = parseInt(tempHex.substring(0, 2), 16);
  const g = parseInt(tempHex.substring(2, 4), 16);
  const b = parseInt(tempHex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
};

export const convertHexToRGB = (hex: string) => {
  const tempHex = hex.replace('#', '');
  const r = parseInt(tempHex.substring(0, 2), 16);
  const g = parseInt(tempHex.substring(2, 4), 16);
  const b = parseInt(tempHex.substring(4, 6), 16);

  return [r,g,b];
}

export const fileCallbackToPromise = (fileObj: HTMLAudioElement | HTMLImageElement | HTMLVideoElement) => {
  return Promise.race([
    new Promise((resolve) => {
      if (fileObj instanceof HTMLImageElement) fileObj.onload = resolve;
      else fileObj.onloadedmetadata = resolve;
    }),
    new Promise((_, reject) => {
      setTimeout(reject, 3000);
    }),
  ]);
};

export const humanFileSize = (size: number) => {
  if (!size) return 'Unknown';
  let i = Math.floor( Math.log(size) / Math.log(1024) );
  return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

export const scaleBetween = (unscaledNum: number, minAllowed: number, maxAllowed: number, min: number, max: number) => {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
 export const rgbToHsv = (rgb: number[]) => {

  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  // r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
 
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [ h, s, v ];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export const hsvToRgb = (hsv: number[]) => {
  let r: number = 0, g: number = 0, b: number = 0;
  const h = hsv[0];
  const s = hsv[1];
  const v = hsv[2];
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: {
      r = v;
      g = t;
      b = p; 
      break;
    }
    case 1: {
      r = q; 
      g = v; 
      b = p; 
      break;
    }
    case 2: {
      r = p;
      g = v;
      b = t; 
      break;
    }
    case 3: {
      r = p;
      g = q;
      b = v; 
      break;
    }
    case 4: {
      r = t;
      g = p;
      b = v; 
      break;
    }
    case 5: {
      r = v;
      g = p;
      b = q; 
      break;
    }
  }

  return [ r * 255, g * 255, b * 255 ];
}