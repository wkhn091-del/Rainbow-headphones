"use client";

import { create } from "zustand";

type UserSlice = {
  userId: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  setUser: (p: {
    userId: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
  }) => void;
  clear: () => void;
};

/** Client display only — no prices, tokens, or sensitive PII */
export const useUserStore = create<UserSlice>((set) => ({
  userId: null,
  displayName: null,
  avatarUrl: null,
  setUser: ({ userId, displayName = null, avatarUrl = null }) =>
    set({ userId, displayName, avatarUrl }),
  clear: () => set({ userId: null, displayName: null, avatarUrl: null }),
}));
