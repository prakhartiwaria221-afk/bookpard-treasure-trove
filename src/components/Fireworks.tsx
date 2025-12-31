import { useEffect, useState, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  life: number;
  delay: number;
}

interface FireworkBurst {
  id: number;
  x: number;
  y: number;
  particles: Particle[];
}

const FIREWORK_COLORS = [
  "hsl(var(--newyear-gold))",
  "hsl(var(--newyear-midnight-light))",
  "hsl(var(--confetti-pink))",
  "hsl(var(--confetti-purple))",
  "hsl(var(--sparkle))",
  "hsl(var(--newyear-champagne))",
];

interface FireworksProps {
  trigger: number; // Increment this to trigger fireworks
  intensity?: "low" | "medium" | "high";
}

export const Fireworks = ({ trigger, intensity = "medium" }: FireworksProps) => {
  const [bursts, setBursts] = useState<FireworkBurst[]>([]);

  const createBurst = useCallback((x: number, y: number, id: number) => {
    const particleCount = intensity === "high" ? 30 : intensity === "medium" ? 20 : 12;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const velocity = 2 + Math.random() * 4;
      
      particles.push({
        id: i,
        x: 0,
        y: 0,
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        size: 3 + Math.random() * 4,
        velocityX: Math.cos(angle) * velocity,
        velocityY: Math.sin(angle) * velocity,
        life: 1,
        delay: Math.random() * 0.2,
      });
    }

    return { id, x, y, particles };
  }, [intensity]);

  useEffect(() => {
    if (trigger === 0) return;

    const burstCount = intensity === "high" ? 5 : intensity === "medium" ? 3 : 2;
    const newBursts: FireworkBurst[] = [];

    for (let i = 0; i < burstCount; i++) {
      const x = 20 + Math.random() * 60; // 20-80% of screen width
      const y = 20 + Math.random() * 40; // 20-60% of screen height
      newBursts.push(createBurst(x, y, Date.now() + i));
    }

    setBursts(newBursts);

    // Clear bursts after animation
    const timer = setTimeout(() => {
      setBursts([]);
    }, 2000);

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
          {burst.particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full animate-firework-particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
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