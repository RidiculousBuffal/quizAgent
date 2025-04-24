import { createQuizSlice, QuizSlice } from "./quizSlice.ts";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type QuizState = QuizSlice

export const useQuizStore = create<QuizState>()(
    persist(
        immer(
            (...a) => ({
                ...createQuizSlice(...a),
            })
        ),
        {
            name: "quizStore",
            partialize: (state) => ({
                curEditQuizId: state.curEditQuizId,
            })
        }
    )
)