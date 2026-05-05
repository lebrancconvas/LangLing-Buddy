import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  currentLanguage: string;
  userLevel: "beginner" | "intermediate" | "advanced";
  preferredProvider: string;
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  setLanguage: (lang: string) => void;
  setLevel: (level: "beginner" | "intermediate" | "advanced") => void;
  setProvider: (provider: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentLanguage: "en",
      userLevel: "beginner",
      preferredProvider: "auto",
      theme: "system",
      sidebarOpen: true,
      setLanguage: (lang) => set({ currentLanguage: lang }),
      setLevel: (level) => set({ userLevel: level }),
      setProvider: (provider) => set({ preferredProvider: provider }),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    }),
    { name: "langling-app" }
  )
);
