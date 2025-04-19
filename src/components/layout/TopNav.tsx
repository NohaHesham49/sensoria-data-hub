
import { useState, useEffect } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNav() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference on component mount
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  const updateTheme = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    updateTheme(!isDarkMode);
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="text-xl font-bold">
          <h1>Sensoria Data Hub</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
          </Button>
          
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              US
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}
