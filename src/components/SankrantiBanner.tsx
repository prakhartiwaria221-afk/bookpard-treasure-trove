import { Sun } from "lucide-react";

export const SankrantiBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-sankranti-saffron via-sankranti-yellow to-sankranti-saffron py-2 px-4">
      {/* Animated kites background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-kite-sway"
            style={{
              left: `${(i * 12.5) + 2}%`,
              top: `${Math.sin(i) * 20 + 50}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <svg
              width="16"
              height="20"
              viewBox="0 0 16 20"
              className="opacity-40"
              style={{
                fill: i % 4 === 0 ? 'hsl(var(--kite-red))' : 
                      i % 4 === 1 ? 'hsl(var(--kite-blue))' :
                      i % 4 === 2 ? 'hsl(var(--kite-green))' : 'hsl(var(--kite-purple))',
              }}
            >
              <path d="M8 0L16 10L8 20L0 10L8 0Z" />
              <line x1="8" y1="20" x2="8" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        ))}
      </div>
      
      <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap">
        <Sun className="h-4 w-4 md:h-5 md:w-5 text-white animate-sun-pulse" />
        
        <span className="font-dancing text-lg md:text-xl lg:text-2xl font-bold text-white tracking-wide drop-shadow-md">
          🪁 Happy Makar Sankranti 2026! 🪁
        </span>
        
        <Sun className="h-4 w-4 md:h-5 md:w-5 text-white animate-sun-pulse" style={{ animationDelay: "0.5s" }} />
        
        <span className="hidden sm:inline-block text-sm text-white/90 font-medium">
          — Special Book Sale Now Live! —
        </span>
        
        <div className="h-4 w-4 md:h-5 md:w-5 animate-kite-sway" style={{ animationDelay: "1s" }}>
          <svg viewBox="0 0 16 20" className="w-full h-full" fill="hsl(var(--kite-red))">
            <path d="M8 0L16 10L8 20L0 10L8 0Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};