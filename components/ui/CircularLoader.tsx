'use client';

interface CircularLoaderProps {
  size?: number;
  message?: string;
}

export function CircularLoader({ size = 120, message }: CircularLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
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
        <div className="relative w-4 h-4 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 shadow-lg shadow-purple-500/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {message && (
        <p className="text-sm font-medium text-zinc-300">{message}</p>
      )}
    </div>
  );
}
