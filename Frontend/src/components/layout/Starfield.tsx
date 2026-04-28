import { useMemo } from 'react';

interface StarfieldProps {
  density?: number;
  className?: string;
}

interface Star {
  left: number;
  top: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export function Starfield({ density = 120, className = '' }: StarfieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: density }, (_, i) => {
      const left = (i * 37) % 100;
      const top = (i * 61) % 100;
      const size = 1 + ((i * 17) % 3);
      const opacity = 0.25 + ((i * 13) % 50) / 100;
      const delay = ((i * 7) % 40) / 10;
      const duration = 2.5 + ((i * 11) % 40) / 10;

      return { left, top, size, opacity, delay, duration };
    });
  }, [density]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {stars.map((star, index) => (
        <span
          key={`${star.left}-${star.top}-${index}`}
          className="star-dot"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
