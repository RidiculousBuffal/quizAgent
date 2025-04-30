import {fetchAPI} from "./base.ts";
import {QuizResponseType} from "../pages/dashboardPages/ReceivedQuizzes.tsx";
import {SpecificAnswerDTO} from "./types/questionType.ts";

export async function getTotalResponseByQuizId(quizId: string): Promise<number | null> {
    return await fetchAPI<number>(`/quizQuestionAnswer/getSpecifiedResponseNum/${quizId}`,{})
}


export async function getTotalResponse(): Promise<number | null> {
    return await fetchAPI<number>(`/quizQuestionAnswer/getTotalResponse`,{});
}

export async function getAnswerList(quizId: string): Promise<QuizResponseType[] | null> {
    return await fetchAPI<QuizResponseType[]>(`/quizQuestionAnswer/getAnswerListByQuizId/${quizId}`,{});
}

export async function getSpecificAnswer(quizId: string): Promise<SpecificAnswerDTO[] | null> {
    return await fetchAPI<SpecificAnswerDTO[]>(`/quizQuestionAnswer/getAnswerListByQuizId/${quizId}`,{});
}