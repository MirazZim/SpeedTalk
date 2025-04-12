import { create } from "zustand";

export const useUiStore = create((set) => ({
    isSidebarOpen: false,
    setSidebarOpen: (value) => set({ isSidebarOpen: value }),
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  }));