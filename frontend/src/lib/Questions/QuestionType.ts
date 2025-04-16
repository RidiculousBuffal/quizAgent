import { SingleChoiceQuestionParams } from "./radio/radio.ts";
import { MultiChoiceParams } from "./checkbox/checkbox.ts";
import { FillBlankParams } from "./input/input.ts";

type ValueOf<T> = T[keyof T];
export type QuestionType = {
    typeId: number;
    typeName: ValueOf<typeof ALLQuestionTypes>;
    typeDescription: string;
}
export type ParamsMap = {
    [ALLQuestionTypes.RADIO]: SingleChoiceQuestionParams,
    [ALLQuestionTypes.CHECKBOX]: MultiChoiceParams,
    [ALLQuestionTypes.INPUT]: FillBlankParams,
}
export const ALLQuestionTypes = {
    "RADIO": "radio",
    "CHECKBOX": "checkbox",
    "INPUT": "input"
} as const
