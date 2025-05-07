// src/api/userApi.ts（自动补全接口）
import {fetchAPI} from "./base";

export interface UserType {
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar: string;
}

export async function autocompleteUsers(keyword: string): Promise<UserType[] | null> {
    if (!keyword) return [];
    return await fetchAPI<UserType[]>(`/user/autocomplete?keyword=${encodeURIComponent(keyword)}`, {});
}

export async function getUserInfo(userId: string): Promise<UserType | null> {
    if (!userId) return null;
    return await fetchAPI<UserType>(`/user/getNameAndEmailById?userId=${encodeURIComponent(userId)}`, {});
}

export async function updateUserAvatar(url: string): Promise<string | null> {
    return await fetchAPI('/user/updateUserAvatar', {
        body: url,
        method: "POST"
    })
}

// 定义 API Key 模型类型（根据 Sa-Token 的 ApiKeyModel 结构）
export interface ApiKeyModel {
    apiKey: string;
    loginId: number | string;
    title: string;
    intro: string;
    scope?: string[];
    expiresTime: number;
    isValid: boolean;
    extra?: Record<string, any>;
}

// API Key 创建接口的请求参数类型
export interface CreateApiKeyParams {
    title: string;
    intro: string;
    expiresTime?: number; // 可选，默认为-1（永不过期）
}

// API Key 创建接口的响应类型
export interface CreateApiKeyResponse {
    apiKey: string; // 返回创建成功的 API Key 值
}


/**
 * 创建新的 API Key
 * @param params 创建 API Key 的参数
 * @returns Promise<CreateApiKeyResponse | null> 返回创建的 API Key 值
 */
export const createApiKey = async (params: CreateApiKeyParams): Promise<string | null> => {
    const queryParams = new URLSearchParams({
        title: params.title,
        intro: params.intro,
        ...(params.expiresTime !== undefined && {expiresTime: params.expiresTime.toString()}),
    });
    const url = `/apiKey/create?${queryParams.toString()}`;
    return await fetchAPI<string>(url, {
        method: 'GET',
    });
};

/**
 * 获取当前用户的 API Key 列表
 * @returns Promise<ListApiKeyResponse | null> 返回用户的 API Key 列表
 */
export const getApiKeyList = async (): Promise<ApiKeyModel[] | null> => {
    const url = `/apiKey/list`;
    return await fetchAPI<ApiKeyModel[]>(url, {
        method: 'GET',
    });
};


export const deleteApiKey = async (apiKey: string): Promise<boolean | null> => {
    const queryParams = new URLSearchParams({
        apiKey: apiKey,
    });
    const url = `/apiKey/delete?${queryParams.toString()}`;
    const result = await fetchAPI<boolean>(url, {
        method: 'GET',
    });
    return result;
};