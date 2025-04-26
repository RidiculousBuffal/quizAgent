import {fetchAPI} from "./base.ts";
import {QuizDto} from "./types/questionType.ts";


export async function createOrEditQuiz(quizName: string, description: string, quizStartTime: string | null, quizEndTime: string | null, quizId?: number
): Promise<QuizDto | null> {
    return await fetchAPI('/api/quiz/save', {
        method: 'POST',
        body: JSON.stringify({
            quizId: quizId ?? null,
            quizName: quizName,
            quizDescription: description,
            quizStartTime: quizStartTime,
            quizEndTime: quizEndTime,
            status: 0,
            creator: null,
        }),
    });
}

export async function getQuizList() {
    return await fetchAPI('/api/quiz/my', {
        method: 'GET',
    });
}

export async function deleteQuizById(quizId: number) {
    return await fetchAPI(`/api/quiz/${quizId}`, {
        method: 'DELETE',
    });
}