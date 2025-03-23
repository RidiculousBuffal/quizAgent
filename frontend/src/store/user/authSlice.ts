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
    authSlice> = (set) => ({
    saToken: undefined,
    isSignedIn: false,

    login: (token: string) => {
        set({
            saToken: token,
            isSignedIn: true  // 只需设置当前 slice 需要修改的字段
        })
    },

    setSigned: (sign: boolean) => {
        set({
            isSignedIn: sign
        })
    },

    clearToken: () => {
        set({
            saToken: undefined,
            isSignedIn: false  // 根据业务需求决定是否同时修改
        })
    }
})