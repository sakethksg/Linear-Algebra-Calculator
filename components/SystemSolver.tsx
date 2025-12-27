'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SystemResult {
  solution?: number[] | string;
  unique?: boolean;
  message?: string;
  error?: string;
}

export function SystemSolver() {
  const [coefficients, setCoefficients] = useState('');
  const [constants, setConstants] = useState('');
  const [result, setResult] = useState<SystemResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/system/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coefficientsText: coefficients,
          constantsText: constants,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError('Failed to solve system');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Linear System Solver</CardTitle>
        <CardDescription>Solve system of linear equations Ax = b</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="coefficients">Coefficient Matrix A (format: 1 2 3; 4 5 6; 7 8 9)</Label>
          <Textarea
            id="coefficients"
            placeholder="Enter coefficient matrix..."
            value={coefficients}
            onChange={(e) => setCoefficients(e.target.value)}
            className="font-mono"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="constants">Constants Vector b (space-separated)</Label>
          <Input
            id="constants"
            placeholder="e.g., 1 2 3"
            value={constants}
            onChange={(e) => setConstants(e.target.value)}
            className="font-mono"
          />
        </div>

        <Button onClick={handleCalculate} disabled={loading} className="w-full">
          {loading ? 'Solving...' : 'Solve System'}
        </Button>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <Label>Solution {result.unique ? '(Unique)' : '(Non-unique)'}:</Label>
            <div className="p-4 rounded-lg glass font-mono text-sm">
              {result.solution && Array.isArray(result.solution) ? (
                result.solution.map((val: number, idx: number) => (
                  <div key={idx}>
                    x_{idx + 1} = {val.toFixed(4)}
                  </div>
                ))
              ) : (
                <div>{result.solution}</div>
              )}
              {result.message && (
                <div className="mt-2 text-yellow-400">{result.message}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
