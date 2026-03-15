import React from 'react'

interface TkweenLogoProps {
  size?: number
  showText?: boolean
  textColor?: string
  dark?: boolean
}

export default function TkweenLogo({
  size = 48,
  showText = true,
  dark = false,
}: TkweenLogoProps) {
  const textCol = dark ? '#ffffff' : '#0a1e1a'
  const bgCol = dark ? '#0a1e1a' : '#ffffff'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.25 }}>
      {/* Play button triangle logo */}
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Outer triangle (play button) */}
        <polygon points="15,5 95,50 15,95" fill="#2dd4bf" />
        {/* White inner cutout — forms the "ك" / bracket shape */}
        <polygon points="30,25 70,50 30,75" fill={bgCol} />
        {/* Small accent dot (play button inside the bracket) */}
        <circle cx="45" cy="50" r="5" fill="#2dd4bf" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontWeight: 700,
              fontSize: size * 0.45,
              color: textCol,
            }}
          >
            تكوين
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 200,
              fontSize: size * 0.22,
              letterSpacing: '0.15em',
              color: textCol,
            }}
          >
            TKWEEN
          </span>
        </div>
      )}
    </div>
  )
}
