import {ALLQuestionTypes} from "../../lib/Questions/QuestionType.ts";

type ValueOf<T> = T[keyof T];
export type questionTypeAPI = {
    typeId: number,
    typeName: ValueOf<typeof ALLQuestionTypes>,
    typeDescription: string,
    typeSchema?: string
}
export interface QuizDto {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string; // 后端返回是字符串
    quizEndTime: string;
    status: number;
    creator: string | null;
}

export interface quizDisplayType {
    quizId: string;
    quizName: string;
    quizDescription: string;
    quizStartTime: string;
    quizEndTime: string;
    userName: string;
    responses: number;
}

export interface SpecificAnswerDTO {
    questionName: string;
    questionDescription: string;
    details: string;
    questionDetails: string;
    answer: string;
}