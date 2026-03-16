'use client';

import { useState } from 'react';
import { TechLoader } from '@/components/ui/TechLoader';
import { PresentationLoader } from '@/components/ui/PresentationLoader';
import { CircularLoader } from '@/components/ui/CircularLoader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoaderPreviewPage() {
  const [techProgress, setTechProgress] = useState(0);
  const [presentationProgress, setPresentationProgress] = useState(0);
  const [autoProgress, setAutoProgress] = useState(false);

  const startAutoProgress = (setter: (p: number) => void) => {
    setter(0);
    setAutoProgress(true);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setter(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setAutoProgress(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Loading Components Gallery
        </h1>
        <p className="text-zinc-400 mb-12">
          Interactive preview of all loading animations with controls
        </p>

        {/* Progress Loaders Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Progress Loaders</h2>
            <p className="text-zinc-400">Loaders that track and display progress from 0% to 100%</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* TechLoader Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-blue-400">TechLoader</h2>
              <button
                onClick={() => startAutoProgress(setTechProgress)}
                disabled={autoProgress}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Auto Progress
              </button>
            </div>
            
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="aspect-video relative">
                <TechLoader progress={techProgress} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progress</span>
                <span className="text-white font-mono">{techProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={techProgress}
                onChange={(e) => setTechProgress(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              
              <div className="grid grid-cols-4 gap-2 mt-3">
                <button
                  onClick={() => setTechProgress(0)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  0%
                </button>
                <button
                  onClick={() => setTechProgress(33)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  33%
                </button>
                <button
                  onClick={() => setTechProgress(66)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  66%
                </button>
                <button
                  onClick={() => setTechProgress(100)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  100%
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-sm">
              <h3 className="font-semibold mb-2 text-blue-400">Features</h3>
              <ul className="space-y-1 text-zinc-400">
                <li>• Triple concentric progress rings</li>
                <li>• Animated geometric patterns</li>
                <li>• Floating data nodes</li>
                <li>• Stage-based status indicators</li>
                <li>• Real-time percentage display</li>
                <li>• Hexagonal tech icon animation</li>
              </ul>
            </div>
          </div>

          {/* PresentationLoader Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-purple-400">PresentationLoader</h2>
              <button
                onClick={() => startAutoProgress(setPresentationProgress)}
                disabled={autoProgress}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                Auto Progress
              </button>
            </div>
            
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="aspect-video relative">
                <PresentationLoader progress={presentationProgress} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Progress</span>
                <span className="text-white font-mono">{presentationProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={presentationProgress}
                onChange={(e) => setPresentationProgress(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              
              <div className="grid grid-cols-4 gap-2 mt-3">
                <button
                  onClick={() => setPresentationProgress(0)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  0%
                </button>
                <button
                  onClick={() => setPresentationProgress(33)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  33%
                </button>
                <button
                  onClick={() => setPresentationProgress(66)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  66%
                </button>
                <button
                  onClick={() => setPresentationProgress(100)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition-colors"
                >
                  100%
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-sm">
              <h3 className="font-semibold mb-2 text-purple-400">Features</h3>
              <ul className="space-y-1 text-zinc-400">
                <li>• Image-based logo reveal</li>
                <li>• Grayscale to color progression</li>
                <li>• Linear progress bar</li>
                <li>• Smooth fade transitions</li>
                <li>• Animated loading dots</li>
                <li>• Brand-focused design</li>
              </ul>
            </div>
          </div>
        </div>
        </div>

        {/* Infinite Loaders Section */}
        <div className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Infinite Loaders</h2>
            <p className="text-zinc-400">Continuous animations for indeterminate loading states</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* CircularLoader Preview */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-cyan-400">CircularLoader</h3>
              
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
                <div className="flex items-center justify-center min-h-[300px]">
                  <CircularLoader size={120} message="Loading presentation..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                  <div className="text-xs text-zinc-400 mb-3 text-center">Large (160px)</div>
                  <div className="flex items-center justify-center min-h-[200px]">
                    <CircularLoader size={160} message="Initializing..." />
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
                  <div className="text-xs text-zinc-400 mb-3 text-center">Small (80px)</div>
                  <div className="flex items-center justify-center min-h-[200px]">
                    <CircularLoader size={80} />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-sm">
                <h4 className="font-semibold mb-2 text-cyan-400">Features</h4>
                <ul className="space-y-1 text-zinc-400">
                  <li>• Three counter-rotating gradient rings</li>
                  <li>• Pulsing center core animation</li>
                  <li>• Three orbiting particles</li>
                  <li>• Animated message dots</li>
                  <li>• Smooth, hypnotic motion</li>
                  <li>• Configurable size and message</li>
                </ul>
              </div>

              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-sm">
                <h4 className="font-semibold mb-2 text-cyan-400">Use Cases</h4>
                <ul className="space-y-1 text-zinc-400">
                  <li>• Page initialization</li>
                  <li>• Data fetching without progress</li>
                  <li>• Saving/updating operations</li>
                  <li>• Modal overlays</li>
                </ul>
              </div>
            </div>

            {/* LoadingSpinner Preview */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-zinc-400">LoadingSpinner <span className="text-xs bg-zinc-800 px-2 py-1 rounded">Legacy</span></h3>
              
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
                <div className="flex items-center justify-center min-h-[300px] scale-50">
                  <LoadingSpinner />
                </div>
              </div>

              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 text-sm">
                <h4 className="font-semibold mb-2 text-zinc-400">Features</h4>
                <ul className="space-y-1 text-zinc-400">
                  <li>• Simple ring animation</li>
                  <li>• Pulse effect</li>
                  <li>• Full-page layout</li>
                  <li>• Minimal design</li>
                </ul>
              </div>

              <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4 text-sm">
                <h4 className="font-semibold mb-2 text-amber-400">⚠️ Deprecation Notice</h4>
                <p className="text-amber-300/80 text-xs leading-relaxed">
                  This component is being phased out in favor of <span className="font-semibold">CircularLoader</span>. 
                  New implementations should use CircularLoader for better visual appeal and flexibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Usage in Code</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-2">TechLoader (Progress)</h3>
              <pre className="bg-zinc-950 p-4 rounded-lg text-sm overflow-x-auto">
                <code className="text-green-400">{`const { showLoading, setProgress, hideLoading } = useGlobalLoading();

// Show tech loader
showLoading('tech');

// Update progress
setProgress(50);

// Hide when done (or it auto-hides at 100%)
hideLoading();`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-purple-400 mb-2">PresentationLoader (Progress)</h3>
              <pre className="bg-zinc-950 p-4 rounded-lg text-sm overflow-x-auto">
                <code className="text-blue-400">{`const { showLoading, setProgress } = useGlobalLoading();

// Show presentation loader
showLoading('presentation');

// Update progress
setProgress(75);`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">CircularLoader (Infinite)</h3>
              <pre className="bg-zinc-950 p-4 rounded-lg text-sm overflow-x-auto">
                <code className="text-cyan-300">{`import { CircularLoader } from '@/components/ui/CircularLoader';

// Full-page loading state
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <CircularLoader size={120} message="Loading data..." />
    </div>
  );
}

// Saving overlay
{saving && (
  <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
    <CircularLoader size={120} message="Saving..." />
  </div>
)}

// Inline small loader
<CircularLoader size={80} />`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Stage Reference for TechLoader */}
        <div className="mt-8 bg-zinc-900 rounded-lg border border-zinc-800 p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-400">TechLoader Stage Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-950 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-2">0-30%</div>
              <div className="text-sm font-semibold mb-1 text-white">Initializing Systems</div>
              <div className="text-xs text-zinc-400">First ring fills, Analytics indicator</div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-2">30-65%</div>
              <div className="text-sm font-semibold mb-1 text-white">Processing Data</div>
              <div className="text-xs text-zinc-400">Second ring fills, AI Engine indicator</div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg">
              <div className="text-2xl font-bold text-pink-400 mb-2">65-95%</div>
              <div className="text-sm font-semibold mb-1 text-white">Finalizing</div>
              <div className="text-xs text-zinc-400">Third ring fills, Data Sync indicator</div>
            </div>
            <div className="bg-zinc-950 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-2">95-100%</div>
              <div className="text-sm font-semibold mb-1 text-white">Complete</div>
              <div className="text-xs text-zinc-400">All rings complete, Ready indicator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
