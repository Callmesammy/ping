import React from 'react';

interface PingLogoSvgProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'icon' | 'badge';
  fillColor?: string;
  accentColor?: string;
}

export const PingLogoSvg: React.FC<PingLogoSvgProps> = ({
  className = '',
  size = 48,
  variant = 'full',
  fillColor = '#C84B31',
  accentColor = '#FFD600',
}) => {
  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="50" cy="50" r="48" fill={fillColor} />
        <circle cx="50" cy="50" r="42" fill="none" stroke="#F9F1F0" strokeWidth="3" strokeDasharray="6 4" />
        <path
          d="M54 16L28 55h20l-8 30 34-40H52l10-29z"
          fill={accentColor}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size * 2.8}
      height={size}
      viewBox="0 0 280 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="280" height="100" rx="30" fill={fillColor} />
      <path
        d="M62 20L34 58h20l-8 26 36-36H60l10-24z"
        fill={accentColor}
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text
        x="105"
        y="68"
        fontFamily="Impact, 'Bebas Neue', sans-serif"
        fontSize="62"
        fontWeight="900"
        fill="#F9F1F0"
        letterSpacing="2"
      >
        PING
      </text>
    </svg>
  );
};
