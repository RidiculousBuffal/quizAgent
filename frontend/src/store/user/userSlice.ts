import {create} from 'zustand'

import {type UserState} from './UserStore.ts';
import type {StateCreator} from 'zustand/vanilla';
import {MiddlewareTypes} from "../baseType.ts";

export type user = {
    userId: string | undefined,
    userName: string,
    userEmail: string | undefined,
    userAvatar: string | undefined
}

export interface UserSlice {
    user: user | null,
    setUserData: (userData: user | null) => void
}

export const createUserSlice: StateCreator<
    UserState,
    MiddlewareTypes,
    [],
    UserSlice> = (set, get) => (
    {
        user: null,
        setUserData: (userData: user | null) => {
            set({user: userData})
        }
    }
)
