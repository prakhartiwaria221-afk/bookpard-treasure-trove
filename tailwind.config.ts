import type { Config } from "tailwindcss";

// Makar Sankranti celebration color utilities for direct use

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
        // Makar Sankranti celebration colors
        sankranti: {
          saffron: "hsl(var(--sankranti-saffron))",
          "saffron-light": "hsl(var(--sankranti-saffron-light))",
          "saffron-dark": "hsl(var(--sankranti-saffron-dark))",
          sky: "hsl(var(--sankranti-sky))",
          "sky-light": "hsl(var(--sankranti-sky-light))",
          "sky-dark": "hsl(var(--sankranti-sky-dark))",
          yellow: "hsl(var(--sankranti-yellow))",
          "yellow-light": "hsl(var(--sankranti-yellow-light))",
          cream: "hsl(var(--sankranti-cream))",
        },
        sun: {
          glow: "hsl(var(--sun-glow))",
        },
        kite: {
          red: "hsl(var(--kite-red))",
          green: "hsl(var(--kite-green))",
          purple: "hsl(var(--kite-purple))",
          blue: "hsl(var(--kite-blue))",
          pink: "hsl(var(--kite-pink))",
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
        "kite-fly": {
          "0%": { transform: "translateY(100vh) translateX(-20px) rotate(-15deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "50%": { transform: "translateY(20vh) translateX(30px) rotate(10deg)" },
          "100%": { transform: "translateY(-20vh) translateX(-10px) rotate(-5deg)", opacity: "0" },
        },
        "kite-sway": {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "25%": { transform: "translateX(20px) rotate(8deg)" },
          "50%": { transform: "translateX(-15px) rotate(-5deg)" },
          "75%": { transform: "translateX(10px) rotate(3deg)" },
        },
        "sun-pulse": {
          "0%, 100%": { opacity: "0.8", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.1)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(25 90% 50% / 0.6)" },
          "50%": { boxShadow: "0 0 40px hsl(25 90% 50% / 0.9), 0 0 60px hsl(45 95% 50% / 0.5)" },
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
        "kite-fly": "kite-fly 15s ease-in-out infinite",
        "kite-sway": "kite-sway 4s ease-in-out infinite",
        "sun-pulse": "sun-pulse 3s ease-in-out infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "text-shimmer": "text-shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;