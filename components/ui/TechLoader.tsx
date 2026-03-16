'use client';

import { useEffect, useState } from 'react';

interface TechLoaderProps {
  progress?: number; // 0-100
}

export function TechLoader({ progress = 0 }: TechLoaderProps) {
  const [visible, setVisible] = useState(false);
  const [dataNodes, setDataNodes] = useState<Array<{ x: number; y: number; delay: number }>>([]);
  
  // Fade in animation
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // Generate random data nodes for background animation
  useEffect(() => {
    const nodes = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setDataNodes(nodes);
  }, []);

  // Calculate progress stages
  const stage1 = Math.min(100, progress * 3.33); // First ring completes at 30%
  const stage2 = Math.max(0, Math.min(100, (progress - 30) * 2.86)); // Second ring at 30-65%
  const stage3 = Math.max(0, Math.min(100, (progress - 65) * 2.86)); // Third ring at 65-100%

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-zinc-950 via-blue-950/20 to-purple-950/20">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            animation: 'gridScroll 20s linear infinite'
          }}
        />
      </div>

      {/* Floating data nodes */}
      {dataNodes.map((node, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            animation: `pulse 2s ease-in-out infinite`,
            animationDelay: `${node.delay}s`,
            boxShadow: '0 0 10px rgba(96, 165, 250, 0.6)'
          }}
        />
      ))}

      {/* Main content */}
      <div className={`relative z-10 transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Central loading hub */}
        <div className="relative flex flex-col items-center">
          {/* Outer rotating ring system */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Ring 1 - Outer */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="160"
                cy="160"
                r="145"
                fill="none"
                stroke="rgba(99, 102, 241, 0.1)"
                strokeWidth="2"
              />
              <circle
                cx="160"
                cy="160"
                r="145"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 145}`}
                strokeDashoffset={`${2 * Math.PI * 145 * (1 - stage1 / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Ring 2 - Middle */}
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="160"
                cy="160"
                r="115"
                fill="none"
                stroke="rgba(168, 85, 247, 0.1)"
                strokeWidth="2"
              />
              <circle
                cx="160"
                cy="160"
                r="115"
                fill="none"
                stroke="url(#gradient2)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 115}`}
                strokeDashoffset={`${2 * Math.PI * 115 * (1 - stage2 / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>

            {/* Ring 3 - Inner */}
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="160"
                cy="160"
                r="85"
                fill="none"
                stroke="rgba(236, 72, 153, 0.1)"
                strokeWidth="2"
              />
              <circle
                cx="160"
                cy="160"
                r="85"
                fill="none"
                stroke="url(#gradient3)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 85}`}
                strokeDashoffset={`${2 * Math.PI * 85 * (1 - stage3 / 100)}`}
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
              <defs>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {/* Hexagonal tech icon */}
                <div className="relative mb-4 flex items-center justify-center">
                  <div 
                    className="w-16 h-16 relative"
                    style={{
                      animation: 'spin 8s linear infinite'
                    }}
                  >
                    {/* Hexagon */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <polygon
                        points="50 1 95 25 95 75 50 99 5 75 5 25"
                        fill="none"
                        stroke="url(#hexGradient)"
                        strokeWidth="2"
                        style={{
                          filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
                        }}
                      />
                      <defs>
                        <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Inner pulse */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      animation: 'pulse 2s ease-in-out infinite'
                    }}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" 
                      style={{
                        boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)'
                      }}
                    />
                  </div>
                </div>

                {/* Progress percentage */}
                <div 
                  className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  style={{
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {Math.round(progress)}%
                </div>

                {/* Status text */}
                <div className="text-zinc-400 text-sm font-medium tracking-wider uppercase">
                  {progress < 30 && 'Initializing Systems'}
                  {progress >= 30 && progress < 65 && 'Processing Data'}
                  {progress >= 65 && progress < 100 && 'Finalizing'}
                  {progress >= 100 && 'Complete'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom status indicators */}
          <div className="mt-12 flex items-center gap-6">
            {/* Status indicators */}
            {[
              { label: 'Analytics', active: progress >= 10 },
              { label: 'AI Engine', active: progress >= 35 },
              { label: 'Data Sync', active: progress >= 60 },
              { label: 'Ready', active: progress >= 95 }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    item.active 
                      ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' 
                      : 'bg-zinc-700'
                  }`}
                />
                <span className={`text-xs font-medium transition-colors duration-500 ${
                  item.active ? 'text-zinc-300' : 'text-zinc-600'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tech tagline */}
          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-xs tracking-widest uppercase">
              Powered by Advanced Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Corner accent lines */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-blue-500/20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-purple-500/20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-purple-500/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-pink-500/20" />

      {/* Inline animations */}
      <style jsx>{`
        @keyframes gridScroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(40px, 40px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
