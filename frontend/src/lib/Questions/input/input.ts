import { BaseQuestion, BaseQuestionParams } from "../BaseQuestion.ts";
import InputEdit from "./inputEdit.tsx";
import InputPreview from "./inputPreview.tsx";

export interface FillBlankParams extends BaseQuestionParams {
    blankCount: number;                // 填空数量
    blankLabels: string[];            // 每个填空的标签(填空题左侧的文本)
    answerType: 'text' | 'number';     // 答案类型：文本或数字

    correctAnswers: string[][];       // 正确答案列表，每个填空可以有多个正确答案
    placeholder?: string;              // 填空占位符文本
    inlineMode: boolean;               // 是否为行内填空模式（在文本中嵌入填空）
    inlineText?: string;               // 行内模式的文本内容（使用 {{blank}} 标记填空位置）
}

export class FillBlankQuestion extends BaseQuestion {
    blankCount: number;
    blankLabels: string[];
    answerType: 'text' | 'number';
    correctAnswers: string[][];
    placeholder: string;
    inlineMode: boolean;
    inlineText?: string;

    constructor(params: FillBlankParams) {
        super(params);
        this.blankCount = params.blankCount || 1;
        this.blankLabels = params.blankLabels || [];
        this.answerType = params.answerType || 'text';
        this.correctAnswers = params.correctAnswers || [];
        this.placeholder = params.placeholder || '请在此输入';
        this.inlineMode = params.inlineMode || false;
        this.inlineText = params.inlineText;

        // 确保标签数量与填空数量一致
        while (this.blankLabels.length < this.blankCount) {
            this.blankLabels.push(`填空 ${this.blankLabels.length + 1}`);
        }

        // 确保正确答案数组与填空数量一致
        while (this.correctAnswers.length < this.blankCount) {
            this.correctAnswers.push([]);
        }
    }

    getComponent(): React.ComponentType<any> {
        return InputEdit;
    }

    getPreviewComponent(): React.ComponentType<any> {
        return InputPreview;
    }

    getDefaultValue() {
        // 返回与填空数量相同长度的空字符串数组
        return Array(this.blankCount).fill('');
    }

    validate(values: string[]): boolean | { isValid: boolean; message?: string; } {
        // 检查是否必填
        if (this.isRequired) {
            const isEmpty = values.some(value => !value || value.trim() === '');
            if (isEmpty) {
                return { isValid: false, message: '此题为必答题，所有填空都需要填写' };
            }
        }

        // 应用自定义验证函数
        for (let i = 0; i < Math.min(values.length, this.blankCount); i++) {
            const value = values[i];

            // 跳过空值的验证（如果不是必填项）
            if (!this.isRequired && (!value || value.trim() === '')) {
                continue;
            }

            // 如果是数字类型，进行数字验证
            if (this.answerType === 'number' && !/^-?\d+(\.\d+)?$/.test(value)) {
                return {
                    isValid: false,
                    message: `${this.blankLabels[i]}必须是有效的数字`
                };
            }
        }

        return true;
    }

    toJSON(): object {
        return {
            ...super.toJSON(),
            blankCount: this.blankCount,
            blankLabels: this.blankLabels,
        }
    }

    static fromJSON(json: any): FillBlankQuestion {
        return new FillBlankQuestion(json);
    }
}