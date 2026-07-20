import { create } from "zustand";

type HeaderStore = {
	isOpen: boolean;
	openMenu: () => void;
	closeMenu: () => void;
	toggleMenu: () => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
	isOpen: false,
	openMenu: () => set({ isOpen: true }),
	closeMenu: () => set({ isOpen: false }),
	toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}));
