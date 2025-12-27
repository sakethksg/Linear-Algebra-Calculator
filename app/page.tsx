'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MatrixOperation } from '@/components/MatrixOperation';
import { VectorOperation } from '@/components/VectorOperation';
import { EigenCalculator } from '@/components/EigenCalculator';
import { SystemSolver } from '@/components/SystemSolver';
import { DecompositionCalculator } from '@/components/DecompositionCalculator';
import { Calculator, GitBranch, Grid3x3, Sigma } from 'lucide-react';
import MatrixText from '@/components/kokonutui/matrix-text';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <MatrixText 
            text="Linear Algebra Calculator" 
            className="min-h-0 h-auto"
            initialDelay={100}
            letterAnimationDuration={300}
            letterInterval={50}
          />
        </div>

        {/* Main Calculator */}
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              Basic Operations
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Sigma className="w-4 h-4" />
              Advanced
            </TabsTrigger>
            <TabsTrigger value="vectors" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Vectors
            </TabsTrigger>
            <TabsTrigger value="decomposition" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Decomposition
            </TabsTrigger>
          </TabsList>

          {/* Basic Operations Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MatrixOperation
                title="Matrix Addition"
                description="Add two matrices of the same dimensions"
                endpoint="/api/matrix/add"
                operation="double"
              />
              <MatrixOperation
                title="Matrix Multiplication"
                description="Multiply two matrices (A × B)"
                endpoint="/api/matrix/multiply"
                operation="double"
              />
              <MatrixOperation
                title="Matrix Transpose"
                description="Transpose a matrix (swap rows and columns)"
                endpoint="/api/matrix/transpose"
                operation="single"
              />
              <MatrixOperation
                title="Matrix Determinant"
                description="Calculate the determinant of a square matrix"
                endpoint="/api/matrix/determinant"
                operation="single"
                resultType="scalar"
              />
              <MatrixOperation
                title="Matrix Inverse"
                description="Find the inverse of a square matrix"
                endpoint="/api/matrix/inverse"
                operation="single"
              />
              <MatrixOperation
                title="Matrix Rank"
                description="Calculate the rank of a matrix"
                endpoint="/api/matrix/rank"
                operation="single"
                resultType="scalar"
              />
            </div>
          </TabsContent>

          {/* Advanced Operations Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EigenCalculator />
              <SystemSolver />
            </div>
          </TabsContent>

          {/* Vectors Tab */}
          <TabsContent value="vectors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VectorOperation
                title="Dot Product"
                description="Calculate the dot product of two vectors"
                endpoint="/api/vector/dot"
              />
              <VectorOperation
                title="Cross Product"
                description="Calculate the cross product of two 3D vectors"
                endpoint="/api/vector/cross"
                dimensions={3}
              />
            </div>
          </TabsContent>

          {/* Decomposition Tab */}
          <TabsContent value="decomposition" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <DecompositionCalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
