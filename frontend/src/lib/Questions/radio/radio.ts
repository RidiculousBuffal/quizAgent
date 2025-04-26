import {v4 as uuid} from 'uuid'
import {BaseQuestion, BaseQuestionParams} from "../BaseQuestion.ts";
import SingleRadioEdit from "./SingleRadioEdit.tsx";
import SingleRadioPreview from "./SingleRadioPreview.tsx";

export interface QuestionOption {
    id: string;
    text: string;
    value: string | number;

    [key: string]: any; // 允许扩展属性
}

export interface SingleChoiceQuestionParams extends BaseQuestionParams {
    options: QuestionOption[],
    allowOther: boolean,
    otherText: string,
}

export class SingleChoiceQuestion extends BaseQuestion {
    options: QuestionOption[];
    allowOther: boolean;
    otherText: string;

    constructor(params: SingleChoiceQuestionParams) {
        super(params);
        this.options = params.options
        this.allowOther = params.allowOther
        this.otherText = params.otherText
    }

    getComponent() {
        return SingleRadioEdit
    }

    getPreviewComponent() {
        return SingleRadioPreview
    }

    getDefaultValue(): any {
        return ""
    }

    validate(value: any): boolean | { isValid: boolean; message: string } {
        if (this.isRequired && (!value || value === '')) {
            return {isValid: false, message: '此题为必答题'};
        }
        return true;
    }

    toJSON(): object {
        return {
            ...super.toJSON(),
            options: this.options,
            allowOther: this.allowOther,
            otherText: this.otherText
        };
    }

    static fromJSON(json: any): SingleChoiceQuestion {
        return new SingleChoiceQuestion({
            ...json,
        })
    }

    // 特定于单选题的方法
    addOption(text: string): void {

        this.options.push({
            id: uuid(),
            text: text,
            value: uuid()
        });
    }

    clone(): SingleChoiceQuestion {
        return new SingleChoiceQuestion(
            {
                options: this.options,
                id: this.id,
                allowOther: this.allowOther,
                otherText: this.otherText,
                isRequired: this.isRequired,
                isVisible: this.isVisible,
                validationRules: this.validationRules,
                title: this.title,
                type: this.type,
                description: this.description,
                sort: this.sort
            }
        )
    }

    removeOption(optionId: string): void {
        this.options = this.options.filter(opt => opt.id !== optionId);
    }
}