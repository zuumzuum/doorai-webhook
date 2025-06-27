'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export const ClientOnly = <T extends Record<string, any>>(
  importFunc: () => Promise<{ default: ComponentType<T> }>
) => {
  return dynamic(importFunc, { 
    ssr: false,
    loading: () => <div className="w-full h-80 bg-muted/50 rounded-lg animate-pulse" />
  });
};