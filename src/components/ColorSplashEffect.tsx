import { useEffect, useState } from "react";

interface ColorSplash {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  blur: number;
}

const HOLI_COLORS = [
  "hsl(var(--holi-pink))",
  "hsl(var(--holi-yellow))",
  "hsl(var(--holi-purple))",
  "hsl(var(--holi-green))",
  "hsl(var(--holi-orange))",
  "hsl(var(--holi-blue))",
  "hsl(var(--holi-red))",
  "hsl(var(--holi-magenta))",
];

export const ColorSplashEffect = () => {
  const [splashes, setSplashes] = useState<ColorSplash[]>([]);

  useEffect(() => {
    const pieces: ColorSplash[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 20 + Math.random() * 60,
      color: HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)],
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      blur: 15 + Math.random() * 25,
    }));
    setSplashes(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {splashes.map((splash) => (
        <div
          key={splash.id}
          className="absolute rounded-full animate-color-float"
          style={{
            left: `${splash.left}%`,
            top: `${splash.top}%`,
            width: `${splash.size}px`,
            height: `${splash.size}px`,
            backgroundColor: splash.color,
            opacity: 0.08,
            filter: `blur(${splash.blur}px)`,
            animationDuration: `${splash.duration}s`,
            animationDelay: `${splash.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
