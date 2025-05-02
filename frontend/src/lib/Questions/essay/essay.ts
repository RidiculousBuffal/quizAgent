import { BaseDisplayParams, BaseQuestion, BaseQuestionParams, BaseStatisticsProps } from "../BaseQuestion.ts";
import React from "react";
import EssayEdit from "./EssayEdit.tsx";
import EssayPreview from "./EssayPreview.tsx";
import EssayDisplay from "./EssayDisplay.tsx";
import EssayStatistics from "./EssayStatistics.tsx";

export interface EssayQuestionParams extends BaseQuestionParams {
    minLength?: number;           // 最小字数要求
    maxLength?: number;           // 最大字数限制
    placeholder?: string;         // 占位符文本
    allowMarkdown: boolean;       // 是否允许Markdown格式
    initialTemplate?: string;     // 初始模板文本
    hideWordCount?: boolean;      // 是否隐藏字数统计
}

export class EssayQuestion extends BaseQuestion {
    minLength?: number;
    maxLength?: number;
    placeholder: string;
    allowMarkdown: boolean;
    initialTemplate?: string;
    hideWordCount: boolean;

    constructor(params: EssayQuestionParams) {
        super(params);
        this.minLength = params.minLength;
        this.maxLength = params.maxLength;
        this.placeholder = params.placeholder || '请在此输入您的回答...';
        this.allowMarkdown = params.allowMarkdown !== undefined ? params.allowMarkdown : true;
        this.initialTemplate = params.initialTemplate;
        this.hideWordCount = params.hideWordCount || false;
    }

    getComponent(): React.ComponentType<any> {
        return EssayEdit;
    }

    getPreviewComponent(): React.ComponentType<any> {
        return EssayPreview;
    }

    getDisplayComponent(): React.ComponentType<BaseDisplayParams> {
        return EssayDisplay;
    }

    getDefaultValue() {
        return this.initialTemplate || '';
    }

    validate(value: string): boolean | { isValid: boolean; message?: string; } {
        // 如果必填但值为空
        if (this.isRequired && (!value || value.trim() === '')) {
            return { isValid: false, message: '此题为必答题，请填写您的回答' };
        }

        // 检查最小字数
        if (this.minLength && value && value.length < this.minLength) {
            return {
                isValid: false,
                message: `回答不能少于${this.minLength}个字符`
            };
        }

        // 检查最大字数
        if (this.maxLength && value && value.length > this.maxLength) {
            return {
                isValid: false,
                message: `回答不能超过${this.maxLength}个字符`
            };
        }

        return true;
    }

    getStatisticsComponent(): React.ComponentType<BaseStatisticsProps> {
        return EssayStatistics;
    }

    toJSON(): object {
        return {
            ...super.toJSON(),
            minLength: this.minLength,
            maxLength: this.maxLength,
            placeholder: this.placeholder,
            allowMarkdown: this.allowMarkdown,
            initialTemplate: this.initialTemplate,
            hideWordCount: this.hideWordCount
        }
    }

    static fromJSON(json: any): EssayQuestion {
        return new EssayQuestion(json);
    }

    clone(): BaseQuestion {
        return new EssayQuestion({
            ...this.toJSON() as EssayQuestionParams
        });
    }
}