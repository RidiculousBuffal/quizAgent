import React from "react";
import {BaseQuestion, BaseQuestionParams} from "../BaseQuestion.ts";
import SingleRadioEdit from "./SingleRadioEdit.tsx";
import SingleRadioPreview from "./SingleRadioPreview.tsx";

export interface QuestionOption {
    id: number;
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

    getComponent(): React.ComponentType<any> {
        return SingleRadioEdit
    }

    getPreviewComponent(): React.ComponentType<any> {
        return SingleRadioPreview
    }

    getDefaultValue(): any {
        return []
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
        const newId = this.options.length > 0
            ? Math.max(...this.options.map(o => o.id)) + 1
            : 1;

        this.options.push({
            id: newId,
            text: text,
            value: newId.toString()
        });
    }

    removeOption(optionId: number): void {
        this.options = this.options.filter(opt => opt.id !== optionId);
    }
}