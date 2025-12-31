import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  shape: "circle" | "square" | "star";
}

const CONFETTI_COLORS = [
  "hsl(var(--newyear-gold))",
  "hsl(var(--newyear-midnight))",
  "hsl(var(--confetti-pink))",
  "hsl(var(--confetti-purple))",
  "hsl(var(--sparkle))",
  "hsl(var(--newyear-silver))",
];

export const Confetti = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const shapes: Array<"circle" | "square" | "star"> = ["circle", "square", "star"];
    const pieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 10 + 6,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.6 + 0.4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setConfetti(pieces);
  }, []);

  const renderShape = (piece: ConfettiPiece) => {
    if (piece.shape === "star") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: piece.color }}
          className="w-full h-full"
        >
          <path d="M12 2L13.5 8.5L20 9L15 13L16.5 20L12 16L7.5 20L9 13L4 9L10.5 8.5L12 2Z" />
        </svg>
      );
    }
    
    if (piece.shape === "circle") {
      return (
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      );
    }
    
    return (
      <div
        className="w-full h-full rotate-45"
        style={{ backgroundColor: piece.color }}
      />
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            opacity: piece.opacity,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {renderShape(piece)}
        </div>
      ))}
    </div>
  );
};