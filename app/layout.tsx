import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BeamsBackground from '@/components/kokonutui/beams-background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Linear Algebra Calculator',
  description: 'Advanced linear algebra operations with elegant glassmorphism UI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BeamsBackground intensity="strong" className="fixed inset-0 -z-10" />
        {children}
      </body>
    </html>
  );
}
