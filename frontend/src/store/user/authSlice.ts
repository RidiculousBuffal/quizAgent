import {type UserState} from "./UserStore.ts";
import {MiddlewareTypes} from "../baseType.ts";
import type {StateCreator} from "zustand/vanilla";

export interface authSlice {
    isSignedIn: boolean
    setSigned: (sign: boolean) => void
}

export const createAuthSlice: StateCreator<
    UserState,
    MiddlewareTypes,
    [],
    authSlice> = (set, get) => (
    {
        isSignedIn: false,
        setSigned: (sign: boolean) => {
            set({
                isSignedIn: sign
            })
        }
    }
)

