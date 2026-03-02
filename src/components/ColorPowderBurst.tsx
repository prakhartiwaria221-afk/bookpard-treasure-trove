import { useEffect, useState, useCallback } from "react";

interface PowderParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  delay: number;
  opacity: number;
  blur: number;
}

interface PowderBurst {
  id: number;
  x: number;
  y: number;
  particles: PowderParticle[];
}

const HOLI_POWDER_COLORS = [
  "hsl(var(--holi-pink))",
  "hsl(var(--holi-yellow))",
  "hsl(var(--holi-purple))",
  "hsl(var(--holi-green))",
  "hsl(var(--holi-orange))",
  "hsl(var(--holi-blue))",
  "hsl(var(--holi-red))",
  "hsl(var(--holi-magenta))",
];

interface ColorPowderBurstProps {
  trigger: number;
  intensity?: "low" | "medium" | "high";
}

export const ColorPowderBurst = ({ trigger, intensity = "medium" }: ColorPowderBurstProps) => {
  const [bursts, setBursts] = useState<PowderBurst[]>([]);

  const createBurst = useCallback((x: number, y: number, id: number) => {
    const particleCount = intensity === "high" ? 40 : intensity === "medium" ? 25 : 15;
    const particles: PowderParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.8;
      const velocity = 1.5 + Math.random() * 5;

      particles.push({
        id: i,
        x: 0,
        y: 0,
        color: HOLI_POWDER_COLORS[Math.floor(Math.random() * HOLI_POWDER_COLORS.length)],
        size: 8 + Math.random() * 16,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity - 1,
        delay: Math.random() * 0.3,
        opacity: 0.6 + Math.random() * 0.4,
        blur: 2 + Math.random() * 6,
      });
    }

    return { id, x, y, particles };
  }, [intensity]);

  useEffect(() => {
    if (trigger === 0) return;

    const burstCount = intensity === "high" ? 4 : intensity === "medium" ? 3 : 2;
    const newBursts: PowderBurst[] = [];

    for (let i = 0; i < burstCount; i++) {
      const x = 15 + Math.random() * 70;
      const y = 20 + Math.random() * 40;
      newBursts.push(createBurst(x, y, Date.now() + i));
    }

    setBursts(newBursts);

    const timer = setTimeout(() => {
      setBursts([]);
    }, 2500);

    return () => clearTimeout(timer);
  }, [trigger, createBurst, intensity]);

  if (bursts.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{
            left: `${burst.x}%`,
            top: `${burst.y}%`,
          }}
        >
          {/* Central color cloud */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-powder-cloud"
            style={{
              width: 60,
              height: 60,
              background: `radial-gradient(circle, ${HOLI_POWDER_COLORS[Math.floor(Math.random() * HOLI_POWDER_COLORS.length)]}80, transparent)`,
              filter: "blur(15px)",
            }}
          />
          {/* Powder particles */}
          {burst.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-powder-particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                opacity: particle.opacity,
                filter: `blur(${particle.blur}px)`,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`,
                "--velocity-x": particle.velocityX,
                "--velocity-y": particle.velocityY,
                animationDelay: `${particle.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
