export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #09090b, #1e1b4b, #581c87)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.2,
        backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Main loader */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        {/* Hexagon container */}
        <div style={{
          width: '200px',
          height: '200px',
          margin: '0 auto 32px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Outer ring */}
          <svg style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            animation: 'spin 3s linear infinite'
          }} viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeDasharray="565"
              strokeDashoffset="141"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Middle ring */}
          <svg style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            animation: 'spin 4s linear infinite reverse'
          }} viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="65"
              fill="none"
              stroke="url(#grad2)"
              strokeWidth="2"
              strokeDasharray="408"
              strokeDashoffset="102"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center hexagon */}
          <div style={{
            width: '64px',
            height: '64px',
            position: 'relative',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <polygon
                points="50 1 95 25 95 75 50 99 5 75 5 25"
                fill="none"
                stroke="url(#hexGrad)"
                strokeWidth="3"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))'
                }}
              />
              <defs>
                <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Center dot */}
          <div style={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(to bottom right, #60a5fa, #a855f7)',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        </div>

        {/* Loading text */}
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            background: 'linear-gradient(to right, #60a5fa, #a855f7, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Loading
          </h2>
          <p style={{
            color: '#9ca3af',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Initializing Systems
          </p>
        </div>
      </div>

      {/* Corner accents */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '128px',
        height: '128px',
        borderTop: '2px solid rgba(99, 102, 241, 0.2)',
        borderLeft: '2px solid rgba(99, 102, 241, 0.2)'
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '128px',
        height: '128px',
        borderTop: '2px solid rgba(168, 85, 247, 0.2)',
        borderRight: '2px solid rgba(168, 85, 247, 0.2)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '128px',
        height: '128px',
        borderBottom: '2px solid rgba(168, 85, 247, 0.2)',
        borderLeft: '2px solid rgba(168, 85, 247, 0.2)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '128px',
        height: '128px',
        borderBottom: '2px solid rgba(236, 72, 153, 0.2)',
        borderRight: '2px solid rgba(236, 72, 153, 0.2)'
      }} />

      {/* Inline animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}} />
    </div>
  );
}
