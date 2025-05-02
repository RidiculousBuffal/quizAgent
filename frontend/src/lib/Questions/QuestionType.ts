import {SingleChoiceQuestionParams} from "./radio/radio.ts";
import {MultiChoiceParams} from "./checkbox/checkbox.ts";
import {FillBlankParams} from "./input/input.ts";
import {EssayQuestionParams} from "./essay/essay.ts";
import {EditOutlined, CheckCircleOutlined, CheckSquareOutlined} from "@ant-design/icons";

type ValueOf<T> = T[keyof T];
export type QuestionType = {
    typeId: number;
    typeName: ValueOf<typeof ALLQuestionTypes>;
    typeDescription: string;
}
export type ParamsMap = {
    [ALLQuestionTypes.RADIO]: SingleChoiceQuestionParams,
    [ALLQuestionTypes.CHECKBOX]: MultiChoiceParams,
    [ALLQuestionTypes.FILLBLANK]: FillBlankParams,
    [ALLQuestionTypes.ESSAY]: EssayQuestionParams
}
export const ALLQuestionTypes = {
    "RADIO": "radio",
    "CHECKBOX": "checkbox",
    "FILLBLANK": "fillblank",
    "ESSAY": "essay"
} as const

export const questionTypes = [
    {
        key: 'input',
        icon: EditOutlined,
        title: '填空题',
        type: {
            typeId: 3,
            typeName: ALLQuestionTypes.FILLBLANK,
            typeDescription: '填空题',
        }
    },
    {
        key: 'multiChoice',
        icon: CheckSquareOutlined,
        title: '多选题',
        type: {
            typeId: 2,
            typeName: ALLQuestionTypes.CHECKBOX,
            typeDescription: '多选题',
        }
    },
    {
        key: 'singleChoice',
        icon: CheckCircleOutlined,
        title: '单选题',
        type: {
            typeId: 1,
            typeName: ALLQuestionTypes.RADIO,
            typeDescription: '单选题',
        }
    },
];