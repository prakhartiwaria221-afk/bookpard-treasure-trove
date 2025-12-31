import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative hover:bg-primary/10 group"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {/* Sparkle decoration */}
      <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-newyear-gold opacity-60 group-hover:opacity-100 transition-opacity" />
      
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-primary transition-transform hover:rotate-12" />
      ) : (
        <Sun className="h-5 w-5 text-newyear-gold transition-transform hover:rotate-45" />
      )}
    </Button>
  );
};