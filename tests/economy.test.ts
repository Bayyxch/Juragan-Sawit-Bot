import { describe, expect, it } from 'vitest';
import { calculateLandExpansionCost, randomIntInclusive } from '../src/utils/economy';

describe('economy formulas', () => {
  it('keeps the first land expansion at the configured base cost', () => {
    expect(calculateLandExpansionCost(4, 4, 12000, 1.32)).toBe(12000);
  });

  it('increases land cost non-linearly', () => {
    const first = calculateLandExpansionCost(4, 4, 12000, 1.32);
    const second = calculateLandExpansionCost(5, 4, 12000, 1.32);
    const third = calculateLandExpansionCost(6, 4, 12000, 1.32);
    expect(second).toBeGreaterThan(first);
    expect(third).toBeGreaterThan(second);
  });

  it('never produces a value below one', () => {
    expect(calculateLandExpansionCost(4, 4, 0, 1.32)).toBe(1);
  });

  it('generates an inclusive deterministic range', () => {
    expect(randomIntInclusive(6, 8, () => 0)).toBe(6);
    expect(randomIntInclusive(6, 8, () => 0.999999)).toBe(8);
  });
});
