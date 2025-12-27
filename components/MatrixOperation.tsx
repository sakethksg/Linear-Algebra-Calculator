'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MatrixOperationProps {
  title: string;
  description: string;
  endpoint: string;
  operation: 'single' | 'double';
  resultType?: 'matrix' | 'scalar';
}

export function MatrixOperation({ title, description, endpoint, operation, resultType = 'matrix' }: MatrixOperationProps) {
  const [matrixA, setMatrixA] = useState('');
  const [matrixB, setMatrixB] = useState('');
  const [result, setResult] = useState<number[][] | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const body: Record<string, string> = {};
      
      if (operation === 'double') {
        body.matrixAText = matrixA;
        body.matrixBText = matrixB;
      } else {
        body.matrixText = matrixA;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Failed to perform calculation');
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
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="matrixA">Matrix {operation === 'double' ? 'A' : ''} (format: 1 2 3; 4 5 6; 7 8 9)</Label>
          <Textarea
            id="matrixA"
            placeholder="Enter matrix rows separated by semicolons..."
            value={matrixA}
            onChange={(e) => setMatrixA(e.target.value)}
            className="font-mono"
            rows={4}
          />
        </div>

        {operation === 'double' && (
          <div className="space-y-2">
            <Label htmlFor="matrixB">Matrix B (format: 1 2 3; 4 5 6; 7 8 9)</Label>
            <Textarea
              id="matrixB"
              placeholder="Enter matrix rows separated by semicolons..."
              value={matrixB}
              onChange={(e) => setMatrixB(e.target.value)}
              className="font-mono"
              rows={4}
            />
          </div>
        )}

        <Button onClick={handleCalculate} disabled={loading} className="w-full">
          {loading ? 'Calculating...' : 'Calculate'}
        </Button>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {result !== null && (
          <div className="space-y-2">
            <Label>Result:</Label>
            <div className="p-4 rounded-lg glass font-mono text-sm whitespace-pre">
              {resultType === 'matrix' && Array.isArray(result)
                ? formatMatrix(result)
                : typeof result === 'number'
                ? result.toFixed(4)
                : JSON.stringify(result, null, 2)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
