import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Fireworks } from "@/components/Fireworks";

interface FireworksContextType {
  triggerFireworks: (intensity?: "low" | "medium" | "high") => void;
}

const FireworksContext = createContext<FireworksContextType | undefined>(undefined);

export const FireworksProvider = ({ children }: { children: ReactNode }) => {
  const [trigger, setTrigger] = useState(0);
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");

  const triggerFireworks = useCallback((newIntensity: "low" | "medium" | "high" = "medium") => {
    setIntensity(newIntensity);
    setTrigger((prev) => prev + 1);
  }, []);

  return (
    <FireworksContext.Provider value={{ triggerFireworks }}>
      {children}
      <Fireworks trigger={trigger} intensity={intensity} />
    </FireworksContext.Provider>
  );
};

export const useFireworks = () => {
  const context = useContext(FireworksContext);
  if (context === undefined) {
    throw new Error("useFireworks must be used within a FireworksProvider");
  }
  return context;
};