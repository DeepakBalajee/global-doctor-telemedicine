import { create } from 'zustand'

interface AppState {
  // Mobile drawer state
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void

  // Search parameters draft state
  searchQuery: string
  searchLocation: string
  selectedSpecialty: string
  setSearchQuery: (query: string) => void
  setSearchLocation: (location: string) => void
  setSelectedSpecialty: (specialty: string) => void
  resetSearch: () => void
}

export const useAppStore = create<AppState>((set) => ({
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  searchQuery: '',
  searchLocation: '',
  selectedSpecialty: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchLocation: (location) => set({ searchLocation: location }),
  setSelectedSpecialty: (specialty) => set({ selectedSpecialty: specialty }),
  resetSearch: () => set({ searchQuery: '', searchLocation: '', selectedSpecialty: '' }),
}))
