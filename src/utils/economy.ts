export function calculateLandExpansionCost(
  currentPlots: number,
  startingPlots: number,
  firstCost: number,
  multiplier: number,
): number {
  const exponent = Math.max(0, currentPlots - startingPlots);
  return Math.max(1, Math.round(firstCost * Math.pow(multiplier, exponent)));
}

export function randomIntInclusive(min: number, max: number, random = Math.random): number {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new Error('INVALID_RANGE');
  }
  return min + Math.floor(random() * (max - min + 1));
}
