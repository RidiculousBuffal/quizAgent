import {type UserState} from "./UserStore.ts";
import {MiddlewareTypes} from "../baseType.ts";
import type {StateCreator} from "zustand/vanilla";

export interface authSlice {
    isSignedIn: boolean
    saToken: string | undefined
    login: (token: string) => void
    setSigned: (sign: boolean) => void
    clearToken:()=>void;
}

export const createAuthSlice: StateCreator<
    UserState,
    MiddlewareTypes,
    [],
    authSlice> = (set, get) => (
    {
        saToken: undefined,
        login: (token: string) => {
            set({
                ...get(),
                saToken: token,
                isSignedIn:true
            })
        },
        isSignedIn: false,
        setSigned: (sign: boolean) => {
            set({
                ...get(),
                isSignedIn: sign
            })
        },
        clearToken:()=>{
            set(
                {
                    ...get(),
                    saToken:undefined
                }
            )
        }
    }
)

