import { StateCreator } from "zustand/vanilla";
import { MiddlewareTypes } from "../baseType.ts";
import {ChatState} from "./ChatStore.ts";     // ✅ 与其它 Slice 保持一致

/* ================================================= */
/*                     类型定义                       */
/* ================================================= */

export type ChatRole = "ai" | "user" | "tool";

export interface ChatMessage {
    role: ChatRole;
    content: any;                 // string | object &rarr; ToolCall 也兼容
    key: string | number;         // 用时间戳或 uuid，保证唯一
}

export interface ChatSlice {
    /* --------- 状态 --------- */
    messages: ChatMessage[];

    /* --------- actions --------- */
    resetMessages: (msgs?: ChatMessage[]) => void;
    appendMessages: (msg: ChatMessage | ChatMessage[]) => void;
    patchMessage: (key: string | number, partial: Partial<ChatMessage>) => void;
    deleteMessage: (key: string | number) => void;
    findMessage: (key: string | number) => ChatMessage | undefined;
}



export const createChatSlice: StateCreator<
    ChatState,
    MiddlewareTypes,
    [],
    ChatSlice
> = (set, get) => ({
    /* ---------- 初始状态 ---------- */
    messages: [],

    /* ---------- 基础写接口 ---------- */
    resetMessages: (msgs = []) => {
        set({ messages: [...msgs] });
    },

    appendMessages: (msg) => {
        if (Array.isArray(msg)) {
            set({ messages: [...get().messages, ...msg] });
        } else {
            set({ messages: [...get().messages, msg] });
        }
    },

    patchMessage: (key, partial) => {
        set({
            messages: get().messages.map((m) =>
                m.key === key ? { ...m, ...partial } : m,
            ),
        });
    },

    deleteMessage: (key) => {
        set({
            messages: get().messages.filter((m) => m.key !== key),
        });
    },

    findMessage: (key) => get().messages.find((m) => m.key === key),
});