import { fetchAPI } from "./base.ts";

export function createQuiz(quizName: string, description: string, quizStartTime: string, quizEndTime: string) {

    const response = fetchAPI('/api/quiz/save', {
        method: 'POST',
        body: JSON.stringify({
            quizId: null,
            quizName: quizName,
            quizDescription: description,
            quizStartTime: quizStartTime,
            quizEndTime: quizEndTime,
            status: 0,
            creator: null,
        }),
    })
    return response;
}