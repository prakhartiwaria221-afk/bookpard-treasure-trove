import type { Config } from "tailwindcss";

// Classic Library theme color utilities

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'dancing': ['Dancing Script', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Classic Library colors
        library: {
          mahogany: "hsl(var(--library-mahogany))",
          "mahogany-light": "hsl(var(--library-mahogany-light))",
          "mahogany-dark": "hsl(var(--library-mahogany-dark))",
          leather: "hsl(var(--library-leather))",
          "leather-light": "hsl(var(--library-leather-light))",
          gold: "hsl(var(--library-gold))",
          "gold-light": "hsl(var(--library-gold-light))",
          "gold-dark": "hsl(var(--library-gold-dark))",
          parchment: "hsl(var(--library-parchment))",
          cream: "hsl(var(--library-cream))",
          forest: "hsl(var(--library-forest))",
          "forest-light": "hsl(var(--library-forest-light))",
          ink: "hsl(var(--library-ink))",
        },
        // Holi Festival colors
        holi: {
          pink: "hsl(var(--holi-pink))",
          yellow: "hsl(var(--holi-yellow))",
          purple: "hsl(var(--holi-purple))",
          green: "hsl(var(--holi-green))",
          orange: "hsl(var(--holi-orange))",
          blue: "hsl(var(--holi-blue))",
          red: "hsl(var(--holi-red))",
          magenta: "hsl(var(--holi-magenta))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "book-float": {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        "gentle-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "warm-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(38 60% 45% / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(38 60% 45% / 0.5), 0 0 60px hsl(15 65% 35% / 0.3)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "book-float": "book-float 6s ease-in-out infinite",
        "gentle-float": "gentle-float 4s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "warm-glow": "warm-glow 3s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "text-shimmer": "text-shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
