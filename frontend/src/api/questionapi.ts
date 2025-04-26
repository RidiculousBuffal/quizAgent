import {questionTypeAPI} from "./types/questionType.ts";
import {fetchAPI} from "./base.ts";

export function fetchQuestionTypes(): Promise<questionTypeAPI[] | null> {
    return fetchAPI('/api/questiontype/getAllQuestionTypes');
}