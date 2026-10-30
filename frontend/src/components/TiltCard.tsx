import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  maxTiltDeg?: number;
}

/**
 * 3D Holographic Card Tilt with FIFA / EA FC Ultimate Team Foil Glare Sheen.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  style: externalStyle,
  onClick,
  maxTiltDeg = 7,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 280ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1))',
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = x / rect.width;
    const pctY = y / rect.height;

    const rotateY = (pctX - 0.5) * (maxTiltDeg * 2);
    const rotateX = (0.5 - pctY) * (maxTiltDeg * 2);

    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 80ms linear',
    });

    setGlareStyle({
      opacity: 1,
      background: `radial-gradient(circle at ${(pctX * 100).toFixed(1)}% ${(
        pctY * 100
      ).toFixed(
        1
      )}%, rgba(245, 208, 97, 0.28) 0%, rgba(255, 255, 255, 0.1) 28%, transparent 68%)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 320ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1))',
    });
    setGlareStyle({ opacity: 0, transition: 'opacity 300ms ease' });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...externalStyle, ...tiltStyle }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        style={glareStyle}
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl mix-blend-screen"
      />
      {children}
    </div>
  );
};
