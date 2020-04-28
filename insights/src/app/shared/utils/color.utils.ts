export interface RGBSegments {
  red: number;
  green: number;
  blue: number;
}

export function hexToRGB(hex: string): RGBSegments {
  // https://stackoverflow.com/a/11508164
  const bigint = parseInt(hex, 16);
  // tslint:disable-next-line:no-bitwise
  return {red: (bigint >> 16) & 255, green: (bigint >> 8) & 255, blue: bigint & 255};
}

export function readableFontColor(hex: string): string {
  // https://stackoverflow.com/a/3943023
  const segments = hexToRGB(hex);
  return (segments.red * 0.299 + segments.green * 0.587 + segments.blue * 0.114) > 186 ? '#000000' : '#ffffff';
}
