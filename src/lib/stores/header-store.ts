import { create } from "zustand";

type HeaderStore = {
	isOpen: boolean;
	openMenu: () => void;
	closeMenu: () => void;
	toggleMenu: () => void;
	// The header's search box is one shared input driving whichever
	// section is currently active (e.g. email search on Users, user-ID
	// filter on Activity Logs) rather than every page growing its own
	// duplicate search field. Pages that don't use search just ignore it.
	searchQuery: string;
	setSearchQuery: (query: string) => void;
};

export const useHeaderStore = create<HeaderStore>((set) => ({
	isOpen: false,
	openMenu: () => set({ isOpen: true }),
	closeMenu: () => set({ isOpen: false }),
	toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
	searchQuery: "",
	setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
