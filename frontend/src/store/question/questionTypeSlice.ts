import {QuestionType} from '../../lib/Questions/QuestionType.ts'
import {questionTypeAPI} from "../../api/types/questionType.ts";
import {StateCreator} from "zustand/vanilla";
import {MiddlewareTypes} from "../baseType.ts";
import {QuestionState} from "./QuestionStore.ts";

export interface QuestionTypeSlice {
    questionTypes: QuestionType[],
    setQuestionTypes: (questionTypes: questionTypeAPI[]) => void;
}

export const createQuestionTypeSlice: StateCreator<QuestionState, MiddlewareTypes, [], QuestionTypeSlice> = (set, get) => ({
    questionTypes: [],
    setQuestionTypes: (questionTypesAPI: questionTypeAPI[]) => {
        set(
            {
                questionTypes: questionTypesAPI.map((x) => {
                    return {
                        typeId: x.typeId,
                        typeName: x.typeName,
                        typeDescription: x.typeDescription
                    }
                })
            }
        )
    }
})