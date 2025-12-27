import { dot, cross } from 'mathjs';

export interface VectorResult {
  result?: number[] | number;
  error?: string;
}

/**
 * Parse vector from text format "1 2 3 4 5"
 */
export function parseVector(text: string): number[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((v) => v)
    .map((v) => parseFloat(v));
}

/**
 * Vector dot product
 */
export function vectorDot(a: number[], b: number[]): VectorResult {
  try {
    if (a.length !== b.length) {
      return { error: 'Vectors must have the same dimensions' };
    }
    const result = dot(a, b);
    return { result: result as number };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Vector cross product (3D only)
 */
export function vectorCross(a: number[], b: number[]): VectorResult {
  try {
    if (a.length !== 3 || b.length !== 3) {
      return { error: 'Cross product requires 3D vectors' };
    }
    const result = cross(a, b);
    return { result: result.valueOf() as number[] };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
