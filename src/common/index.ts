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
