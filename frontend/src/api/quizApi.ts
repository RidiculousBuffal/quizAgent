import {fetchAPI} from "./base.ts";
import {quizDisplayType, QuizDto} from "./types/questionType.ts";
import {QuizInfoType} from "../components/modal/QuizInfoEdit.tsx";
import {messageItem} from "../pages/dashboardPages/AI/BubbleList.tsx";


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

export async function updateQuizStatus(quizId: number, status: number) {
    // 先查出原有问卷内容
    const orig = await getQuizDetail(quizId) as QuizDto;
    if (Date.parse(orig.quizStartTime) > Date.now()) {
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        orig.quizStartTime = formattedDate
    }
    // 合并status后再提交
    return await fetchAPI<QuizDto>(`/api/quiz/save`, {
        method: 'POST',
        body: JSON.stringify({
            ...orig,
            status,
        }),
    });
}

export async function getQuizDetail(quizId: number): Promise<QuizDto | null> {
    return await fetchAPI<QuizDto>(`/api/quiz/${quizId}`, {});
}

export async function getQuizDisplay(value?: string): Promise<quizDisplayType[] | null> {
    return await fetchAPI<quizDisplayType[]>(`/public/quiz/getAllQuizList`, {
        method: 'POST',
        body: value
    });
}

export async function getAIAnalysisHistory(quizId: number): Promise<messageItem[] | null> {
    return await fetchAPI(`/analysis/getAIAnalysis/${quizId}`, {})
}