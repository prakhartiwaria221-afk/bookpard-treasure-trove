import { useEffect, useState, useMemo } from "react";

interface Kite {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  rotation: number;
}

const KITE_COLORS = [
  "hsl(var(--kite-red))",
  "hsl(var(--kite-blue))",
  "hsl(var(--kite-green))",
  "hsl(var(--kite-purple))",
  "hsl(var(--kite-pink))",
  "hsl(var(--sankranti-saffron))",
  "hsl(var(--sankranti-yellow))",
];

export const KiteEffect = () => {
  const [kites, setKites] = useState<Kite[]>([]);

  useEffect(() => {
    const pieces: Kite[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 20 + 20,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 8,
      color: KITE_COLORS[Math.floor(Math.random() * KITE_COLORS.length)],
      rotation: Math.random() * 30 - 15,
    }));
    setKites(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {kites.map((kite) => (
        <div
          key={kite.id}
          className="absolute animate-kite-fly"
          style={{
            left: `${kite.left}%`,
            animationDuration: `${kite.duration}s`,
            animationDelay: `${kite.delay}s`,
          }}
        >
          {/* Kite body */}
          <svg
            width={kite.size}
            height={kite.size * 1.25}
            viewBox="0 0 40 50"
            style={{
              transform: `rotate(${kite.rotation}deg)`,
              filter: `drop-shadow(2px 4px 6px rgba(0,0,0,0.2))`,
            }}
          >
            {/* Main kite shape */}
            <path
              d="M20 0 L40 20 L20 50 L0 20 Z"
              fill={kite.color}
              opacity="0.9"
            />
            {/* Cross pattern */}
            <line x1="20" y1="0" x2="20" y2="50" stroke="white" strokeWidth="1" opacity="0.5" />
            <line x1="0" y1="20" x2="40" y2="20" stroke="white" strokeWidth="1" opacity="0.5" />
            {/* Kite tail */}
            <path
              d="M20 50 Q25 60 20 70 Q15 80 20 90"
              fill="none"
              stroke={kite.color}
              strokeWidth="2"
              opacity="0.7"
            />
            {/* Tail ribbons */}
            <circle cx="20" cy="60" r="2" fill={kite.color} opacity="0.8" />
            <circle cx="20" cy="75" r="2" fill={kite.color} opacity="0.6" />
            <circle cx="20" cy="90" r="2" fill={kite.color} opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );
};