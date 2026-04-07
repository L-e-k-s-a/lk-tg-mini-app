import { create } from "zustand";


type PlatformState = {
  platform: string,
  setPlatform: (plaform: string) => void
}

export const platformSlice = create<PlatformState>((set, get) => ({
  platform: "",

  setPlatform: (platform) => set({platform})
}))
