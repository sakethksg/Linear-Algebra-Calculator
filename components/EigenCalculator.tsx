'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EigenValue {
  re?: number;
  im?: number;
}

interface EigenResult {
  eigenvalues?: (number | EigenValue)[];
  eigenvectors?: (number | EigenValue)[][];
  error?: string;
}

export function EigenCalculator() {
  const [matrix, setMatrix] = useState('');
  const [result, setResult] = useState<EigenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/matrix/eigen', {
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
      setError('Failed to perform calculation');
    } finally {
      setLoading(false);
    }
  };

  const formatComplexNumber = (val: number | EigenValue): string => {
    if (typeof val === 'object' && 're' in val) {
      const real = (val.re ?? 0).toFixed(4);
      const imag = Math.abs(val.im ?? 0).toFixed(4);
      const sign = (val.im ?? 0) >= 0 ? '+' : '-';
      return `${real} ${sign} ${imag}i`;
    }
    return typeof val === 'number' ? val.toFixed(4) : String(val);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Eigenvalues & Eigenvectors</CardTitle>
        <CardDescription>Calculate eigenvalues and eigenvectors of a square matrix</CardDescription>
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

        <Button onClick={handleCalculate} disabled={loading} className="w-full">
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Eigenvalues:</Label>
              <div className="p-4 rounded-lg glass font-mono text-sm">
                {result.eigenvalues?.map((val: number | EigenValue, idx: number) => (
                  <div key={idx}>λ_{idx + 1} = {formatComplexNumber(val)}</div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Eigenvectors:</Label>
              <div className="p-4 rounded-lg glass font-mono text-sm space-y-2">
                {result.eigenvectors?.map((vec: (number | EigenValue)[], idx: number) => (
                  <div key={idx}>
                    <div className="text-gray-400 mb-1">v_{idx + 1}:</div>
                    <div className="pl-4">
                      {vec.map((val, i) => (
                        <div key={i}>{formatComplexNumber(val)}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
