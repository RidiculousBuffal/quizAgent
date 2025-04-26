import { useUserStore } from "../store/user/UserStore.ts";
import { fetchAPI } from "./base.ts";

export interface QuizDto {
    quizId: number;
    quizName: string;
    quizDescription: string;
    quizStartTime: string; // 后端返回是字符串
    quizEndTime: string;
    status: number;
    creator: string | null;
}

export async function createOrEditQuiz(quizName: string, description: string, quizStartTime: string | null, quizEndTime: string | null, quizId?: number
): Promise<QuizDto | null> {
    const satoken = useUserStore.getState().saToken ?? '';
    const response: QuizDto | null = await fetchAPI('/api/quiz/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'satoken': `${satoken}`
        },
        body: JSON.stringify({
            quizId: quizId ?? null,
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

export async function getQuizList() {
    const satoken = useUserStore.getState().saToken ?? '';
    const response = await fetchAPI('/api/quiz/my', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'satoken': `${satoken}`
        },
    })
    return response;
}

export async function deleteQuizById(quizId: number) {
    const satoken = useUserStore.getState().saToken ?? '';
    const response = await fetchAPI(`/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'satoken': `${satoken}`
        }
    });
    return response;
}