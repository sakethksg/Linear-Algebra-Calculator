import { NextRequest, NextResponse } from 'next/server';
import { matrixTranspose, parseMatrix } from '@/lib/matrix-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matrix, matrixText } = body;

    let m: number[][];

    if (matrixText) {
      m = parseMatrix(matrixText);
    } else if (matrix) {
      m = matrix;
    } else {
      return NextResponse.json({ error: 'Matrix is required' }, { status: 400 });
    }

    const result = matrixTranspose(m);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
