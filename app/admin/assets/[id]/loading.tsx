export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#010102',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Logo container */}
      <div style={{
        position: 'relative',
        maxWidth: '90vw',
        maxHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}>
        {/* Grayscale logo */}
        <img 
          src="/loading-menu-shadow.png" 
          alt="Loading"
          style={{
            display: 'block',
            width: 'auto',
            height: 'auto',
            maxWidth: '90vw',
            maxHeight: '70vh',
            opacity: 0.4
          }}
        />
        
        {/* Loading text */}
        <div style={{
          textAlign: 'center'
        }}>
          <p style={{
            color: '#E6E7E8',
            fontSize: '18px',
            fontWeight: 500,
            marginBottom: '8px'
          }}>
            Building Presentation
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#4bcd3e', animation: 'pulse 1.5s infinite' }}>●</span>
            <span style={{ color: '#4bcd3e', animation: 'pulse 1.5s infinite 0.2s' }}>●</span>
            <span style={{ color: '#4bcd3e', animation: 'pulse 1.5s infinite 0.4s' }}>●</span>
          </div>
        </div>
      </div>

      {/* Progress bar - indeterminate animation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: '#0D0D0D',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: '30%',
          backgroundColor: '#4bcd3e',
          animation: 'indeterminate 2s infinite ease-in-out'
        }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        
        @keyframes indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
