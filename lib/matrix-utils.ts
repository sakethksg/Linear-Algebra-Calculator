import {
  add,
  multiply,
  det,
  inv,
  transpose,
  lusolve,
  eigs,
  MathType,
} from 'mathjs';

export type MatrixData = number[][];
export type VectorData = number[];

export interface MatrixResult {
  result?: number[][] | number;
  error?: string;
}

export interface EigenResult {
  eigenvalues: (number | { re: number; im: number })[];
  eigenvectors: (number | { re: number; im: number })[][];
  error?: string;
}

export interface DecompositionResult {
  L?: number[][];
  U?: number[][];
  P?: number[][];
  Q?: number[][];
  R?: number[][];
  error?: string;
}

export interface SystemResult {
  solution?: number[];
  unique?: boolean;
  message?: string;
  error?: string;
}

/**
 * Parse matrix from text format "1 2 3; 4 5 6; 7 8 9"
 */
export function parseMatrix(text: string): number[][] {
  const rows = text.trim().split(';');
  const matrix: number[][] = [];

  for (const row of rows) {
    const values = row
      .trim()
      .split(/\s+/)
      .filter((v) => v)
      .map((v) => parseFloat(v));
    if (values.length > 0) {
      matrix.push(values);
    }
  }

  // Validate all rows have the same length
  if (matrix.length > 0) {
    const colCount = matrix[0].length;
    for (const row of matrix) {
      if (row.length !== colCount) {
        throw new Error('All rows must have the same number of columns');
      }
    }
  }

  return matrix;
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
 * Matrix addition
 */
export function matrixAdd(a: number[][], b: number[][]): MatrixResult {
  try {
    const result = add(a, b) as MathType;
    return { result: result.valueOf() as number[][] };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Matrix multiplication
 */
export function matrixMultiply(a: number[][], b: number[][]): MatrixResult {
  try {
    const result = multiply(a, b) as MathType;
    return { result: result.valueOf() as number[][] };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Matrix determinant
 */
export function matrixDeterminant(matrix: number[][]): MatrixResult {
  try {
    if (matrix.length !== matrix[0]?.length) {
      return { error: 'Matrix must be square' };
    }
    const result = det(matrix);
    return { result: result as number };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Matrix inverse
 */
export function matrixInverse(matrix: number[][]): MatrixResult {
  try {
    if (matrix.length !== matrix[0]?.length) {
      return { error: 'Matrix must be square' };
    }
    const result = inv(matrix) as MathType;
    return { result: result.valueOf() as number[][] };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message.includes('singular')
            ? 'Matrix is singular and cannot be inverted'
            : error.message
          : 'Unknown error',
    };
  }
}

/**
 * Matrix transpose
 */
export function matrixTranspose(matrix: number[][]): MatrixResult {
  try {
    const result = transpose(matrix) as MathType;
    return { result: result.valueOf() as number[][] };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Matrix rank
 */
export function matrixRank(matrix: number[][]): MatrixResult {
  try {
    // Calculate rank using row reduction
    const m = matrix.map(row => [...row]);
    const rows = m.length;
    const cols = m[0].length;
    let rank = 0;
    const epsilon = 1e-10;

    for (let col = 0; col < cols && rank < rows; col++) {
      // Find pivot
      let maxRow = rank;
      for (let row = rank + 1; row < rows; row++) {
        if (Math.abs(m[row][col]) > Math.abs(m[maxRow][col])) {
          maxRow = row;
        }
      }

      if (Math.abs(m[maxRow][col]) < epsilon) continue;

      // Swap rows
      [m[rank], m[maxRow]] = [m[maxRow], m[rank]];

      // Eliminate column
      for (let row = rank + 1; row < rows; row++) {
        const factor = m[row][col] / m[rank][col];
        for (let c = col; c < cols; c++) {
          m[row][c] -= factor * m[rank][c];
        }
      }
      rank++;
    }

    return { result: rank };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Solve system of linear equations Ax = b
 */
export function solveSystem(
  coefficients: number[][],
  constants: number[]
): SystemResult {
  try {
    if (coefficients.length !== constants.length) {
      return {
        error: 'Number of equations (rows) must match the number of constants',
      };
    }

    const solution = lusolve(coefficients, constants) as MathType;
    const solutionArray = (solution.valueOf() as number[][]).map(
      (row) => row[0]
    );

    return {
      solution: solutionArray,
      unique: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Compute eigenvalues and eigenvectors
 */
export function computeEigen(matrix: number[][]): EigenResult {
  try {
    if (matrix.length !== matrix[0]?.length) {
      return {
        eigenvalues: [],
        eigenvectors: [],
        error: 'Matrix must be square',
      };
    }

    const result = eigs(matrix);
    
    // Handle eigenvalues
    const eigenvalues = (result.values.valueOf() as (number | { re: number; im: number })[]).map((val: number | { re: number; im: number }) => {
      if (typeof val === 'object' && 're' in val && 'im' in val) {
        return { re: val.re, im: val.im };
      }
      return typeof val === 'number' ? val : parseFloat(String(val));
    });

    // Handle eigenvectors from the eigenvectors array
    const eigenvectors: (number | { re: number; im: number })[][] = [];
    
    for (const eigenPair of result.eigenvectors) {
      const vector: (number | { re: number; im: number })[] = [];
      const vecValues = eigenPair.vector.valueOf() as (number | { re: number; im: number })[];
      
      for (const val of vecValues) {
        if (typeof val === 'object' && 're' in val && 'im' in val) {
          vector.push({ re: val.re, im: val.im });
        } else {
          vector.push(typeof val === 'number' ? val : parseFloat(String(val)));
        }
      }
      eigenvectors.push(vector);
    }

    return { eigenvalues, eigenvectors };
  } catch (error) {
    return {
      eigenvalues: [],
      eigenvectors: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * LU Decomposition
 */
export function computeLU(matrix: number[][]): DecompositionResult {
  try {
    // Create identity permutation matrix
    const n = matrix.length;
    const P: number[][] = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (__, j) => (i === j ? 1 : 0))
    );
    
    // Simple LU decomposition without pivoting for now
    const L: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const U: number[][] = matrix.map(row => [...row]);
    
    for (let i = 0; i < n; i++) {
      L[i][i] = 1;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(U[i][i]) < 1e-10) continue;
        const factor = U[j][i] / U[i][i];
        L[j][i] = factor;
        for (let k = i; k < n; k++) {
          U[j][k] -= factor * U[i][k];
        }
      }
    }
    
    return { L, U, P };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * QR Decomposition using Gram-Schmidt process
 */
export function computeQR(matrix: number[][]): DecompositionResult {
  try {
    const m = matrix.length;
    const n = matrix[0].length;
    const Q: number[][] = Array.from({ length: m }, () => Array(n).fill(0));
    const R: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    
    // Gram-Schmidt orthogonalization
    for (let j = 0; j < n; j++) {
      // Copy column j
      const v: number[] = matrix.map(row => row[j]);
      
      // Orthogonalize against previous vectors
      for (let i = 0; i < j; i++) {
        const q: number[] = Q.map(row => row[i]);
        const dot = v.reduce((sum, val, idx) => sum + val * q[idx], 0);
        R[i][j] = dot;
        for (let k = 0; k < m; k++) {
          v[k] -= dot * q[k];
        }
      }
      
      // Normalize
      const norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
      R[j][j] = norm;
      
      if (Math.abs(norm) > 1e-10) {
        for (let k = 0; k < m; k++) {
          Q[k][j] = v[k] / norm;
        }
      }
    }
    
    return { Q, R };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
