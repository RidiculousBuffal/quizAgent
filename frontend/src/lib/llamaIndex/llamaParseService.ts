import {JobResponse} from "./llamaParseType.ts";

const BASE_URL = import.meta.env.VITE_APP_LLAMA_INDEX_BASE_URL
const API_KEY = import.meta.env.VITE_APP_LLAMA_INDEX_KEY

export async function uploadFileForParsing(file: File): Promise<string> {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${API_KEY}`);

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/api/v1/parsing/upload`, {
        method: 'POST',
        body: formData,
        headers: myHeaders,
    });

    if (!response.ok) {
        throw new Error(`上传失败: ${response.statusText}`);
    }

    const result = await response.json();
    return result.id; // 返回job ID
}

export async function getJobStatus(jobId: string): Promise<JobResponse> {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${API_KEY}`);

    const response = await fetch(`${BASE_URL}/api/v1/parsing/job/${jobId}`, {
        headers: myHeaders,
    });

    if (!response.ok) {
        throw new Error(`获取任务状态失败: ${response.statusText}`);
    }

    return await response.json() as JobResponse;
}

export async function getMarkdownResult(jobId: string): Promise<string> {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${API_KEY}`);

    const response = await fetch(`${BASE_URL}/api/v1/parsing/job/${jobId}/result/raw/markdown`, {
        headers: myHeaders,
    });

    if (!response.ok) {
        throw new Error(`获取Markdown结果失败: ${response.statusText}`);
    }

    return await response.text();
}

// 轮询任务状态直到完成
export async function waitForParsingCompletion(jobId: string,
                                               onStatusChange?: (status: string) => void): Promise<string> {

    const pollInterval = 2000; // 轮询间隔2秒
    const maxAttempts = 30; // 最多轮询30次（约1分钟）

    let attempts = 0;

    return new Promise((resolve, reject) => {
        const checkStatus = async () => {
            try {
                const jobResponse = await getJobStatus(jobId);

                if (onStatusChange) {
                    onStatusChange(jobResponse.status);
                }

                if (jobResponse.status.toUpperCase() === 'SUCCESS') {
                    // 任务成功，获取Markdown结果
                    const markdown = await getMarkdownResult(jobId);
                    resolve(markdown);
                    return;
                } else if (jobResponse.status.toUpperCase() === 'FAILED') {
                    // 任务失败
                    reject(new Error('文档解析失败'));
                    return;
                }

                // 任务仍在进行中
                attempts++;
                if (attempts >= maxAttempts) {
                    reject(new Error('解析超时，请稍后再试'));
                    return;
                }

                // 继续轮询
                setTimeout(checkStatus, pollInterval);
            } catch (error) {
                reject(error);
            }
        };

        // 开始轮询
        checkStatus();
    });
}

// 检测文件是否应该转换为Markdown
export function shouldConvertToMarkdown(file: File): boolean {
    const textTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    // 检查MIME类型
    if (textTypes.includes(file.type)) {
        return true;
    }

    // 检查文件扩展名
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && [
        'pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'md', 'rtf'
    ].includes(extension)) {
        return true;
    }

    return false;
}