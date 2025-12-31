import { useMemo } from "react";

const LIGHT_COLORS = [
  "hsl(var(--newyear-gold))",
  "hsl(var(--newyear-midnight))",
  "hsl(var(--confetti-pink))",
  "hsl(var(--sparkle))",
  "hsl(var(--confetti-purple))",
];

export const CelebrationLights = () => {
  const lights = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: LIGHT_COLORS[i % LIGHT_COLORS.length],
      delay: i * 0.15,
    }));
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden pointer-events-none">
      <div className="flex justify-between px-2">
        {lights.map((light) => (
          <div key={light.id} className="flex flex-col items-center">
            {/* Wire */}
            <div className="w-px h-1 bg-foreground/20" />
            {/* Light bulb */}
            <div
              className="w-2 h-2.5 rounded-full animate-twinkle-star"
              style={{
                backgroundColor: light.color,
                boxShadow: `0 0 6px 2px ${light.color}, 0 0 10px 4px ${light.color}40`,
                animationDelay: `${light.delay}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};