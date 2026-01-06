import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  shape: "circle" | "square" | "kite";
}

const CONFETTI_COLORS = [
  "hsl(var(--sankranti-saffron))",
  "hsl(var(--sankranti-yellow))",
  "hsl(var(--kite-red))",
  "hsl(var(--kite-blue))",
  "hsl(var(--kite-green))",
  "hsl(var(--kite-purple))",
];

export const Confetti = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const shapes: Array<"circle" | "square" | "kite"> = ["circle", "square", "kite"];
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
    if (piece.shape === "kite") {
      return (
        <svg
          viewBox="0 0 24 30"
          style={{ color: piece.color }}
          className="w-full h-full"
        >
          <path d="M12 0L24 12L12 30L0 12L12 0Z" fill="currentColor" />
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