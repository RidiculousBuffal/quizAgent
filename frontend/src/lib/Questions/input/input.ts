import { BaseQuestion, BaseQuestionParams } from "../BaseQuestion.ts";

export interface ValidationFunction {
    validate: (value: string) => boolean | { isValid: boolean; message: string };
    errorMessage?: string;
}

export interface FillBlankParams extends BaseQuestionParams {
    blankCount: number;                // 填空数量
    blankLabels: string[];            // 每个填空的标签
    answerType: 'text' | 'number';     // 答案类型：文本或数字

    // 替换具体限制为自定义验证函数
    validators: ValidationFunction[][];  // 每个填空的验证函数数组

    // 保留基础限制作为便捷选项
    // caseSensitive: boolean;            // 是否区分大小写（文本类型适用）
    // allowDecimal?: boolean;            // 是否允许小数（数字类型适用）
    // minLength?: number;                // 最小字符长度（文本类型适用）
    // maxLength?: number;                // 最大字符长度（文本类型适用）
    // minValue?: number;                 // 最小值（数字类型适用）
    // maxValue?: number;                 // 最大值（数字类型适用）

    correctAnswers: string[][];       // 正确答案列表，每个填空可以有多个正确答案
    placeholder?: string;              // 填空占位符文本
    inlineMode: boolean;               // 是否为行内填空模式（在文本中嵌入填空）
    inlineText?: string;               // 行内模式的文本内容（使用 {{blank}} 标记填空位置）
}

export class FillBlankQuestion extends BaseQuestion {
    blankCount: number;
    blankLabels: string[];
    answerType: 'text' | 'number';
    // caseSensitive: boolean;
    validators: ValidationFunction[][];
    // allowDecimal?: boolean;
    // minLength?: number;
    // maxLength?: number;
    // minValue?: number;
    // maxValue?: number;
    correctAnswers: string[][];
    placeholder: string;
    inlineMode: boolean;
    inlineText?: string;

    constructor(params: FillBlankParams) {
        super(params);
        this.blankCount = params.blankCount || 1;
        this.blankLabels = params.blankLabels || [];
        this.answerType = params.answerType || 'text';
        // this.caseSensitive = params.caseSensitive || false;
        this.validators = params.validators || [];
        // this.allowDecimal = params.allowDecimal;
        // this.minLength = params.minLength;
        // this.maxLength = params.maxLength;
        // this.minValue = params.minValue;
        // this.maxValue = params.maxValue;
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

        // 确保验证函数数组与填空数量一致
        while (this.validators.length < this.blankCount) {
            this.validators.push([]);
        }

        // 将基础限制转换为验证函数
        // this._convertBasicValidatorsToFunctions();
    }

    // 添加自定义验证函数
    addValidator(blankIndex: number, validator: ValidationFunction): void {
        if (blankIndex >= 0 && blankIndex < this.blankCount) {
            this.validators[blankIndex].push(validator);
        }
    }

    // 清除指定填空的所有验证函数
    clearValidators(blankIndex: number): void {
        if (blankIndex >= 0 && blankIndex < this.blankCount) {
            this.validators[blankIndex] = [];
        }
    }

    getComponent(): React.ComponentType<any> {
        throw new Error("Method not implemented.");
    }

    getPreviewComponent(): React.ComponentType<any> {
        throw new Error("Method not implemented.");
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

            // 应用所有验证函数
            for (const validator of this.validators[i]) {
                const result = validator.validate(value);

                if (typeof result === 'boolean') {
                    if (!result) {
                        return {
                            isValid: false,
                            message: validator.errorMessage || `${this.blankLabels[i]}的输入无效`
                        };
                    }
                } else if (!result.isValid) {
                    return {
                        isValid: false,
                        message: result.message || validator.errorMessage || `${this.blankLabels[i]}的输入无效`
                    };
                }
            }
        }

        return true;
    }
}