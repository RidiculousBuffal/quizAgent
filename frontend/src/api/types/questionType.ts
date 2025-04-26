import {ALLQuestionTypes} from "../../lib/Questions/QuestionType.ts";

type ValueOf<T> = T[keyof T];
export type questionTypeAPI = {
    typeId: number,
    typeName: ValueOf<typeof ALLQuestionTypes>,
    typeDescription: string,
    typeSchema?: string
}