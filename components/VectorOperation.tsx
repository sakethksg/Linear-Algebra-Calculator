'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VectorOperationProps {
  title: string;
  description: string;
  endpoint: string;
  dimensions?: number;
}

export function VectorOperation({ title, description, endpoint, dimensions }: VectorOperationProps) {
  const [vectorA, setVectorA] = useState('');
  const [vectorB, setVectorB] = useState('');
  const [result, setResult] = useState<number[] | number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vectorAText: vectorA,
          vectorBText: vectorB,
        }),
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vectorA">
            Vector A {dimensions ? `(${dimensions}D)` : ''} (space-separated values)
          </Label>
          <Input
            id="vectorA"
            placeholder={dimensions === 3 ? "e.g., 1 2 3" : "e.g., 1 2 3 4 5"}
            value={vectorA}
            onChange={(e) => setVectorA(e.target.value)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vectorB">
            Vector B {dimensions ? `(${dimensions}D)` : ''} (space-separated values)
          </Label>
          <Input
            id="vectorB"
            placeholder={dimensions === 3 ? "e.g., 4 5 6" : "e.g., 6 7 8 9 10"}
            value={vectorB}
            onChange={(e) => setVectorB(e.target.value)}
            className="font-mono"
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

        {result !== null && (
          <div className="space-y-2">
            <Label>Result:</Label>
            <div className="p-4 rounded-lg glass font-mono text-sm">
              {Array.isArray(result)
                ? `[${result.map(v => v.toFixed(4)).join(', ')}]`
                : typeof result === 'number'
                ? result.toFixed(4)
                : JSON.stringify(result)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
