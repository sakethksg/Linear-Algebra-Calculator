'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function DecompositionCalculator() {
  const [matrix, setMatrix] = useState('');
  const [result, setResult] = useState<Record<string, number[][]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDecomp, setActiveDecomp] = useState('lu');

  const handleCalculate = async (type: 'lu' | 'qr') => {
    setLoading(true);
    setError('');
    setResult(null);
    setActiveDecomp(type);

    try {
      const response = await fetch(`/api/matrix/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrixText: matrix }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('Failed to perform decomposition');
    } finally {
      setLoading(false);
    }
  };

  const formatMatrix = (matrix: number[][]) => {
    return matrix.map(row => row.map(val => val.toFixed(4)).join('  ')).join('\n');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Matrix Decomposition</CardTitle>
        <CardDescription>Perform LU or QR decomposition</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="matrix">Matrix (format: 1 2 3; 4 5 6; 7 8 9)</Label>
          <Textarea
            id="matrix"
            placeholder="Enter matrix rows separated by semicolons..."
            value={matrix}
            onChange={(e) => setMatrix(e.target.value)}
            className="font-mono"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => handleCalculate('lu')} disabled={loading} variant="outline">
            {loading && activeDecomp === 'lu' ? 'Computing...' : 'LU Decomposition'}
          </Button>
          <Button onClick={() => handleCalculate('qr')} disabled={loading} variant="outline">
            {loading && activeDecomp === 'qr' ? 'Computing...' : 'QR Decomposition'}
          </Button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {result.L && (
              <div className="space-y-2">
                <Label>Lower Triangular Matrix (L):</Label>
                <div className="p-4 rounded-lg glass font-mono text-sm whitespace-pre">
                  {formatMatrix(result.L)}
                </div>
              </div>
            )}

            {result.U && (
              <div className="space-y-2">
                <Label>Upper Triangular Matrix (U):</Label>
                <div className="p-4 rounded-lg glass font-mono text-sm whitespace-pre">
                  {formatMatrix(result.U)}
                </div>
              </div>
            )}

            {result.P && (
              <div className="space-y-2">
                <Label>Permutation Matrix (P):</Label>
                <div className="p-4 rounded-lg glass font-mono text-sm whitespace-pre">
                  {formatMatrix(result.P)}
                </div>
              </div>
            )}

            {result.Q && (
              <div className="space-y-2">
                <Label>Orthogonal Matrix (Q):</Label>
                <div className="p-4 rounded-lg glass font-mono text-sm whitespace-pre">
                  {formatMatrix(result.Q)}
                </div>
              </div>
            )}

            {result.R && (
              <div className="space-y-2">
                <Label>Upper Triangular Matrix (R):</Label>
                <div className="p-4 rounded-lg glass font-mono text-sm whitespace-pre">
                  {formatMatrix(result.R)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
