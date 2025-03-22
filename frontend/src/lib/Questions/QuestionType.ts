import {SingleChoiceQuestionParams} from "./radio/radio.ts";
import {MultiChoiceParams} from "./checkbox/checkbox.ts";

type ValueOf<T> = T[keyof T];
export type QuestionType = {
    typeId: number;
    typeName: ValueOf<typeof ALLQuestionTypes>;
    typeDescription: string;
}
export type ParamsMap = {
    [ALLQuestionTypes.RADIO]: SingleChoiceQuestionParams,
    [ALLQuestionTypes.CHECKBOX]: MultiChoiceParams
}
export const ALLQuestionTypes = {
    "RADIO": "radio",
    "CHECKBOX": "checkbox"
} as const
