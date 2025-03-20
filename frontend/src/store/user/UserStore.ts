import {createUserSlice, UserSlice} from "./userSlice.ts";
import {authSlice, createAuthSlice} from "./authSlice.ts";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";


export type UserState = UserSlice & authSlice

export const useUserStore = create<UserState>()(
    persist(
        immer(
            (...a) => ({
                ...createUserSlice(...a),
                ...createAuthSlice(...a)
            })
        ),
        {
            name: 'userStore',
            partialize: (state) => ({
                user: state.user,
                isSignedIn: state.isSignedIn,
                saToken: state.saToken
            })
        }
    )
)

export function logout() {
    const store = useUserStore.getState()
    store.setSigned(false)
    store.setUserData(null)
    store.clearToken()
}