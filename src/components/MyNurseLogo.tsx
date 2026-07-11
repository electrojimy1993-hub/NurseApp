import React from 'react';

interface MyNurseLogoProps {
  className?: string;
  size?: number;
}

export default function MyNurseLogo({ className = '', size = 48 }: MyNurseLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Soft circular background outline */}
      <circle cx="50" cy="50" r="46" fill="#F7F8F3" fillOpacity="0.8" stroke="#CCD5AE" strokeWidth="1" strokeDasharray="2 2" />
      
      {/* Floating S/N Wave on top (Teal and Blue) */}
      <path
        d="M36 24 C40 20, 46 19, 50 25 C54 31, 60 30, 64 26"
        stroke="#0D9488"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M40 25 C43 22, 47 21, 50 25 C53 29, 57 28, 60 25"
        stroke="#1E40AF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Blue Crest/Shield Boundary */}
      <path
        d="M32 36 L50 29 L68 36 L68 53 C68 64, 58 74, 50 80 C42 74, 32 64, 32 53 Z"
        stroke="#1E40AF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Heart-like frames around the cross */}
      {/* Left teal heart */}
      <path
        d="M41 42 C33 34, 25 46, 36 57 C41 62, 47 66, 50 68"
        stroke="#0D9488"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right teal heart */}
      <path
        d="M59 42 C67 34, 75 46, 64 57 C59 62, 53 66, 50 68"
        stroke="#0D9488"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Medical Cross in center (Deep Blue) */}
      <path
        d="M48 37 H52 V63 H48 Z"
        fill="#1E40AF"
      />
      <path
        d="M37 46 H63 V50 H37 Z"
        fill="#1E40AF"
      />

      {/* White Nurse Cap in center of cross */}
      <path
        d="M45 49 L42 46.5 L58 46.5 L55 49 Z"
        fill="white"
        stroke="#1E40AF"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M45 46.5 C46.5 42, 53.5 42, 55 46.5 Z"
        fill="white"
        stroke="#1E40AF"
        strokeWidth="1"
      />
      {/* Small blue star in cap */}
      <polygon
        points="50,43.2 51.1,45.3 53.4,45.6 51.7,47.1 52.2,49.3 50,48.2 47.8,49.3 48.3,47.1 46.6,45.6 48.9,45.3"
        fill="#1E40AF"
      />
    </svg>
  );
}
