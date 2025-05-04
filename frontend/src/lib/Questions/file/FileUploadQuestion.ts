import {v4 as uuid} from 'uuid';
import {BaseDisplayParams, BaseQuestion, BaseQuestionParams, BaseStatisticsProps} from "../BaseQuestion.ts";
import React from "react";
import {QuestionType} from "../QuestionType";
import FileUploadEdit from "./FileUploadEdit.tsx";
import FileUploadPreview from "./FileUploadPreview.tsx";
import FileUploadDisplay from "./FileUploadDisplay.tsx";
import FileUploadStatistics from "./FileUploadStatistics.tsx";

export interface FileUploadQuestionParams extends BaseQuestionParams {
    maxFileSize?: number; // 文件大小限制，单位为字节
    allowedFileTypes?: string[]; // 允许的文件类型，如 ['.pdf', '.docx', '.txt']
    maxFiles?: number; // 最大文件数量
    convertToMarkdown?: boolean; // 是否将文本文件转换为Markdown
}

export interface FileUploadAnswer {
    fileUrls: string[]; // S3上的文件链接
    fileNames: string[]; // 原始文件名
    fileSizes: number[]; // 文件大小
    fileTypes: string[]; // 文件类型
    markdown_details?: string; // 文本文件转换为Markdown的结果
}

export class FileUploadQuestion extends BaseQuestion {
    maxFileSize: number;
    allowedFileTypes: string[];
    maxFiles: number;
    convertToMarkdown: boolean;

    constructor(params: FileUploadQuestionParams) {
        super(params);
        this.maxFileSize = params.maxFileSize || 10 * 1024 * 1024; // 默认10MB
        this.allowedFileTypes = params.allowedFileTypes || []; // 默认不限制文件类型
        this.maxFiles = params.maxFiles || 1; // 默认最多上传1个文件
        this.convertToMarkdown = params.convertToMarkdown !== undefined ? params.convertToMarkdown : true;
    }

    getComponent() {
        return FileUploadEdit;
    }

    getPreviewComponent() {
        return FileUploadPreview;
    }

    getDisplayComponent() {
        return FileUploadDisplay;
    }

    getStatisticsComponent() {
        return FileUploadStatistics;
    }

    getDefaultValue(): FileUploadAnswer {
        return {
            fileUrls: [],
            fileNames: [],
            fileSizes: [],
            fileTypes: []
        };
    }

    validate(value: FileUploadAnswer): boolean | { isValid: boolean; message: string } {
        if (this.isRequired && (!value || !value.fileUrls || value.fileUrls.length === 0)) {
            return {isValid: false, message: '此题为必答题'};
        }

        if (value && value.fileUrls && value.fileUrls.length > this.maxFiles) {
            return {isValid: false, message: `最多只能上传${this.maxFiles}个文件`};
        }

        return true;
    }

    toJSON(): object {
        return {
            ...super.toJSON(),
            maxFileSize: this.maxFileSize,
            allowedFileTypes: this.allowedFileTypes,
            maxFiles: this.maxFiles,
            convertToMarkdown: this.convertToMarkdown
        };
    }

    static fromJSON(json: any): FileUploadQuestion {
        return new FileUploadQuestion({
            ...json,
        });
    }

    clone(): FileUploadQuestion {
        return new FileUploadQuestion({
            id: this.id,
            type: this.type,
            title: this.title,
            description: this.description,
            isRequired: this.isRequired,
            isVisible: this.isVisible,
            validationRules: this.validationRules,
            sort: this.sort,
            maxFileSize: this.maxFileSize,
            allowedFileTypes: [...this.allowedFileTypes],
            maxFiles: this.maxFiles,
            convertToMarkdown: this.convertToMarkdown
        });
    }
}