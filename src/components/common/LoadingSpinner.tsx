import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading data...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center p-12 min-h-[400px] w-full animate-in fade-in duration-500">
    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
    <p className="text-slate-500 font-medium text-sm tracking-wide">{message}</p>
  </div>
);
