'use client';

interface CircularLoaderProps {
  size?: number;
  message?: string;
}

export function CircularLoader({ size = 120, message }: CircularLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer rotating ring - Solid Eggplant */}
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '3s' }}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#431C5B"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="70 213"
          />
        </svg>

        {/* Middle counter-rotating ring - Solid Navy */}
        <svg
          className="absolute inset-0"
          style={{ 
            animation: 'spin 2s linear infinite reverse',
            animationDelay: '0.2s'
          }}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#1d1f48"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="50 170"
          />
        </svg>

        {/* Inner fast rotating ring - Solid Raspberry */}
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: '1.5s' }}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="50"
            cy="50"
            r="25"
            stroke="#B21A53"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="30 127"
          />
        </svg>

        {/* Center pulsing core - Core Green */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-4 h-4 rounded-full animate-pulse"
            style={{ 
              animationDuration: '2s',
              backgroundColor: '#4bcd3e',
              boxShadow: '0 0 15px #4bcd3e, 0 0 30px rgba(75, 205, 62, 0.4)'
            }}
          />
        </div>

        {/* Orbiting particles - Core Green */}
        <div className="absolute inset-0">
          {[0, 120, 240].map((angle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                animation: `orbit 3s linear infinite`,
                animationDelay: `${i * 1}s`,
                opacity: 0.7,
                backgroundColor: '#4bcd3e',
                boxShadow: '0 0 8px rgba(75, 205, 62, 0.6)'
              }}
            />
          ))}
        </div>
      </div>

      {message && (
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-zinc-300">{message}</p>
          <div className="flex items-center justify-center gap-1">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ animationDelay: '0ms', backgroundColor: '#4bcd3e' }}
            />
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ animationDelay: '150ms', backgroundColor: '#4bcd3e' }}
            />
            <div 
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ animationDelay: '300ms', backgroundColor: '#4bcd3e' }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(${size * 0.4}px) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(${size * 0.4}px) rotate(-360deg);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
