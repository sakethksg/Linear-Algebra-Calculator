import { NextRequest, NextResponse } from 'next/server';
import { solveSystem, parseMatrix, parseVector } from '@/lib/matrix-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coefficients, constants, coefficientsText, constantsText } = body;

    let coef: number[][];
    let cons: number[];

    if (coefficientsText) {
      coef = parseMatrix(coefficientsText);
    } else if (coefficients) {
      coef = coefficients;
    } else {
      return NextResponse.json(
        { error: 'Coefficients matrix is required' },
        { status: 400 }
      );
    }

    if (constantsText) {
      cons = parseVector(constantsText);
    } else if (constants) {
      cons = constants;
    } else {
      return NextResponse.json(
        { error: 'Constants vector is required' },
        { status: 400 }
      );
    }

    const result = solveSystem(coef, cons);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
