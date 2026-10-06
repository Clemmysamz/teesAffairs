export const USD_TO_NGN_RATE = 1650;

export function usdToNgn(usdAmount: number) {
  return Math.round(usdAmount * USD_TO_NGN_RATE);
}

export function toKobo(nairaAmount: number) {
  return Math.round(nairaAmount * 100);
}
