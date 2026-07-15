'use client';

import { createContext, useContext } from 'react';
import type { Brand } from '@/lib/brands';
import { getBrandCSSVars } from '@/lib/brands';

const BrandContext = createContext<Brand | null>(null);

export function useBrand() {
  const brand = useContext(BrandContext);
  if (!brand) throw new Error('useBrand must be used within BrandProvider');
  return brand;
}

export function BrandProvider({ brand, children }: { brand: Brand; children: React.ReactNode }) {
  const cssVars = getBrandCSSVars(brand);
  return (
    <BrandContext.Provider value={brand}>
      <div style={cssVars as React.CSSProperties} className="relative min-h-screen bg-[var(--color-background)]">
        <div className="noise-overlay" />
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[200px] opacity-[0.06] animate-float pointer-events-none" style={{ background: `radial-gradient(circle, var(--color-primary), transparent 70%)` }} />
        <div className="relative z-[2]">{children}</div>
      </div>
    </BrandContext.Provider>
  );
}
