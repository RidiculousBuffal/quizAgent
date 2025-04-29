import {fetchAPI} from "./base";

export interface SubmitAnswerData {
    quizId: number;
    answers: {
        questionId: number;
        answer: any;
    }[];
}

export function submitQuizAnswers(data: SubmitAnswerData): Promise<any> {
    return fetchAPI('/public/quiz/submit', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}