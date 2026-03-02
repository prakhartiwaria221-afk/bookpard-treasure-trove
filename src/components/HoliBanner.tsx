import { Paintbrush, Palette, Droplets } from "lucide-react";

export const HoliBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[hsl(320,80%,55%)] via-[hsl(45,90%,55%)] to-[hsl(280,70%,55%)] py-2.5 px-4">
      {/* Animated color splashes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-holi-splash"
            style={{
              left: `${i * 10 + 2}%`,
              top: `${Math.sin(i * 0.8) * 30 + 40}%`,
              width: `${8 + Math.random() * 12}px`,
              height: `${8 + Math.random() * 12}px`,
              backgroundColor: [
                'hsl(var(--holi-pink))',
                'hsl(var(--holi-yellow))',
                'hsl(var(--holi-purple))',
                'hsl(var(--holi-green))',
                'hsl(var(--holi-orange))',
                'hsl(var(--holi-blue))',
              ][i % 6],
              opacity: 0.5,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap">
        <Palette className="h-4 w-4 md:h-5 md:w-5 text-white animate-holi-rotate" />

        <span className="font-dancing text-lg md:text-xl lg:text-2xl font-bold text-white tracking-wide drop-shadow-lg">
          🎨 Happy Holi 2026! 🌈
        </span>

        <Paintbrush className="h-4 w-4 md:h-5 md:w-5 text-white animate-holi-rotate" style={{ animationDelay: "0.5s" }} />

        <span className="hidden sm:inline-block text-sm text-white/90 font-medium drop-shadow">
          — Festival of Colors Sale! —
        </span>

        <Droplets className="h-4 w-4 md:h-5 md:w-5 text-white animate-holi-splash-icon" />
      </div>
    </div>
  );
};
