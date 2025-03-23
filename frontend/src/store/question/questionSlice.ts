import {BaseQuestion} from "../../lib/Questions/BaseQuestion.ts";
import {StateCreator} from "zustand/vanilla";
import {QuestionState} from "./QuestionStore.ts";
import {MiddlewareTypes} from "../baseType.ts";
import {arrayMove} from '@dnd-kit/sortable';

export type QuestionAnswer = {
    question: BaseQuestion,
    answer: any
}

export interface QuestionSlice {
    questionAnswer: QuestionAnswer[];
    setRawQuestions: (questions: BaseQuestion[]) => void;
    setQuestionAnswer: (questions: BaseQuestion[], answer: any[]) => void;
    setAnswer: (id: number, newAnswer: any) => void; // 新增的方法，用于设置单个问题的答案
    findQuestion: (id: number) => BaseQuestion | undefined;
    sortQuestions: (activeId: number, overId: number) => void;
    deleteQuestion: (id: number) => void;
    addQuestion: (question: BaseQuestion) => void;
    updateQuestion: (id: number, updatedQuestion: BaseQuestion) => void;
    findAnswer: (id: number) => any ;
}

export const createQuestionSlice: StateCreator<
    QuestionState,
    MiddlewareTypes,
    [],
    QuestionSlice
> = (set, get) => ({
    questionAnswer: [],

    setRawQuestions: (questions: BaseQuestion[]) => {
        // Initialize `questionAnswer` with the given questions and their default answers
        const initializedQuestionAnswer = questions.map((question) => ({
            question,
            answer: null, // Assuming a default `null` value for the answer
        }));
        set({questionAnswer: initializedQuestionAnswer});
    },

    setQuestionAnswer: (questions: BaseQuestion[], answers: any[]) => {
        // Update both questions and their corresponding answers
        const updatedQuestionAnswer = questions.map((question, index) => ({
            question,
            answer: answers[index],
        }));
        set({questionAnswer: updatedQuestionAnswer});
    },

    setAnswer: (id: number, newAnswer: any) => {
        // Update the answer for a specific question by its ID
        set({
            questionAnswer: get().questionAnswer.map(qa =>
                qa.question.id === id ? {...qa, answer: newAnswer} : qa
            )
        });
    },

    findQuestion: (id: number) => {
        // Find the question by its ID within the `questionAnswer`
        return get().questionAnswer.find(qa => qa.question.id === id)?.question;
    },

    sortQuestions: (activeId: number, overId: number) => {
        const questionAnswer = [...get().questionAnswer];
        const oldIndex = questionAnswer.findIndex(qa => qa.question.id === activeId);
        const newIndex = questionAnswer.findIndex(qa => qa.question.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            set({
                questionAnswer: arrayMove(questionAnswer, oldIndex, newIndex)
            });
        }
    },

    deleteQuestion: (id: number) => {
        set({
            questionAnswer: get().questionAnswer.filter(qa => qa.question.id !== id)
        });
    },

    addQuestion: (question: BaseQuestion) => {
        const newQA: QuestionAnswer = {question, answer: null}; // Default answer is `null`
        set({questionAnswer: [...get().questionAnswer, newQA]});
    },

    updateQuestion: (id: number, updatedQuestion: BaseQuestion) => {
        set({
            questionAnswer: get().questionAnswer.map(qa =>
                qa.question.id === id ? {...qa, question: updatedQuestion} : qa
            )
        });
    },
    findAnswer: (id: number) => {
        return get().questionAnswer.find(qa => qa.question.id === id)?.answer
    }
});