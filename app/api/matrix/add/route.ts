import { NextRequest, NextResponse } from 'next/server';
import { matrixAdd, parseMatrix } from '@/lib/matrix-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matrixA, matrixB, matrixAText, matrixBText } = body;

    let a: number[][];
    let b: number[][];

    if (matrixAText) {
      a = parseMatrix(matrixAText);
    } else if (matrixA) {
      a = matrixA;
    } else {
      return NextResponse.json({ error: 'Matrix A is required' }, { status: 400 });
    }

    if (matrixBText) {
      b = parseMatrix(matrixBText);
    } else if (matrixB) {
      b = matrixB;
    } else {
      return NextResponse.json({ error: 'Matrix B is required' }, { status: 400 });
    }

    const result = matrixAdd(a, b);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
