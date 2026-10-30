import React, { useEffect, useState } from 'react';

interface PlayerAvatarProps {
  src: string;
  name: string;
  shirtNumber?: number;
  position?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Renders the local player/legend portrait directly from /images/players/*
 * with strict `object-fit: cover` and `object-position: top center` so faces
 * and Real Madrid kits are always crisp, uncropped at the head, and undistorted.
 */
export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  src,
  name,
  shirtNumber,
  position,
  className = 'w-full h-full object-cover object-top',
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-[#121C38] via-[#0B1224] to-[#060913] text-[#F5D061] select-none overflow-hidden ${className}`}
        role="img"
        aria-label={name}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#D4AF37_0%,transparent_70%)]" />
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/60 bg-[#060913]/80 flex items-center justify-center font-bold text-lg text-[#F5D061] shadow-inner">
            {shirtNumber !== undefined && shirtNumber < 100 ? `#${shirtNumber}` : initials}
          </div>
          <span className="mt-1.5 text-[11px] font-semibold tracking-wider uppercase text-white/90 line-clamp-1">
            {name}
          </span>
          {position && (
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37]">
              {position}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      width={420}
      height={540}
      style={{ objectFit: 'cover', objectPosition: 'top center' }}
      {...(priority
        ? ({ fetchpriority: 'high' } as React.ImgHTMLAttributes<HTMLImageElement>)
        : { loading: 'lazy', decoding: 'async' })}
      onError={() => setHasError(true)}
      className={`${className} object-cover object-[center_top]`}
    />
  );
};
