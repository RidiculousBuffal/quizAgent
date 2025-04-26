import {createQuestionSlice, QuestionSlice} from "./questionSlice.ts";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {immer} from "zustand/middleware/immer";
import {createQuestionTypeSlice, QuestionTypeSlice} from "./questionTypeSlice.ts";

export type QuestionState = QuestionSlice & QuestionTypeSlice

export const useQuestionStore = create<QuestionState>()(
    persist(
        immer(
            (...a) => ({
                ...createQuestionSlice(...a),
                ...createQuestionTypeSlice(...a),
            })
        ),
        {
            name: "questionStore",
            partialize: (state) => ({
                questionAnswer: state.questionAnswer,
                questionTypes: state.questionTypes
            })
        }
    )
)