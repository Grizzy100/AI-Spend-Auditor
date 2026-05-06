import { randomBytes } from 'crypto';

/**
 * Generates an 8-character hex share ID for public report URLs.
 * Example: "a3f7b2c1"
 */
export const generateShareId = (): string => {
  return randomBytes(4).toString('hex');
};

/**
 * Rounds a number to 2 decimal places.
 */
export const round2 = (n: number): number => Math.round(n * 100) / 100;

/**
 * Clamps a value between min and max.
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/**
 * Formats a USD amount as a string (e.g., "$1,200").
 */
export const formatUSD = (amount: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * Calculates the percentile rank of a value in a dataset.
 */
export const percentileRank = (value: number, benchmarkAvg: number): number => {
  if (value <= benchmarkAvg * 0.7) return 95;
  if (value <= benchmarkAvg * 0.85) return 85;
  if (value <= benchmarkAvg) return 70;
  if (value <= benchmarkAvg * 1.15) return 50;
  if (value <= benchmarkAvg * 1.3) return 35;
  if (value <= benchmarkAvg * 1.5) return 20;
  return 10;
};
