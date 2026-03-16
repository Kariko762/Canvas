'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { PresentationLoader } from './PresentationLoader';
import { TechLoader } from './TechLoader';

type LoaderStyle = 'presentation' | 'tech';

interface GlobalLoadingContextType {
  showLoading: (style?: LoaderStyle) => void;
  hideLoading: () => void;
  setProgress: (progress: number) => void;
  progress: number;
  loaderStyle: LoaderStyle;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [loaderStyle, setLoaderStyle] = useState<LoaderStyle>('presentation'); // Default to presentation loader

  const showLoading = (style: LoaderStyle = 'presentation') => {
    setLoaderStyle(style);
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
    <GlobalLoadingContext.Provider value={{ showLoading, hideLoading, setProgress, progress, loaderStyle }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999]">
          {loaderStyle === 'presentation' ? (
            <PresentationLoader progress={progress} />
          ) : (
            <TechLoader progress={progress} />
          )}
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
