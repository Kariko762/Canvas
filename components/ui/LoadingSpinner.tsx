'use client'

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          {/* Inner pulse */}
          <div className="absolute inset-2 rounded-full bg-blue-500/20 animate-pulse"></div>
        </div>
        <p className="text-zinc-400 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
