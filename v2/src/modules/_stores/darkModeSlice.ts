import { create } from "zustand";

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

const initialDarkMode = true;

export const useDarkModeStore = create<DarkModeState>((set) => {
  if (typeof document !== "undefined") {
    applyDarkModeClasses(initialDarkMode);
  }
  return {
    isEnabled: initialDarkMode,
    setDarkMode: (value) =>
      set((state) => {
        const isEnabled = value !== null ? value : !state.isEnabled;
        applyDarkModeClasses(isEnabled);
        return { isEnabled };
      }),
  };
});
