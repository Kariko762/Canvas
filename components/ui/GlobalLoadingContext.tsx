'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { PresentationLoader } from './PresentationLoader';

interface GlobalLoadingContextType {
  showLoading: () => void;
  hideLoading: () => void;
  setProgress: (progress: number) => void;
  progress: number;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgressState] = useState(0);

  const showLoading = () => {
    setIsLoading(true);
    setProgressState(0);
  };

  const hideLoading = () => {
    // Don't set progress here - it should already be at 100
    // Just pause for 2 seconds at 100% before hiding
    setTimeout(() => {
      setIsLoading(false);
      setProgressState(0);
    }, 2000);
  };

  const setProgress = (value: number) => {
    setProgressState(Math.min(100, Math.max(0, value)));
  };

  return (
    <GlobalLoadingContext.Provider value={{ showLoading, hideLoading, setProgress, progress }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999]">
          <PresentationLoader progress={progress} />
        </div>
      )}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return context;
}
