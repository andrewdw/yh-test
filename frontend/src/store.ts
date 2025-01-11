import { Cuisine } from '@/types/api.types';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// filter store
export interface FilterStoreProps {
  filter?: Cuisine;
  setFilter: (filter: Cuisine) => void;
  clearFilter: () => void;
}
export const useFilterStore = create(
  immer<FilterStoreProps>(set => ({
    filter: undefined,
    setFilter: (filter: Cuisine) => {
      set({ filter });
    },
    clearFilter: () => {
      set({ filter: undefined });
    },
  }))
);


// guest count store
export interface GuestCountStoreProps {
  guestCount: number;
  setGuestCount: (guestCount: number) => void;
}
export const useGuestCountStore = create(immer<GuestCountStoreProps>(set => ({
  guestCount: 10,
  setGuestCount: (guestCount: number) => {
    set({ guestCount });
  },
})));