"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PreloaderContextValue {
  isPreloaderFinished: boolean;
  setPreloaderFinished: (finished: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextValue>({
  isPreloaderFinished: false,
  setPreloaderFinished: () => {},
});

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [isPreloaderFinished, setPreloaderFinished] = useState(true);

  return (
    <PreloaderContext.Provider value={{ isPreloaderFinished, setPreloaderFinished }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  return useContext(PreloaderContext);
}

