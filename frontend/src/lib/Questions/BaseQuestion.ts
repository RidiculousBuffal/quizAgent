import React from "react";
import {QuestionType} from "./QuestionType";

export interface BaseValidationRule {
    required: boolean;
    message?: string;
    validator?: (value: any) => boolean | Promise<boolean>;
}

export interface BaseQuestionPreviewParams {
    value: any,
    onChange: (value: any) => void;
    showValidation?: boolean
    question: any
}

export interface BaseDisplayParams {
    question: any,
    answer: any
}

export interface BaseQuestionEditParams {
    question: any,
    onChange: (question: any) => void;
}

export interface BaseQuestionParams {
    id: number;
    sort: number;
    type: QuestionType;
    title: string;
    description?: string;
    isRequired?: boolean;
    isVisible?: boolean;
    validationRules?: BaseValidationRule[];
}

export interface BaseStatisticsProps {
    question: any;
    answers: Array<{
        user: string;
        parsedAnswer: any;
    }>;
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
    component: React.ComponentType<BaseQuestionEditParams>;
    previewComponent: React.ComponentType<BaseQuestionPreviewParams>;
    displayComponent: React.ComponentType<BaseDisplayParams>
    statisticComponent: React.ComponentType<BaseStatisticsProps>

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
        this.displayComponent = this.getDisplayComponent();
        this.statisticComponent = this.getStatisticsComponent();
    }

    //抽象方法
    abstract getComponent(): React.ComponentType<BaseQuestionEditParams>;

    abstract getPreviewComponent(): React.ComponentType<BaseQuestionPreviewParams>;

    abstract getDisplayComponent(): React.ComponentType<BaseDisplayParams>;

    abstract getDefaultValue(): any;

    abstract validate(value: any): boolean | { isValid: boolean, message?: string };

    abstract getStatisticsComponent(): React.ComponentType<BaseStatisticsProps>

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
