import {create} from "zustand";
import {persist} from "zustand/middleware";        // ✅ v4 推荐写法
import {immer} from "zustand/middleware/immer";
import {ChatSlice, createChatSlice} from "./ChatSlice";

export type ChatState = ChatSlice;


export const useChatStore = create<ChatState>()(
    persist(
        immer(
            (...a) => ({
                ...createChatSlice(...a)
            })
        ),
        {
            name: "chatStore",
            partialize: (state) => ({
                message: state.messages,
            })
        }
    )
)