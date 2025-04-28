import {fetchAPI} from './base';

export interface QuizPermissionDto {
    id?: number;
    quizId: number;
    quizPermissionTypeId: number;
    details: string | QuizPermissionDetails; // 支持对象传入
}

export interface QuizPermissionDetails {
    needLogin: boolean;
    allowUsers?: Array<string>;
    denyUsers?: Array<string>;
}

export interface QuizPermissionTypeDto {
    quizPermissionTypeId: number;
    quizPermissionTypeName: string;
}

/**
 * 工具函数：保证details为对象格式
 */
function parseDetails(details: string | QuizPermissionDetails): QuizPermissionDetails | null {
    if (typeof details === 'string') {
        try {
            return JSON.parse(details ?? '{}');
        } catch (e) {
            return null
        }
    }
    return details || {};
}

/**
 * 获取指定问卷的权限详情（包括 details 字段自动转对象）
 * /quizpermission/details/{quizId}
 */
export async function getQuizPermissionDetails(quizId: number) {
    const raw = await fetchAPI<QuizPermissionDto>(`/quizpermission/details/${quizId}`,{});
    if (!raw) return null;
    return {
        ...raw,
        details: parseDetails(raw.details),
    };
}

/**
 * 检查当前用户/游客是否拥有某问卷权限
 * /quizpermission/public/check/{quizId}
 */
export async function checkQuizPermission(quizId: number): Promise<boolean | null> {
    return await fetchAPI<boolean>(`/quizpermission/public/check/${quizId}`,{});
}

/**
 * 新增或更新问卷权限
 * /quizpermission/save
 * 入参可传 details 为对象，会自动转为 JSON 字符串
 */
export async function saveQuizPermission(data: QuizPermissionDto): Promise<QuizPermissionDto> {
    const payload: QuizPermissionDto = {
        ...data,
        details: typeof data.details === 'string' ? data.details : JSON.stringify(data.details ?? {}),
    };
    const res = await fetchAPI<QuizPermissionDto>(`/quizpermission/save`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
    if (res) {
        // 返回的 details 统一转对象格式，方便前端用
        res.details = parseDetails(res.details)!;
    }
    return res!;
}

/**
 * 删除指定问卷的权限
 * /quizpermission/{quizId}
 */
export async function deleteQuizPermission(quizId: number): Promise<boolean | null> {
    return await fetchAPI<boolean>(`/quizpermission/${quizId}`, {method: 'DELETE'});
}