'use client'

interface Logo {
  url: string
  name: string
  link?: string
}

interface LogoGridProps {
  logos: Logo[]
  columns?: number
  gap?: number
  logoSize?: string
  grayscale?: boolean
  hoverEffect?: boolean
}

export function LogoGrid({
  logos = [],
  columns = 4,
  gap = 24,
  logoSize = '120px',
  grayscale = true,
  hoverEffect = true
}: LogoGridProps) {
  if (logos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500 rounded-lg">
        <p>Add logos</p>
      </div>
    )
  }

  return (
    <div 
      className="w-full h-full p-8 flex items-center justify-center overflow-auto"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        alignContent: 'center'
      }}
    >
      {logos.map((logo, index) => {
        const logoElement = (
          <div
            className={`flex items-center justify-center p-4 rounded-lg transition-all ${
              hoverEffect ? 'hover:scale-110 hover:bg-zinc-800/50' : ''
            }`}
            style={{
              height: logoSize,
              filter: grayscale ? 'grayscale(100%)' : 'none',
            }}
          >
            <img
              src={logo.url}
              alt={logo.name}
              className={`max-w-full max-h-full object-contain transition-all ${
                grayscale && hoverEffect ? 'hover:filter-none' : ''
              }`}
              style={{
                filter: 'inherit'
              }}
            />
          </div>
        )

        if (logo.link) {
          return (
            <a
              key={index}
              href={logo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {logoElement}
            </a>
          )
        }

        return <div key={index}>{logoElement}</div>
      })}
    </div>
  )
}
