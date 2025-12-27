import { NextRequest, NextResponse } from 'next/server';
import { vectorCross, parseVector } from '@/lib/vector-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vectorA, vectorB, vectorAText, vectorBText } = body;

    let a: number[];
    let b: number[];

    if (vectorAText) {
      a = parseVector(vectorAText);
    } else if (vectorA) {
      a = vectorA;
    } else {
      return NextResponse.json({ error: 'Vector A is required' }, { status: 400 });
    }

    if (vectorBText) {
      b = parseVector(vectorBText);
    } else if (vectorB) {
      b = vectorB;
    } else {
      return NextResponse.json({ error: 'Vector B is required' }, { status: 400 });
    }

    const result = vectorCross(a, b);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
