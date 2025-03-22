import React from "react";
import { QuestionType } from "./QuestionType";

export interface BaseValidationRule {
    required: boolean;
    message?: string;
    validator?: (value: any) => boolean | Promise<boolean>;
}
export interface BaseQuestionParams{
    id: number;
    sort: number;
    type: QuestionType;
    title: string;
    description?: string;
    isRequired?: boolean;
    isVisible?: boolean;
    validationRules?: BaseValidationRule[];
}
export abstract class BaseQuestion {
    //基本属性:
    id: number;
    sort: number;
    type: QuestionType;
    title: string;
    description?: string;
    isRequired: boolean;
    isVisible: boolean;
    validationRules: BaseValidationRule[];
    //组件
    component: React.ComponentType<any>;
    previewComponent: React.ComponentType<any>;

    // 构造函数
    constructor(params: BaseQuestionParams) {
        this.id = params.id;
        this.sort = params.sort;
        this.type = params.type;
        this.title = params.title;
        this.description = params.description || '';
        this.isRequired = params.isRequired !== undefined ? params.isRequired : false;
        this.isVisible = params.isVisible !== undefined ? params.isVisible : true;
        this.validationRules = params.validationRules || [];

        // 子类需要实现这两个属性
        this.component = this.getComponent();
        this.previewComponent = this.getPreviewComponent();
    }

    //抽象方法
    abstract getComponent(): React.ComponentType<any>;

    abstract getPreviewComponent(): React.ComponentType<any>;

    abstract getDefaultValue(): any;

    abstract validate(value: any): boolean | { isValid: boolean, message?: string };

    toJSON(): object {
        return {
            id: this.id,
            sort: this.sort,
            type: this.type,
            title: this.title,
            description: this.description,
            isRequired: this.isRequired,
            isVisible: this.isVisible,
            validationRules: this.validationRules,
        }
    }

    static fromJSON(json: any): BaseQuestion {
        throw new Error('子类必须实现 fromJSON 方法');
    }

    clone(): BaseQuestion {
        throw new Error('子类必须实现 clone 方法')
    }
}