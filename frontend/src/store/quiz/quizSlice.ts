import { StateCreator } from "zustand/vanilla"
import { MiddlewareTypes } from "../baseType.ts";
import { QuizState } from "./QuizStore.ts";

export type QuizSlice = {
    curEditQuizId: number | null,
    setCurEditQuizId: (quizId: number | null) => void
}


export const createQuizSlice: StateCreator<
    QuizState,
    MiddlewareTypes,
    [],
    QuizSlice> = (set) => (
        {
            curEditQuizId: null,
            setCurEditQuizId: (quizId: number | null) => {
                set({ curEditQuizId: quizId })
            }
        }
    )