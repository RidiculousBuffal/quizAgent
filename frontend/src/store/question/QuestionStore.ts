import {createQuestionSlice, QuestionSlice} from "./questionSlice.ts";
import {create} from "zustand";
import {persist} from "zustand/middleware/persist";
import {immer} from "zustand/middleware/immer";

export type QuestionState = QuestionSlice

export const useQuestionStore = create<QuestionState>()(
    persist(
        immer(
            (...a) => ({
                ...createQuestionSlice(...a),
            })
        ),
        {
            name: "questionStore",
            partialize: (state) => ({
                questionAnswer: []
            })
        }
    )
)