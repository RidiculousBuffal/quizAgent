import { BaseQuestion } from "./BaseQuestion.ts";
import { SingleChoiceQuestion } from "./radio/radio.ts";
import { QuestionType } from "./QuestionType.ts";
import { MultipleChoiceQuestion } from "./checkbox/checkbox.ts";
import { FillBlankQuestion } from "./input/input.ts";

export class QuestionFactory {
    private static _questionTypes: Map<number, typeof BaseQuestion> = new Map();

    static get questionTypes(): Map<number, typeof BaseQuestion> {
        return this._questionTypes;
    }

    // 注册问题类型
    static registerQuestionType(typeId: number, questionClass: typeof BaseQuestion): void {
        QuestionFactory._questionTypes.set(typeId, questionClass);
    }

    // 创建问题实例
    static createQuestion<T>(type: QuestionType, params: Omit<T, 'type'>): BaseQuestion {
        const QuestionClass = QuestionFactory._questionTypes.get(type.typeId);

        if (!QuestionClass) {
            throw new Error(`未知的问题类型: ${type.typeName}`);
        }

        return new (QuestionClass as any)({
            ...params,
            type
        });
    }

    // 从JSON创建问题
    static fromJSON(json: any): BaseQuestion {
        const QuestionClass = QuestionFactory._questionTypes.get(json.type.typeId);

        if (!QuestionClass) {
            throw new Error(`未知的问题类型: ${json.type.typeName}`);
        }

        return (QuestionClass as any).fromJSON(json);
    }
}

// 注册问题类型

QuestionFactory.registerQuestionType(1, SingleChoiceQuestion);
QuestionFactory.registerQuestionType(2, MultipleChoiceQuestion); // 多选题
QuestionFactory.registerQuestionType(3, FillBlankQuestion); // 填空题
// 注册其他问题类型...