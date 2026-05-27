import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LocationState {
  state: string;
  stateCode: string;
  city: string;
  latitude: string | null;
  longitude: string | null;
}

interface LocationStore {
  location: LocationState | null;
  setLocation: (location: LocationState) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      location: null,
      setLocation: (location) => set({ location }),
      clearLocation: () => set({ location: null }),
    }),
    {
      name: "location-storage", // Unique storage key
    }
  )
);
