import {questionTypeAPI} from "./types/questionType.ts";
import {fetchAPI} from "./base.ts";
import {useQuestionStore} from "../store/question/QuestionStore.ts";
import {useQuizStore} from "../store/quiz/QuizStore.ts";
import {BaseQuestion} from "../lib/Questions/BaseQuestion.ts";

export function fetchQuestionTypes(): Promise<questionTypeAPI[] | null> {
    return fetchAPI('/api/questiontype/getAllQuestionTypes');
}

export function saveAllQuestions(): Promise<null> {
    const currentQuiz = useQuizStore.getState().curEditQuizId;
    const AllQuestions = useQuestionStore.getState().questionAnswer.map(x => x.question)
    return fetchAPI(`/api/question/save/${currentQuiz}`, {
        method: "POST",
        body: JSON.stringify(AllQuestions)
    })
}

export function deleteQuestionBackend(questionId: number): Promise<null> {
    return fetchAPI(`/api/question/${questionId}`, {
        method: "DELETE"
    })
}

export function getAllQuestionsInQuiz(quizId: number): Promise<BaseQuestion[] | null> {
    return fetchAPI(`/api/question/listQuestions/${quizId}`,{})
}