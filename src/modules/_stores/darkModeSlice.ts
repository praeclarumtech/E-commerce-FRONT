import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DarkModeState {
  isEnabled: boolean;
  setDarkMode: (value: boolean | null) => void;
}

function applyDarkModeClasses(isEnabled: boolean) {
  if (typeof document === "undefined") return;
  document.body.classList[isEnabled ? "add" : "remove"]("dark-scrollbars");
  document.documentElement.classList[isEnabled ? "add" : "remove"](
    "dark",
    "dark-scrollbars-compat",
  );
}

const STORAGE_KEY = "dark-mode";
const initialDarkMode = true;

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set) => ({
      isEnabled: initialDarkMode,
      setDarkMode: (value: boolean | null) => {
        set((state) => {
          const isEnabled = value !== null ? value : !state.isEnabled;
          applyDarkModeClasses(isEnabled);
          return { isEnabled };
        });
      },
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (state) applyDarkModeClasses(state.isEnabled);
      },
    },
  ),
);
