import React from 'react'

interface AbstractSeparatorProps {
  fillColor?: string
  strokeColor?: string
  bgColor?: string
  className?: string
}

export const AbstractSeparator: React.FC<AbstractSeparatorProps> = ({
  fillColor = '#fff',
  strokeColor = '#000',
  bgColor = 'transparent',
  className = '',
}) => {
  return (
    <div
      className={`w-full overflow-hidden leading-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <svg
        className="relative block h-[60px] w-[calc(100%+1.3px)] sm:h-[100px] md:h-[150px]"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        shapeRendering="geometricPrecision"
      >
        <path
          d="M0,0 V50 C123,135 266,131 400,80 C534,29 658,10 792,40 C926,70 1080,110 1200,60 V0 Z"
          style={{ fill: fillColor, stroke: 'none' }}
        />

        <path
          d="M0,50 C123,135 266,131 400,80 C534,29 658,10 792,40 C926,70 1080,110 1200,60"
          style={{
            fill: 'none',
            stroke: strokeColor,
            strokeWidth: '2px',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            vectorEffect: 'non-scaling-stroke',
          }}
        />
      </svg>
    </div>
  )
}
