import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', animated = true }) => {
  const sizeMap = {
    sm: { box: 32, ring: 14, stroke: 1.5, bars: 3 },
    md: { box: 44, ring: 18, stroke: 2, bars: 4 },
    lg: { box: 64, ring: 26, stroke: 2.5, bars: 5 },
  };

  const config = sizeMap[size];
  const center = config.box / 2;

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: config.box, height: config.box }}>
      <svg
        viewBox={`0 0 ${config.box} ${config.box}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="orbit-grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#FD79A8" />
          </linearGradient>
          <linearGradient id="orbit-grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00B894" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Orbit Ring 1 */}
        <ellipse
          cx={center}
          cy={center}
          rx={config.ring}
          ry={config.ring * 0.42}
          fill="none"
          stroke="url(#orbit-grad-purple)"
          strokeWidth={config.stroke}
          strokeDasharray="4 2"
          transform={`rotate(-28 ${center} ${center})`}
          className={animated ? 'animate-orbit origin-center' : ''}
          filter="url(#glow)"
        />

        {/* Orbit Ring 2 */}
        <ellipse
          cx={center}
          cy={center}
          rx={config.ring * 0.85}
          ry={config.ring * 0.35}
          fill="none"
          stroke="url(#orbit-grad-cyan)"
          strokeWidth={config.stroke * 0.9}
          transform={`rotate(40 ${center} ${center})`}
          className={animated ? 'animate-orbit-reverse origin-center opacity-80' : 'opacity-80'}
        />

        {/* Central Core Satellite Sphere */}
        <circle
          cx={center}
          cy={center}
          r={config.box * 0.14}
          fill="#0A0A1A"
          stroke="#6C5CE7"
          strokeWidth={config.stroke}
        />

        {/* Voice Waveform Bars in Center */}
        <g transform={`translate(${center - 6}, ${center - 5})`}>
          <rect x="0" y="3" width="2" height="6" rx="1" fill="#00B894" className={animated ? 'animate-pulse' : ''} />
          <rect x="3.5" y="1" width="2" height="10" rx="1" fill="#6C5CE7" />
          <rect x="7" y="0" width="2" height="12" rx="1" fill="#FD79A8" className={animated ? 'animate-pulse' : ''} />
          <rect x="10.5" y="2.5" width="2" height="7" rx="1" fill="#00B894" />
        </g>
      </svg>
    </div>
  );
};
