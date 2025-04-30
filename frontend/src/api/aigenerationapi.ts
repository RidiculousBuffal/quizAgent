import {fetchAPI} from './base.ts'
import {BASE_URL} from './base.ts';
import {useUserStore} from "../store/user/UserStore.ts";
import message from '../components/globalMessage/index.ts';

// 定义AI生成历史记录类型
interface AIGenerationHistory {
    historyId: number;
    userId: string;
    quizId: number;
    inputPrompt: string;
    generatedResult: string;
    generationTime: string;
    status: boolean;
    errorMsg: string | null;
}

// 获取AI生成历史
export const getAIGenerationHistory = async (quizId: number): Promise<AIGenerationHistory[] | null> => {
    return fetchAPI<AIGenerationHistory[]>(`/api/question/history?quizId=${quizId}`,{});
};

// 流式请求不能使用标准fetchAPI，需要特殊处理
export const generateQuestions = async (
    quizId: number,
    question: string,
    modelName: string
): Promise<ReadableStream<Uint8Array> | null> => {
    try {
        const response = await fetch(`${BASE_URL}/api/question/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'satoken': useUserStore.getState().saToken || '',
            },
            body: JSON.stringify({
                quizId,
                question,
                modelName,
            }),
        });

        if (!response.ok) {
            message.error('网络错误');
            return null;
        }

        return response.body;
    } catch (error) {
        console.error('Error streaming AI response:', error);
        message.error('生成回答时出现错误');
        return null;
    }
};