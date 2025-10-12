import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  isMinimized: boolean;
  isOpen: boolean; // For mobile sheet state
  toggleMinimized: () => void;
  setMinimized: (minimized: boolean) => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isMinimized: false,
      isOpen: false,
      toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
      setMinimized: (minimized: boolean) => set({ isMinimized: minimized }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open: boolean) => set({ isOpen: open }),
    }),
    {
      name: 'sidebar-state', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the minimized state, not the mobile sheet state
      partialize: (state) => ({ isMinimized: state.isMinimized }),
    }
  )
);