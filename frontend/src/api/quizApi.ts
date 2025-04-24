import { useUserStore } from "../store/user/UserStore.ts";
import { fetchAPI } from "./base.ts";

export function createQuiz(quizName: string, description: string, quizStartTime: string, quizEndTime: string) {
    const satoken = useUserStore.getState().saToken ?? '';
    const response = fetchAPI('/api/quiz/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'satoken': `${satoken}`
        },
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