import { Sparkles, PartyPopper, Star } from "lucide-react";

export const NewYearBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-newyear-midnight via-newyear-gold-dark to-newyear-midnight py-2 px-4">
      {/* Animated stars background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <Star
            key={i}
            className="absolute animate-twinkle-star text-newyear-gold-light/60 fill-newyear-gold-light/60"
            style={{
              left: `${(i * 8.3) + 2}%`,
              top: `${Math.sin(i) * 30 + 50}%`,
              width: `${8 + (i % 3) * 4}px`,
              height: `${8 + (i % 3) * 4}px`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex items-center justify-center gap-3 flex-wrap">
        <PartyPopper className="h-4 w-4 md:h-5 md:w-5 text-newyear-gold-light animate-bounce-slow" />
        
        <span className="font-dancing text-lg md:text-xl lg:text-2xl font-bold text-newyear-gold-light tracking-wide">
          ✨ Happy New Year 2026! ✨
        </span>
        
        <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-newyear-gold-light animate-sparkle" />
        
        <span className="hidden sm:inline-block text-sm text-newyear-silver-light font-medium">
          — Special Book Sale Now Live! —
        </span>
        
        <PartyPopper className="h-4 w-4 md:h-5 md:w-5 text-newyear-gold-light animate-bounce-slow scale-x-[-1]" style={{ animationDelay: "0.5s" }} />
      </div>
    </div>
  );
};
