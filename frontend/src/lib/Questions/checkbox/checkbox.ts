import {BaseQuestion} from "../BaseQuestion.ts";
import {QuestionOption, SingleChoiceQuestionParams} from "../radio/radio.ts";
import MultipleChoiceEditComponent from "./MultiChoiceEdit.tsx";
import MultipleChoicePreviewComponent from "./MultiChoicePreview.tsx";

export interface MultiChoiceParams extends SingleChoiceQuestionParams {
    minSelected?: number;
    maxSelected?: number;
    randomizeOptions: boolean; // 是否随机排序选项
    displayInColumns: number; // 选项分列显示
    exclusiveOptions: number[]; // 互斥选项IDs
}

export class MultipleChoiceQuestion extends BaseQuestion {
    options: QuestionOption[];
    allowOther: boolean;
    otherText: string;
    minSelected?: number; // 最少选择数量
    maxSelected?: number; // 最多选择数量
    randomizeOptions: boolean; // 是否随机排序选项
    displayInColumns: number; // 选项分列显示
    exclusiveOptions: number[]; // 互斥选项IDs
    constructor(params: MultiChoiceParams) {
        super(params);
        this.options = params.options || [];
        this.allowOther = params.allowOther || false;
        this.otherText = params.otherText || '其他';
        this.minSelected = params.minSelected;
        this.maxSelected = params.maxSelected;
        this.randomizeOptions = params.randomizeOptions || false;
        this.displayInColumns = params.displayInColumns || 1;
        this.exclusiveOptions = params.exclusiveOptions || [];
    }

    getComponent(): React.ComponentType<any> {
        return MultipleChoiceEditComponent;
    }

    getPreviewComponent(): React.ComponentType<any> {
        return MultipleChoicePreviewComponent;
    }

    getDefaultValue(): any {
        return []; // 多选题默认值为空数组
    }

    validate(value: string[]): boolean | { isValid: boolean; message: string } {
        // 检查是否必填
        if (this.isRequired && (!value || value.length === 0)) {
            return {isValid: false, message: '此题为必答题'};
        }

        // 检查最少选择数量
        if (this.minSelected && value.length < this.minSelected) {
            return {
                isValid: false,
                message: `请至少选择 ${this.minSelected} 个选项`
            };
        }

        // 检查最多选择数量
        if (this.maxSelected && value.length > this.maxSelected) {
            return {
                isValid: false,
                message: `最多只能选择 ${this.maxSelected} 个选项`
            };
        }

        return true;
    }

    toJSON(): object {
        return {
            ...super.toJSON(),
            options: this.options,
            allowOther: this.allowOther,
            otherText: this.otherText,
            minSelected: this.minSelected,
            maxSelected: this.maxSelected,
            randomizeOptions: this.randomizeOptions,
            displayInColumns: this.displayInColumns,
            exclusiveOptions: this.exclusiveOptions
        };
    }

    static fromJSON(json: any): MultipleChoiceQuestion {
        return new MultipleChoiceQuestion({
            id: json.id,
            sort: json.sort,
            type: json.type,
            title: json.title,
            description: json.description,
            isRequired: json.isRequired,
            isVisible: json.isVisible,
            validationRules: json.validationRules,
            options: json.options,
            allowOther: json.allowOther,
            otherText: json.otherText,
            minSelected: json.minSelected,
            maxSelected: json.maxSelected,
            randomizeOptions: json.randomizeOptions,
            displayInColumns: json.displayInColumns,
            exclusiveOptions: json.exclusiveOptions
        });
    }

    clone(): MultipleChoiceQuestion {
        return new MultipleChoiceQuestion({
            id: this.id, // 生成新ID
            sort: this.sort,
            type: this.type,
            title: this.title,
            description: this.description,
            isRequired: this.isRequired,
            isVisible: this.isVisible,
            validationRules: [...this.validationRules],
            options: this.options.map(opt => ({...opt})),
            allowOther: this.allowOther,
            otherText: this.otherText,
            minSelected: this.minSelected,
            maxSelected: this.maxSelected,
            randomizeOptions: this.randomizeOptions,
            displayInColumns: this.displayInColumns,
            exclusiveOptions: [...this.exclusiveOptions]
        });
    }

    // 特定于多选题的方法
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
        // 同时从互斥选项中移除
        this.exclusiveOptions = this.exclusiveOptions.filter(id => id !== optionId);
    }

    toggleExclusiveOption(optionId: number): void {
        if (this.exclusiveOptions.includes(optionId)) {
            this.exclusiveOptions = this.exclusiveOptions.filter(id => id !== optionId);
        } else {
            this.exclusiveOptions.push(optionId);
        }
    }

    isExclusiveOption(optionId: number): boolean {
        return this.exclusiveOptions.includes(optionId);
    }
}