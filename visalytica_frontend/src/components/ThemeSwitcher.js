"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { name: "light", icon: Sun },
    { name: "dark", icon: Moon },
    { name: "system", icon: Laptop },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-1 p-1.5 rounded-full bg-cinza_escuro dark:bg-noturno_claro">
        <div className="w-9 h-9 rounded-full bg-cinza dark:bg-noturno_medio animate-pulse"></div>
        <div className="w-9 h-9 rounded-full bg-cinza dark:bg-noturno_medio animate-pulse"></div>
        <div className="w-9 h-9 rounded-full bg-cinza dark:bg-noturno_medio animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 p-1.5 rounded-full bg-[#e8eaed] dark:bg-noturno_claro">
      {themes.map((t) => {
        const isActive = theme === t.name;
        return (
          <button
            key={t.name}
            className={`
              p-2 rounded-full transition-colors duration-200
              ${
                isActive
                  ? "bg-azul text-white"
                  : "text-cinza_escuro dark:text-cinza hover:bg-cinza dark:hover:bg-noturno_medio"
              }
            `}
            onClick={() => setTheme(t.name)}
            aria-label={`Mudar para tema ${t.name}`}
          >
            <t.icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
}
