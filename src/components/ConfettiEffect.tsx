import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  shape: "circle" | "square" | "triangle";
  size: number;
}

const COLORS = [
  "hsl(45 85% 50%)",      // gold
  "hsl(340 75% 65%)",     // pink
  "hsl(280 65% 60%)",     // purple
  "hsl(200 80% 55%)",     // blue
  "hsl(140 60% 50%)",     // green
  "hsl(0 75% 55%)",       // red
  "hsl(45 90% 65%)",      // light gold
];

const SHAPES: ("circle" | "square" | "triangle")[] = ["circle", "square", "triangle"];

export const ConfettiEffect = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const generatePieces = () => {
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 3 + Math.random() * 4,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          size: 6 + Math.random() * 8,
        });
      }
      setPieces(newPieces);
    };

    generatePieces();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece ${piece.shape}`}
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.shape !== "triangle" ? piece.color : "transparent",
            borderBottomColor: piece.shape === "triangle" ? piece.color : undefined,
            width: piece.shape !== "triangle" ? piece.size : 0,
            height: piece.shape !== "triangle" ? piece.size : 0,
            borderLeftWidth: piece.shape === "triangle" ? piece.size / 2 : undefined,
            borderRightWidth: piece.shape === "triangle" ? piece.size / 2 : undefined,
            borderBottomWidth: piece.shape === "triangle" ? piece.size : undefined,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
