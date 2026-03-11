import { create } from "zustand";
import type { UserPayloadObject } from "../_interfaces";

interface MainState {
  userName: string;
  userEmail: string | null;
  isFieldFocusRegistered: boolean;
  setUser: (payload: UserPayloadObject) => void;
}

export const useMainStore = create<MainState>((set) => ({
  userName: "John Doe",
  userEmail: "doe.doe.doe@example.com",
  isFieldFocusRegistered: false,
  setUser: (payload) =>
    set({
      userName: payload.name,
      userEmail: payload.email,
    }),
}));
