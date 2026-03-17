'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Check } from 'lucide-react';

interface LoadingStep {
  id: string;
  label: string;
  completed: boolean;
}

interface GlobalLoadingContextType {
  showLoading: (steps?: LoadingStep[]) => void;
  hideLoading: () => void;
  completeStep: (stepId: string) => void;
  isLoading: boolean;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<LoadingStep[]>([]);

  const showLoading = (initialSteps?: LoadingStep[]) => {
    setIsLoading(true);
    if (initialSteps) {
      setSteps(initialSteps);
    } else {
      setSteps([]);
    }
  };

  const hideLoading = () => {
    setIsLoading(false);
    setSteps([]);
  };

  const completeStep = (stepId: string) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  return (
    <GlobalLoadingContext.Provider value={{ showLoading, hideLoading, completeStep, isLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center">
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0" 
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                animation: 'gridScroll 30s linear infinite'
              }}
            />
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Spinner */}
            <div className="relative w-32 h-32 flex items-center justify-center mb-12">
              {/* Spinning outer ring */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 animate-spin" 
                style={{ animationDuration: '1.5s' }} 
              />
              
              {/* Spinning inner ring (opposite direction) */}
              <div 
                className="absolute inset-4 rounded-full border-4 border-transparent border-b-violet-400 border-l-fuchsia-400 animate-spin" 
                style={{ animationDuration: '2s', animationDirection: 'reverse' }} 
              />
              
              {/* Center glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl" />
              
              {/* Center dot */}
              <div className="relative w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 shadow-lg shadow-purple-500/50" />
            </div>

            {/* Steps tracker */}
            {steps.length > 0 && (
              <div className="flex flex-col space-y-3 min-w-[400px]">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 transition-all duration-300 ${
                      step.completed ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      step.completed 
                        ? 'bg-indigo-500 border-indigo-400' 
                        : 'border-zinc-600 bg-zinc-800/50'
                    }`}>
                      {step.completed && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                    </div>

                    {/* Step label */}
                    <div className={`flex-1 text-base font-medium transition-colors duration-300 ${
                      step.completed 
                        ? 'text-white' 
                        : 'text-zinc-400'
                    }`}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Default loading text (when no steps) */}
            {steps.length === 0 && (
              <div className="mt-8 text-center">
                <p className="text-white text-lg font-medium">Loading...</p>
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes gridScroll {
              0% {
                transform: translateY(0) translateX(0);
              }
              100% {
                transform: translateY(60px) translateX(60px);
              }
            }
          `}</style>
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
