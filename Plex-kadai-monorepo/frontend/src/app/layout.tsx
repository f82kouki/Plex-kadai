// src/app/layout.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import { useState } from 'react';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  return (
    <html lang="ja"><body className="min-h-screen bg-gray-50">
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </body></html>
  );
}