import { BaseQuestion } from "../../lib/Questions/BaseQuestion";
import { StateCreator } from "zustand/vanilla";
import { QuestionFactory } from "../../lib/Questions/QuestionFactory";
import { MiddlewareTypes } from "../baseType.ts";
import { arrayMove } from '@dnd-kit/sortable';
import {QuestionState} from "./QuestionStore.ts";

export type QuestionAnswer = {
    question: BaseQuestion,
    answer: any
}

export interface QuestionSlice {
    questionAnswer: QuestionAnswer[];
    setRawQuestions: (questions: (BaseQuestion | object)[]) => void;
    setQuestionAnswer: (questions: (BaseQuestion | object)[], answers: any[]) => void;
    setAnswer: (id: number, newAnswer: any) => void;
    findQuestion: (id: number) => BaseQuestion | undefined;
    sortQuestions: (activeId: number, overId: number) => void;
    deleteQuestion: (id: number) => void;
    addQuestion: (question: BaseQuestion | object) => void;
    updateQuestion: (id: number, updatedQuestion: BaseQuestion | object) => void;
    findAnswer: (id: number) => any;
}

// 工具函数: 统一转为 BaseQuestion 实例
export function toQuestionInstance(q: BaseQuestion | object): BaseQuestion {
    return q instanceof BaseQuestion ? q : QuestionFactory.fromJSON(q);
}

export const createQuestionSlice: StateCreator<
    QuestionState,
    MiddlewareTypes,
    [],
    QuestionSlice
> = (set, get) => ({
    questionAnswer: [],

    setRawQuestions: (questions) => {
        set({
            questionAnswer: questions.map((q) => ({
                question: toQuestionInstance(q),
                answer: null,
            }))
        });
    },

    setQuestionAnswer: (questions, answers) => {
        set({
            questionAnswer: questions.map((q, i) => ({
                question: toQuestionInstance(q),
                answer: answers[i],
            })),
        });
    },

    setAnswer: (id, newAnswer) => {
        set({
            questionAnswer: get().questionAnswer.map((qa) =>
                qa.question.id === id ? { ...qa, answer: newAnswer } : qa
            ),
        });
    },

    findQuestion: (id) => {
        const qa = get().questionAnswer.find((qa) => qa.question.id === id);
        return qa ? toQuestionInstance(qa.question) : undefined;
    },

    sortQuestions: (activeId, overId) => {
        const questionAnswer = [...get().questionAnswer];
        const oldIndex = questionAnswer.findIndex((qa) => qa.question.id === activeId);
        const newIndex = questionAnswer.findIndex((qa) => qa.question.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
            set({ questionAnswer: arrayMove(questionAnswer, oldIndex, newIndex) });
        }
    },

    deleteQuestion: (id) => {
        set({
            questionAnswer: get().questionAnswer.filter((qa) => qa.question.id !== id),
        });
    },

    addQuestion: (question) => {
        set({
            questionAnswer: [
                ...get().questionAnswer,
                { question: toQuestionInstance(question), answer: null }
            ]
        });
    },

    updateQuestion: (id, updatedQuestion) => {
        set({
            questionAnswer: get().questionAnswer.map((qa) =>
                qa.question.id === id
                    ? { ...qa, question: toQuestionInstance(updatedQuestion) }
                    : qa
            ),
        });
    },

    findAnswer: (id) => {
        return get().questionAnswer.find((qa) => qa.question.id === id)?.answer;
    },
});