import {fetchAPI} from "./base.ts";
import {QuizResponseType, QuizType} from "../pages/dashboardPages/ReceivedQuizzes.tsx";
import {SpecificAnswerDTO} from "./types/questionType.ts";
import {QuestionStatData} from "../pages/dashboardPages/QuizStatistics/QuizStatistics.tsx";
import {QuizInfoType} from "../components/modal/QuizInfoEdit.tsx";

export async function getTotalResponseByQuizId(quizId: number): Promise<number | null> {
    return await fetchAPI<number>(`/quizQuestionAnswer/getSpecifiedResponseNum/${quizId}`, {})
}


export async function getTotalResponse(): Promise<number | null> {
    return await fetchAPI<number>(`/quizQuestionAnswer/getTotalResponse`, {});
}

export async function getAnswerList(quizId: number): Promise<QuizResponseType[] | null> {
    return await fetchAPI<QuizResponseType[]>(`/quizQuestionAnswer/getAnswerListByQuizId/${quizId}`, {});
}

export async function getSpecificAnswer(uniqueSubmitId: string): Promise<SpecificAnswerDTO | null> {
    return await fetchAPI<SpecificAnswerDTO>(`/quizQuestionAnswer/getAnswerByUniqueSubmitId/${uniqueSubmitId}`, {});
}

export async function getAnalysisDataInQuiz(quizId: number): Promise<QuestionStatData[] | null> {
    return await fetchAPI(`/quizQuestionAnswer/getAnalysisDataInQuiz/${quizId}`, {});
}

export async function getQuizzesHasResp(): Promise<QuizType[] | null> {
    return await fetchAPI('/quizQuestionAnswer/getQuizzesHasResp', {})
}