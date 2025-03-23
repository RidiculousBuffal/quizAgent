import {createQuestionSlice, QuestionSlice} from "./questionSlice.ts";
import {create} from "zustand";
import {persist} from "zustand/middleware";
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
                questionAnswer: state.questionAnswer
            })
        }
    )
)